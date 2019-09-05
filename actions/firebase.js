import _keyBy from 'lodash/keyBy';
const firebaseActionTypes = _keyBy([
    'FIREBASE_MESSAGE_FETCH_COMPLETE',
]);
const firebaseMessageFetchCompleteAction = (dispatch, messages) => {
    return dispatch({
        type: firebaseActionTypes.FIREBASE_MESSAGE_FETCH_COMPLETE,
        payload: {
            messages
        },
    });
};

export {
    firebaseActionTypes,
    firebaseMessageFetchCompleteAction,
};