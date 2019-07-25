import _keyBy from 'lodash/keyBy';
const actionTypes = _keyBy([
    'SET_AUTH0_USER_FAILURE',
]);
const validateAuth0Failure = (dispatch, auth0UserEmail, auth0UserId) => {
    return dispatch({
        type: actionTypes.SET_AUTH0_USER_FAILURE,
        payload: {
            auth0UserEmail,
            auth0UserId,
            resendEmail: false,
        },
    });
};

export {
    actionTypes,
    validateAuth0Failure,
};
