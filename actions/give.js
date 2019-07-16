/* eslint-disable import/exports-last */
import {
    callApiAndGetData,
    updateTaxReceiptProfile
} from './user';
import _ from 'lodash';

import coreApi from '../services/coreApi';
import realtypeof from '../helpers/realtypeof';


export const actionTypes = {
    COVER_FEES: 'COVER_FEES',
    GET_BENEFICIARY_FROM_SLUG: 'GET_BENEFICIARY_FROM_SLUG',
    GET_BENIFICIARY_FOR_GROUP: 'GET_BENIFICIARY_FOR_GROUP',
    GET_COMPANY_PAYMENT_AND_TAXRECEIPT: 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT',
    GET_COMPANY_TAXRECEIPTS: 'GET_COMPANY_TAXRECEIPTS',
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT',
    SAVE_SUCCESS_DATA: 'SAVE_SUCCESS_DATA',
};

const setDonationData = (donation) => {
    const {
        giveData: {
            creditCard,
            donationAmount,
            donationMatch,
            giveTo,
        },
        selectedTaxReceiptProfile,
    } = donation;
    const donationData = {
        attributes: {
            amount: donationAmount,
        },
        relationships: {
            fund: {
                data: {
                    id: giveTo.value,
                    type: 'funds',
                },
            },
            paymentInstrument: {
                data: {
                    id: creditCard.value,
                    type: 'paymentInstruments',
                },
            },
            taxReceiptProfile: {
                data: {
                    id: selectedTaxReceiptProfile.id,
                    type: 'taxReceiptProfiles',
                },
            },
        },
        type: 'donations',
    };
    if (donationMatch.value > 0) {
        donationData.relationships.employeeRole = {
            data: {
                id: donationMatch.value,
                type: 'roles',
            },
        };
    }

    return donationData;
};

const saveDonations = (donation) => {
    const {
        giveData: {
            automaticDonation,
            giftType,
            noteToSelf,
        },
    } = donation;
    let donationUrl = '/donations';
    const donationData = setDonationData(donation);
    donationData.attributes.reason = noteToSelf;
    if (automaticDonation) {
        donationData.attributes.dayOfMonth = giftType.value;
        donationData.type = 'recurringDonations';
        donationUrl = '/recurringDonations';
    }
    const result = coreApi.post(donationUrl, {
        data: donationData,
        // uxCritical: true,
    });
    return result;
};

/**
 * Check if it is a quazi success.
 * @param  {object} error error object.
 * @return {boolean} wether quazzi succes or not
 */
const checkForQuaziSuccess = (error) => {
    if (!_.isEmpty(error) && error.length === 1) {
        const checkQuaziSuccess = error[0];
        if (!_.isEmpty(checkQuaziSuccess.meta)
            && !_.isEmpty(checkQuaziSuccess.meta.recoverableState)
            && (checkQuaziSuccess.meta.recoverableState === 'true'
            || checkQuaziSuccess.meta.recoverableState === true)) {
            return true;
        }
    }
    return false;
};



export const proceed = (flowObject, nextStep, stepIndex, lastStep = false) => {
    if (lastStep) {
        return (dispatch) => {
            let fn;
            let successData = {};
            let nextStepToProcced = nextStep;
            switch (flowObject.type) {
                case 'donations':
                    fn = saveDonations;
                    break;
                case 'give/to/friend':
                    fn = saveP2pAllocations;
                    break;
                case 'give/to/group':
                    fn = saveGroupAllocation;
                    break;
                default:
                    break;
            }

            Promise.all(
                [
                    fn(flowObject),
                ],
            ).then((results) => {
                if (!_.isEmpty(results[0])) {
                    successData = _.merge({}, flowObject);
                    // For p2p, we create an array of arrays, I'm not to clear on the
                    // the correct syntax to make this more redable.
                    // if (type === 'give/to/friend') {
                    //     fsa.payload.allocation.allocationData = results[0];
                    // } else {
                    //     fsa.payload.allocation.allocationData = results[0].data;
                    // }
                }
            }).catch((err) => {
                // logger.error(err);
                if (checkForQuaziSuccess(err.errors)) {
                    successData.quaziSuccessStatus = true;
                } else {
                    successData.quaziSuccessStatus = false;
                    nextStepToProcced = 'error';
                }
            }).finally(() => {
                dispatch({
                    payload: {
                        successData,
                    },
                    type: actionTypes.SAVE_SUCCESS_DATA,
                });
                dispatch({
                    payload: {
                        nextStep: nextStepToProcced,
                    },
                    type: actionTypes.SAVE_FLOW_OBJECT,
                });
                // fetchUser(userId);
            });
        };
    }
    return (dispatch) => {
        flowObject.nextStep = nextStep;
        if (flowObject.taxReceiptProfileAction !== 'no_change' && stepIndex === 1) {
            updateTaxReceiptProfile(
                flowObject.selectedTaxReceiptProfile,
                flowObject.taxReceiptProfileAction, dispatch,
            ).then((result) => {
                flowObject.selectedTaxReceiptProfile = result.data;
                dispatch({
                    payload: flowObject,
                    type: actionTypes.SAVE_FLOW_OBJECT,
                });
            }).catch((error) => {
                console.log(error);
            });
        } else {
            dispatch({
                payload: flowObject,
                type: actionTypes.SAVE_FLOW_OBJECT,
            });
        }
    };
};

export const reInitNextStep = (dispatch, flowObject) => {
    flowObject.nextStep = null;
    return dispatch({
        payload: flowObject,
        type: actionTypes.SAVE_FLOW_OBJECT,
    });
};

/**
 * Send the allocation data to the relevant endpoint.
 * @param  {number} companyId Id of the company
 * @return {promise}     The promise returned by the Communications utility.
 */

export const getCompanyPaymentAndTax = (dispatch, companyId) => {
    const fsa = {
        payload: {
            companyDefaultTaxReceiptProfile: {},
            companyId,
            companyPaymentInstrumentsData: [],
            taxReceiptProfiles: [],
        },
        type: actionTypes.GET_COMPANY_PAYMENT_AND_TAXRECEIPT,
    };

    return coreApi.get(`/companies/${companyId}?include=defaultTaxReceiptProfile,activePaymentInstruments,taxReceiptProfiles`).then((result) => {
        const { data } = result;
        let defaultTaxReceiptId = null;
        if (!_.isEmpty(data.relationships.defaultTaxReceiptProfile.data)) {
            defaultTaxReceiptId = data.relationships.defaultTaxReceiptProfile.data.id;
        }
        if (!_.isEmpty(result.included)) {
            const { included } = result;
            included.map((item) => {
                const {
                    attributes,
                    id,
                    type,
                } = item;
                if (type === 'paymentInstruments') {
                    fsa.payload.companyPaymentInstrumentsData.push({
                        attributes,
                        id,
                        type,
                    });
                } else if (type === 'taxReceiptProfiles') {
                    if (id === defaultTaxReceiptId) {
                        fsa.payload.companyDefaultTaxReceiptProfile = {
                            attributes,
                            id,
                            type,
                        };
                    }
                    fsa.payload.taxReceiptProfiles.push({
                        attributes,
                        id,
                        type,
                    });
                }
            });
        }
        return dispatch(fsa);
    }).catch((error) => {
        console.log(error);
    });
};

export const getBeneficiariesForGroup = (dispatch, groupId) => {
    if (groupId !== null) {
        const fsa = {
            payload: {
                benificiaryDetails: [],
            },
            type: actionTypes.GET_BENIFICIARY_FOR_GROUP,
        };
        callApiAndGetData(`/groups/${groupId}/groupBeneficiaries`)
            .then(
                (result) => {
                    if (!_.isEmpty(result)) {
                        fsa.payload.benificiaryDetails = result;
                    }
                },
            ).catch(() => {
                //Router.pushRoutes('/error');
                console.log('error page');
            }).finally(() => {
                dispatch(fsa);
            });
    } else {
        //Router.pushRoutes('/dashboard');
        console.log('dashboard');
    }
};

export const getBeneficiaryFromSlug = (dispatch, slug) => {
    if (slug !== ':slug') {
        const fsa = {
            payload: {
                charityDetails: {},
            },
            type: actionTypes.GET_BENEFICIARY_FROM_SLUG,
        };
        coreApi.get(`/beneficiaries/find_by_slug`, {
            params: {
                slug: [
                    slug,
                ],
            },
        }).then(
            (result) => {
                if (result && !_.isEmpty(result.data)) {
                    fsa.payload.charityDetails = result.data;
                }
                return dispatch(fsa);
            },
        ).catch(() => {
            //redirect('/give/error');
            console.log('redirect to error');
        }).finally(() => {
            return dispatch(fsa);
        });
    } else {
        //redirect('/dashboard');
        console.log('dashboard');
    }
};
const getCoverFeesApi = async (amount, fundId) => {
    const params = {
        attributes: {
            amount: Number(amount),
        },
        relationships: {
            fund: {
                data: {
                    id: fundId,
                    type: 'funds',
                },
            },
        },
        type: 'allocationFees',
    };

    const giveAmountData = await coreApi.post(`/allocationFees`, {
        data: params,
        //uxCritical: true,
    });

    return giveAmountData;
};

export const getCoverFees = async (feeData, fundId, giveAmount, dispatch) => {
    const fsa = {
        payload: {
            coverFees: {},
        },
        type: actionTypes.COVER_FEES,
    };
    if (!_.isEmpty(feeData)) {
        fsa.payload.coverFees = { ...feeData.coverFees };
    }
    if (!_.isEmpty(giveAmount)) {
        fsa.payload.coverFees.giveAmount = giveAmount;
        fsa.payload.coverFees.giveAmountFees = 0;
        if (giveAmount >= 5) {
            await getCoverFeesApi(giveAmount, fundId).then((result) => {
                const {
                    data: {
                        attributes: {
                            feeAmount,
                        },
                    },
                } = result;
                fsa.payload.coverFees.giveAmountFees = feeAmount;
            });
        }
    }
    // GIVEB-1912 with recent updates given we don't need 2 versions of text
    // hence no need to fetch the fees for balance
    dispatch(fsa);
};
export const getCompanyTaxReceiptProfile = (dispatch, companyId) => {
    return callApiAndGetData(`/companies/${companyId}/taxReceiptProfiles?page[size]=50&sort=-id`).then((result) => {
        // return dispatch(setTaxReceiptProfile(result, type = ''));
        const fsa = {
            payload: {
                companyTaxReceiptProfiles: (!_.isEmpty(result)) ? result : [],
                taxReceiptGetApiStatus: true,
            },
            type: actionTypes.GET_COMPANY_TAXRECEIPTS,
        };
        return dispatch(fsa);
    }).catch((error) => {
        console.log(error);
    });
};
