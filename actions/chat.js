import _keyBy from 'lodash/keyBy';
const actionTypes = _keyBy([
    'CHAT_MESSAGE_LIST_LOAD',
]);
const chatMessageFetchCompleteAction = (dispatch, messages) => {
    return dispatch({
        type: actionTypes.CHAT_MESSAGE_LIST_LOAD,
        payload: {
            messages
        },
    });
};

export {
    actionTypes,
    chatMessageFetchCompleteAction,
};