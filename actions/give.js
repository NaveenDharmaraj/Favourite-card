import coreApi from '../services/coreApi';

export const actionTypes = {
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT'
}

export const proceed = (flowObject, nextStep, lastStep = false) => {
    flowObject.nextStep = nextStep;
    return (dispatch) => dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})

}

export const reInitNextStep = (dispatch, flowObject) => {
    flowObject.nextStep = null;
    return dispatch({type: actionTypes.SAVE_FLOW_OBJECT, payload: flowObject})
}