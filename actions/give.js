import coreApi from '../services/coreApi';
import {
    updateTaxReceiptProfile
} from './user'
export const actionTypes = {
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT'
}

export const proceed = (flowObject, nextStep, lastStep = false) => {
    flowObject.nextStep = nextStep;
    const accountDetails = {
        id: flowObject.fundAccountId,
        type: flowObject.fundAccountType,
    };
    if (flowObject.taxReceiptProfileAction !== 'no_change') {
        let result = updateTaxReceiptProfile(
            flowObject.selectedTaxReceiptProfile,
            flowObject.taxReceiptProfileAction,
        ).then((result) => {
            this.setState({
                flowObject: {
                    ...flowObject,
                    selectedTaxReceiptProfile:result.data
                }
            })
            flowObject.selectedTaxReceiptProfile = result.data;
            // callApiAndDispatchData(accountDetails);
        }).catch((error) => {
            console.log(error);
            data.nextSteptoProceed = step;
        });
    }

    // open curly braces after dipatch => and put entire if condition inside it so that we can call mutiple dispatches in then and finally and else 
    return (dispatch) => dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})

}

export const reInitNextStep = (dispatch, flowObject) => {
    flowObject.nextStep = null;
    return dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})
}