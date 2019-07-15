/* eslint-disable import/exports-last */
import {
    updateTaxReceiptProfile
} from './user';
import _ from 'lodash';

import coreApi from '../services/coreApi';
import realtypeof from '../helpers/realtypeof';
import { callApiAndGetData } from '../helpers/give/utils';
//import {Router} from '../../routes';

export const actionTypes = {
    COVER_FEES: 'COVER_FEES',
    GET_BENEFICIARY_FROM_SLUG: 'GET_BENEFICIARY_FROM_SLUG',
    GET_BENIFICIARY_FOR_GROUP: 'GET_BENIFICIARY_FOR_GROUP',
    GET_COMPANY_PAYMENT_AND_TAXRECEIPT: 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT',
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT',
};

export const proceed = (flowObject, nextStep,stepIndex, lastStep = false) => {
    return (dispatch) => {
        flowObject.nextStep = nextStep;
        if (flowObject.taxReceiptProfileAction !== 'no_change' && stepIndex === 1) {
            let result = updateTaxReceiptProfile(
                flowObject.selectedTaxReceiptProfile,
                flowObject.taxReceiptProfileAction, dispatch
            ).then((result) => {
                flowObject.selectedTaxReceiptProfile = result.data;
                dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject});
            }).catch((error) => {
                console.log(error);
            });
        } else {
            dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})
        }
    }
}

export const reInitNextStep = (dispatch, flowObject) => {
    flowObject.nextStep = null;
    return dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})
}

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
            taxReceiptProfileData: [],
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
                    fsa.payload.taxReceiptProfileData.push({
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
