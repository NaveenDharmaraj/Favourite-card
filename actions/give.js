import {
    updateTaxReceiptProfile,
    callApiAndGetData,
} from './user';
import _ from 'lodash';

import coreApi from '../services/coreApi';
import realtypeof from '../helpers/realtypeof';

export const actionTypes = {
    GET_COMPANY_PAYMENT_AND_TAXRECEIPT: 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT',
    GET_COMPANY_TAXRECEIPTS: 'GET_COMPANY_TAXRECEIPTS',
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT',

};

export const proceed = (flowObject, nextStep, stepIndex, lastStep = false) => {
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
        },
        type: actionTypes.GET_COMPANY_PAYMENT_AND_TAXRECEIPT,
    };

    return coreApi.get(`/companies/${companyId}?include=defaultTaxReceiptProfile,activePaymentInstruments`).then((result) => {
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
                }
            });
        }
        return dispatch(fsa);
    }).catch((error) => {
        console.log(error);
    });
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
