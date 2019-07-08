import {
    updateTaxReceiptProfile
} from './user';
import _ from 'lodash';

import coreApi from '../services/coreApi';
import realtypeof from '../helpers/realtypeof';

export const actionTypes = {
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT',
    GET_COMPANY_PAYMENT_AND_TAXRECEIPT: 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT',
};

export const proceed = (flowObject, nextStep,stepIndex, lastStep = false) => {
    return (dispatch) => {
            flowObject.nextStep = nextStep;
        const accountDetails = {
            id: flowObject.fundAccountId,
            type: flowObject.fundAccountType,
        };
        if (flowObject.taxReceiptProfileAction !== 'no_change' && stepIndex === 1) {
            console.log('inside')
            let result = updateTaxReceiptProfile(
                flowObject.selectedTaxReceiptProfile,
                flowObject.taxReceiptProfileAction, dispatch
            ).then((result) => {
                console.log(result);
                flowObject.selectedTaxReceiptProfile = result.data;
                // let resultData = setTaxReceiptProfile(result.data);
                // console.log(resultData)
                // dispatch(resultData);
                dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject});
                // callApiAndDispatchData(accountDetails);
            }).catch((error) => {
                console.log(error);
                // data.nextSteptoProceed = step;
            });
        } else {
            dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})
        }
    }
    
    // open curly braces after dipatch => and put entire if condition inside it so that we can call mutiple dispatches in then and finally and else 
    // return (dispatch) => dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})

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
