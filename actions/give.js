import {
    updateTaxReceiptProfile
} from './user';
export const actionTypes = {
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT'
}

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