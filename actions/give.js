/* eslint-disable no-else-return */
/* eslint-disable import/exports-last */
import _ from 'lodash';

import { Router } from '../routes';
import coreApi from '../services/coreApi';
import {
    beneficiaryDefaultProps,
    donationDefaultProps,
    groupDefaultProps,
    p2pDefaultProps,
} from '../helpers/give/defaultProps';

import {
    callApiAndGetData,
    updateTaxReceiptProfile,
    getDonationMatchAndPaymentInstruments,
    savePaymentInstrument,
    getUserFund,
} from './user';
import {
    triggerUxCritialErrors,
} from './error';
import {
    getTaxReceiptProfileMakeDefault,
} from './taxreceipt';
export const actionTypes = {
    ADD_NEW_CREDIT_CARD_STATUS: 'ADD_NEW_CREDIT_CARD_STATUS',
    COVER_AMOUNT_DISPLAY: 'COVER_AMOUNT_DISPLAY',
    COVER_FEES: 'COVER_FEES',
    GET_ALL_COMPANY_TAX_RECEIPT_PROFILES: 'GET_ALL_COMPANY_TAX_RECEIPT_PROFILES',
    GET_ALL_USER_TAX_RECEIPT_PROFILES: 'GET_ALL_USER_TAX_RECEIPT_PROFILES',
    GET_BENEFICIARY_FROM_SLUG: 'GET_BENEFICIARY_FROM_SLUG',
    GET_BENIFICIARY_FOR_GROUP: 'GET_BENIFICIARY_FOR_GROUP',
    GET_COMPANY_PAYMENT_AND_TAXRECEIPT: 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT',
    GET_COMPANY_TAXRECEIPTS: 'GET_COMPANY_TAXRECEIPTS',
    GET_GROUP_FROM_SLUG: 'GET_GROUP_FROM_SLUG',
    GET_MATCHING_DETAILS_FOR_GROUPS: 'GET_MATCHING_DETAILS_FOR_GROUPS',
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT',
    SAVE_SUCCESS_DATA: 'SAVE_SUCCESS_DATA',
    SET_COMPANY_ACCOUNT_FETCHED: 'SET_COMPANY_ACCOUNT_FETCHED',
    SET_COMPANY_PAYMENT_ISTRUMENTS: 'SET_COMPANY_PAYMENT_ISTRUMENTS',
    SET_USER_PAYMENT_INSTRUMENTS: 'SET_USER_PAYMENT_INSTRUMENTS',
    TAX_RECEIPT_API_CALL_STATUS: 'TAX_RECEIPT_API_CALL_STATUS',
    UPDATE_COMPANY_BALANCE: 'UPDATE_COMPANY_BALANCE',
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

/**
 * @param {*} cardDetails
 * @param {*} cardHolderName
 */
const createToken = (cardDetails, cardHolderName) => new Promise((resolve, reject) => {
    cardDetails.createToken({ name: cardHolderName }).then((result) => {
        if (result.error) {
            return reject(result.error);
        }
        return resolve(result.token);
    });
});

const saveDonations = (donation) => {
    const {
        giveData: {
            giftType,
            noteToSelf,
        },
    } = donation;
    let donationUrl = '/donations';
    const donationData = setDonationData(donation);
    donationData.attributes.reason = noteToSelf;
    if (giftType.value !== 0) {
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


const postAllocation = async (allocationData) => {
    const result = await coreApi.post(`/${allocationData.type}`, {
        data: allocationData,
        // uxCritical: true,
    });
    return result;
};

const initializeAndCallAllocation = (allocation, attributes, type) => {
    const {
        giveData,
    } = allocation;

    const {
        giftType,
        giveFrom,
        giveTo,
    } = giveData;

    const allocationData = {
        attributes,
        relationships: {
            destinationFund: {
                data: {
                    id: giveTo.value,
                    type: 'accountHolders',
                },
            },
            fund: {
                data: {
                    id: giveFrom.value,
                    type: 'accountHolders',
                },
            },
        },
    };
    if (giftType.value === 0) {
        allocationData.type = (type === 'charity')
            ? 'allocations' : 'groupAllocations';
    } else {
        allocationData.type = (type === 'charity')
            ? 'recurringAllocations' : 'recurringGroupAllocations';
        allocationData.attributes.dayOfMonth = giftType.value;
    }
    return postAllocation(allocationData);
};

const saveCharityAllocation = (allocation) => {
    const {
        giveData,
    } = allocation;
    const {
        coverFees,
        dedicateGift,
        giveAmount,
        infoToShare,
        noteToCharity,
        noteToSelf,
    } = giveData;
    let attributes = {
        amount: giveAmount,
        coverFees,
        noteToCharity,
        noteToSelf,
        privacyData: infoToShare.privacyData,
        privacySetting: infoToShare.privacySetting,
    };
    if (!_.isEmpty(dedicateGift.dedicateType)) {
        attributes = {
            ...attributes,
            [dedicateGift.dedicateType]: dedicateGift.dedicateValue,
        };
    }
    return initializeAndCallAllocation(allocation, attributes, 'charity');
};

const saveGroupAllocation = (allocation) => {
    const {
        giveData,
    } = allocation;

    const {
        dedicateGift,
        giveAmount,
        infoToShare,
        noteToCharity,
        noteToSelf,
        privacyShareAddress,
        privacyShareAdminName,
        privacyShareAmount,
        privacyShareEmail,
        privacyShareName,
    } = giveData;
    let attributes = {
        amount: giveAmount,
        noteToGroup: noteToCharity,
        noteToSelf,
        privacyShareAddress,
        privacyShareAdminName,
        privacyShareAmount: giveData.giveTo.isCampaign ? false : privacyShareAmount,
        privacyShareEmail,
        privacyShareName: giveData.giveTo.isCampaign && privacyShareAdminName ? true : privacyShareName,
        privacyTrpId: privacyShareAddress ? infoToShare.privacyData : null,
    };
    if (!_.isEmpty(dedicateGift.dedicateType)) {
        attributes = {
            ...attributes,
            [dedicateGift.dedicateType]: dedicateGift.dedicateValue,
        };
    }
    return initializeAndCallAllocation(allocation, attributes, 'group');
};

const postP2pAllocations = async (allocations) => {
    const results = [];
    let parentAllocationId = null;
    for (const allocationData of allocations) {
        let data = {};
        if (parentAllocationId) {
            const parent = {
                relationships: {
                    parentAllocation: {
                        data: {
                            type: 'fundAllocations',
                            id: parentAllocationId ,
                        },
                    },
                },
            };
            data = _.merge({}, allocationData, parent);
        } else {
            data = allocationData;
        }

        // const params = {
        //     data: data,
        // };
        const result = await coreApi.post(`/${allocationData.type}`, {
            data : {
                ...data,
            },
        });
        if  (result && result.data) {
            parentAllocationId = result.data.id;
        }
        results.push(result);
    };

    return results;
};

const initializeP2pAllocations = (
    recipients,
    giveAmount,
    noteToRecipients,
    noteToSelf,
    giveFrom,
) => {
    const allocations = [];
    // _.each(recipients, (recipient) => {
    const allocationData = {
        attributes: {
            amount: giveAmount,
            noteToRecipient: noteToRecipients,
            noteToSelf,
            recipientEmails: _.replace(recipients, /[\n\r\t ]+/g, ''),
            suppressEmail: false,
        },
        relationships: {
            sourceFund: {
                data: {
                    id: giveFrom.value,
                    type: 'accountHolders',
                },
            },
        },
    };
    allocationData.type = 'fundAllocations';
    allocations.push(allocationData);
    // });

    return allocations;
};

/**
 * We want to be able to send multiple P2ps at once
 * @param {object} allocation The allocation object
 */
const saveP2pAllocations = (allocation) => {
    const {
        giveData: {
            giveAmount,
            giveFrom,
            noteToRecipients,
            noteToSelf,
            recipients,
            selectedFriendsList,
        },
    } = allocation;
    const emailArray = _.concat(selectedFriendsList.map((friend) => friend.email), recipients);
    const allocations = initializeP2pAllocations(
        emailArray,
        giveAmount,
        noteToRecipients,
        noteToSelf,
        giveFrom,
        0,
    );
    return postP2pAllocations(allocations);
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
    dispatch({
        payload: {
            companyAccountsFetched: false,
        },
        type: actionTypes.SET_COMPANY_ACCOUNT_FETCHED,
    });
    const fetchData = coreApi.get(
        `/companies/${companyId}?include=defaultTaxReceiptProfile,taxReceiptProfiles`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    );
    const paymentInstruments = coreApi.get(
        `/companies/${companyId}/activePaymentInstruments?&sort=-default`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    );
    
    Promise.all([
        fetchData,
        paymentInstruments,
    ]).then((result) => {
        const { data } = result[0];
        let defaultTaxReceiptId = null;
        if (!_.isEmpty(data.relationships.defaultTaxReceiptProfile.data)) {
            defaultTaxReceiptId = data.relationships.defaultTaxReceiptProfile.data.id;
        }
        if (!_.isEmpty(result[0].included)) {
            const { included } = result[0];
            included.map((item) => {
                const {
                    attributes,
                    id,
                    type,
                } = item;

                if (type === 'taxReceiptProfiles') {
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
        if (!_.isEmpty(result[1])) {
            fsa.payload.companyPaymentInstrumentsData = [
                ...result[1].data,
            ];
        }
        dispatch({
            payload: {
                companyAccountsFetched: true,
            },
            type: actionTypes.SET_COMPANY_ACCOUNT_FETCHED,
        });
        return dispatch(fsa);
    }).catch((error) => {
        // console.log(error);
    });
};

const callApiAndDispatchData = (dispatch, account) => {
    if (account.type === 'user') {
        dispatch(getDonationMatchAndPaymentInstruments(account.id));
    } else {
        getCompanyPaymentAndTax(dispatch, Number(account.id));
    }
};

// Fuction to convert stripe error format into JSON API error format
const transformStripeErrorToJsonApi = (err) => {
    const {
        type,
        message,
    } = err;
    const status = parseInt('402', 10);

    return {
        errors: [
            {
                detail: message,
                source: {
                    issuer: 'Stripe',
                },
                status,
                title: type,
            },
        ],
    };
};

const getAllActivePaymentInstruments = (id, dispatch, type = 'user') => {
    const url = (type === 'companies') ?
        `/companies/${id}/activePaymentInstruments?&sort=-default` :
        `/users/${id}/activePaymentInstruments?sort=-default`
    return coreApi.get(
        url,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    );
};

const setUserDefaultCreditCard = (paymentInstrumentId) => {
    return coreApi.patch(`/paymentInstruments/${Number(paymentInstrumentId)}/set_as_default`);
};

export const addNewCardAndLoad = (flowObject, isDefaultCard) => {
    return (dispatch) => {
        dispatch({
            payload: {
                creditCardApiCall: true,
            },
            type: actionTypes.ADD_NEW_CREDIT_CARD_STATUS,
        });
        const {
            giveData: {
                giveFrom,
                giveTo,
            },
        } = flowObject;
        const accountDetails = {
            id: (flowObject.type === 'donations') ? giveTo.id : giveFrom.id,
            type: (flowObject.type === 'donations') ? giveTo.type : giveFrom.type,
        };
        let addedCreditCard = null;
        return createToken(flowObject.stripeCreditCard, flowObject.cardHolderName).then((token) => {
            const paymentInstrumentsData = {
                attributes: {
                    stripeToken: token.id,
                },
                relationships: {
                    paymentable: {
                        data: {
                            id: accountDetails.id,
                            type: accountDetails.type,
                        },
                    },
                },
                type: 'paymentInstruments',
            };
            return savePaymentInstrument(paymentInstrumentsData);
        }).then((result) => {
            addedCreditCard = result;
            if (isDefaultCard) {
                return setUserDefaultCreditCard(Number(result.data.id));
            }
            return null;
        }).then((response) => {
            return getAllActivePaymentInstruments(accountDetails.id, dispatch, accountDetails.type);
        }).then((res) => {
            const userFsa = {
                payload: {
                    paymentInstrumentsData: [
                        ...res.data,
                    ],
                },
                type: actionTypes.SET_USER_PAYMENT_INSTRUMENTS,
            };
            const companyFsa = {
                payload: {
                    companyPaymentInstrumentsData: [
                        ...res.data,
                    ],
                },
                type: actionTypes.SET_COMPANY_PAYMENT_ISTRUMENTS,
            };
            if (accountDetails.type === 'companies') {
                dispatch(companyFsa);
            } else {
                dispatch(userFsa);
            }
            return addedCreditCard;
        }).catch((err) => {
            triggerUxCritialErrors(err.errors || err, dispatch);
            return Promise.reject(err);
        }).finally(() => {
            dispatch({
                payload: {
                    creditCardApiCall: false,
                },
                type: actionTypes.ADD_NEW_CREDIT_CARD_STATUS,
            });
        });
    };
};

// eslint-disable-next-line import/exports-last
export const getAllTaxReceipts = (id, dispatch, type = "user") => {
    
    const accountType = (type === "user") ? "users" : "companies";
    return coreApi.get(
        `/${accountType}/${id}?include=defaultTaxReceiptProfile,taxReceiptProfiles`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    );
};

const addNewTaxReceiptProfile = (taxReceiptProfile) => {
    return coreApi.post('/taxReceiptProfiles', {
        data: taxReceiptProfile,
    });
};
// eslint-disable-next-line max-len
export const addNewTaxReceiptProfileAndLoad = (flowObject, selectedTaxReceiptProfile, isDefaultChecked) => {
    return (dispatch) => {
        const {
            giveData: {
                giveTo,
                giveFrom,
            },
        } = flowObject;
        const fsa = {
            payload: {
                companyDefaultTaxReceiptProfile: {},
                defaultTaxReceiptProfile: {},
                taxReceiptProfiles: [],
            },
            type: actionTypes.GET_ALL_USER_TAX_RECEIPT_PROFILES,
        };
        let newTaxReceipt = {};
        const accountDetails = {
            id: (flowObject.type === 'donations') ? giveTo.id : giveFrom.id,
            type: (flowObject.type === 'donations') ? giveTo.type : giveFrom.type,
        };
        
        return addNewTaxReceiptProfile(selectedTaxReceiptProfile).then((result) => {
            newTaxReceipt = result;
            const {
                id,
            } = result.data;
            if (isDefaultChecked) {
                return getTaxReceiptProfileMakeDefault(id);
            }
            return null;
        }).then((response) => {
            const {
                attributes,
            } = newTaxReceipt.data;
            attributes.isDefault = isDefaultChecked;
            return getAllTaxReceipts(Number(accountDetails.id), dispatch, accountDetails.type);
        }).then((resultData) => {
            if (accountDetails.type === 'companies') {
                fsa.type = actionTypes.GET_ALL_COMPANY_TAX_RECEIPT_PROFILES;
            }
            if (!_.isEmpty(resultData.included)) {
                const { included } = resultData;
                let defaultTaxReceiptId = null;
                if (!_.isEmpty(resultData.data.relationships.defaultTaxReceiptProfile.data)) {
                    defaultTaxReceiptId = resultData.data.relationships.defaultTaxReceiptProfile.data.id;
                }
                included.map((item) => {
                    const {
                        attributes,
                        id,
                        type,
                    } = item;
                    if (type === 'taxReceiptProfiles') {
                        if (id === defaultTaxReceiptId && accountDetails.type === 'companies') {
                            fsa.payload.companyDefaultTaxReceiptProfile = {
                                attributes,
                                id,
                                type,
                            };
                        }
                        if (id === defaultTaxReceiptId && accountDetails.type === 'user') {
                            fsa.payload.defaultTaxReceiptProfile = {
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
                dispatch(fsa);     
                return newTaxReceipt;
            }
        }).catch((err) => {
            triggerUxCritialErrors(err.errors || err, dispatch);
            return Promise.reject(err);
        });
    };
};

export const proceed = (
    flowObject, nextStep, stepIndex, lastStep = false, currentUserId = null,
) => {
    if (lastStep) {
        return (dispatch) => {
            let fn;
            let successData = _.merge({}, flowObject);
            let nextStepToProcced = nextStep;
            switch (flowObject.type) {
                case 'donations':
                    fn = saveDonations;
                    break;
                case 'give/to/charity':
                    fn = saveCharityAllocation;
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
                    successData.result = results[0];
                }
            }).catch((err) => {
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
                const defaultProps = {
                    'donations': donationDefaultProps,
                    'give/to/charity': beneficiaryDefaultProps,
                    'give/to/friend': p2pDefaultProps,
                    'give/to/group': groupDefaultProps,
                };
                const defaultPropsData = _.cloneDeep(defaultProps[flowObject.type]);
                const payload = {
                    ...defaultPropsData.flowObject,
                };
                payload.nextStep = nextStepToProcced;
                payload.stepsCompleted = true;
                const fsa = {
                    payload,
                    type: actionTypes.SAVE_FLOW_OBJECT,
                };
                dispatch(fsa);
                getUserFund(dispatch, currentUserId);
            });
        };
    }
    return (dispatch) => {
        flowObject.nextStep = nextStep;
        dispatch({
            payload: flowObject,
            type: actionTypes.SAVE_FLOW_OBJECT,
        });
    };
};

export const reInitNextStep = (dispatch, flowObject) => {
    flowObject.nextStep = null;
    return dispatch({
        payload: flowObject,
        type: actionTypes.SAVE_FLOW_OBJECT,
    });
};

export const getBeneficiariesForGroup = (dispatch, id, type) => {
    if (id !== null) {
        const fsa = {
            payload: {
                benificiaryDetails: [],
                fromType: type,
            },
            type: actionTypes.GET_BENIFICIARY_FOR_GROUP,
        };

        callApiAndGetData(`/${type}/${id}/groupBeneficiaries`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            })
            .then(
                (result) => {
                    if (!_.isEmpty(result)) {
                        fsa.payload.benificiaryDetails = result;
                    }
                },
            ).catch(() => {
                Router.pushRoute('/give/error');
            }).finally(() => {
                dispatch(fsa);
            });
    } else {
        Router.pushRoute('/dashboard');
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
                dispatch,
                slug: [
                    slug,
                ],
                uxCritical: true,
            },
        }).then(
            (result) => {
                if (result && !_.isEmpty(result.data)) {
                    fsa.payload.charityDetails = result.data;
                }
                return dispatch(fsa);
            },
        ).catch(() => {
            Router.pushRoute('/give/error');
        }).finally(() => dispatch(fsa));
    } else {
        Router.pushRoute('/dashboard');
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

export const getCoverAmount = async (fundId, giveAmount, dispatch) => {
    const fsa = {
        payload: {
            coverAmountDisplay: 0,
        },
        type: actionTypes.COVER_AMOUNT_DISPLAY,
    };
    if (giveAmount >= 5) {
        await getCoverFeesApi(giveAmount, fundId).then((result) => {
            const {
                data: {
                    attributes: {
                        feeAmount,
                    },
                },
            } = result;
            fsa.payload.coverAmountDisplay = feeAmount;
        });
    }
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
        // console.log(error);
    });
};


export const getGroupsFromSlug = (dispatch, slug) => {
    const groupsFromSlugPromise = coreApi.get(`groups/find_by_slug`, {
        params: {
            dispatch,
            slug,
            uxCritical: true,
        },
    });
    groupsFromSlugPromise.then(
        (result) => {
            dispatch({
                payload: {
                    groupDetails: result.data,
                },
                type: actionTypes.GET_GROUP_FROM_SLUG,
            });
        },
    ).catch(() => {
        Router.pushRoute('/give/error');
    });
    return groupsFromSlugPromise;
};

export {
    createToken,
};

const fetchCompanyDetails = (dispatch, companyId) => {
    return coreApi.get(
        `/companies/${companyId}`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    ).then((result) => {
        const payload = {
            companyDetails: result.data,
        };
        dispatch({
            payload,
            type: actionTypes.UPDATE_COMPANY_BALANCE,
        });
    });
};


export const walletTopUp = (reloadObject) => {
    const accountDetails = {
        id: reloadObject.giveData.giveTo.id,
        type: reloadObject.giveData.giveTo.type,
    };
    return (dispatch) => {
        return saveDonations(reloadObject).then((result) => {
            if (accountDetails.type === 'user') {
                return getUserFund(dispatch, accountDetails.id);
            } else if (accountDetails.type === 'companies') {
                return fetchCompanyDetails(dispatch, accountDetails.id);
            }
        }).then(() => {
            const statusMessageProps = {
                message: 'Wallet reloaded',
                type: 'success',
            };
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: 'TRIGGER_UX_CRITICAL_ERROR',
            });
        }).catch((error) => {
            triggerUxCritialErrors(error.errors || error, dispatch);
            return Promise.reject(error);
        });
    };
};

export const resetFlowObject = (type, dispatch) => {
    const defaultProps = {
        charity: beneficiaryDefaultProps,
        donations: donationDefaultProps,
        friend: p2pDefaultProps,
        group: groupDefaultProps,
    };
    const defaultPropsData = _.cloneDeep(defaultProps[type]);
    const payload = {
        ...defaultPropsData.flowObject,
    };
    const fsa = {
        payload,
        type: actionTypes.SAVE_FLOW_OBJECT,
    };
    dispatch(fsa);
};

export const fetchGroupMatchAmount = (giveAmount, giveFromFundId, giveToFundId) => (dispatch) => {
    const bodyData = {
        data: {
            attributes: {
                amount: giveAmount,
            },
            relationships: {
                destinationFund: {
                    data: {
                        id: giveToFundId,
                        type: 'accountHolders',
                    },
                },
                fund: {
                    data: {
                        id: giveFromFundId,
                        type: 'accountHolders',
                    },
                },
            },
        },
    };
    coreApi.post('/groupAllocations/fetchMatchAmount', bodyData).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            const matchingData = result.data;
            matchingData.giveFromFund = giveFromFundId;
            dispatch({
                payload: matchingData,
                type: actionTypes.GET_MATCHING_DETAILS_FOR_GROUPS,
            });
        }
    }).catch();
};
