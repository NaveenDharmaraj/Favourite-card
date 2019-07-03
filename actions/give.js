import coreApi from '../services/coreApi';
import {
    beneficiaryDefaultProps,
    donationDefaultProps,
    p2pDefaultProps,
    groupDefaultProps,
} from '../utils/give/defaultProps';
export const actionTypes = {
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT'
}

export const proceed = (flowObject, nextStep, lastStep = false) => {
    flowObject.nextStep = nextStep;
//    if(nextStep === 'success'){
//         flowObject.stepsCompleted = true;
//     } 
    return (dispatch) => dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})

}

export const reInitNextStep = (dispatch, flowObject) => {
    flowObject.nextStep = null;
    return dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})
}

export const clearFlowObjects = (flowObject) => {
    flowObject.nextStep = null;
    const clearFlowObject = Object.assign(flowObject,beneficiaryDefaultProps,donationDefaultProps,p2pDefaultProps,groupDefaultProps);
    console.log("clearFlowObjects",clearFlowObject);
    proceed(clearFlowObject);
}

