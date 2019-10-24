import _keyBy from 'lodash/keyBy';
import getConfig from 'next/config';

import authRorApi from '../services/authRorApi';
import auth0 from '../services/auth';
import storage from '../helpers/storage';

const { publicRuntimeConfig } = getConfig();

const {
    APP_URL_ORIGIN,
} = publicRuntimeConfig;

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

const logout = () => {

    authRorApi.get('/auth/logout', {
        credentials: 'include',
    })
        .then(() => {
            storage.unset('chimpUserId', 'cookie');
            auth0.empty();
            auth0.lock.logout({
                returnTo: APP_URL_ORIGIN,
            });
        })
        .catch((err) => {
            // console.log(err);
        });
};

const softLogout = (dispatch) => {
    dispatch({
        payload: {
            isAuthenticated: false,
        },
        type: 'SET_AUTH',
    });
}

export {
    actionTypes,
    validateAuth0Failure,
    logout,
    softLogout,
};
