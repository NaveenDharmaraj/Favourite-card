/* eslint-disable no-else-return */
import _ from 'lodash';
import getConfig from 'next/config';

import socialApi from '../services/socialApi';

const { publicRuntimeConfig } = getConfig();

const {
    AUTH0_WEB_CLIENT_ID,
    BASIC_AUTH_KEY,
} = publicRuntimeConfig;

let BASIC_AUTH_HEADER = null;
if (!_.isEmpty(BASIC_AUTH_KEY)) {
    BASIC_AUTH_HEADER = {
        headers: {
            Authorization: `Basic ${BASIC_AUTH_KEY}`,
        },
    };
}

export const actionTypes = {
    CREATE_USER: 'CREATE_USER',
    GET_USER_CAUSES: 'GET_USER_CAUSES',
    USER_API_VALIDATING: 'USER_API_VALIDATING',
    USER_EXISTS: 'USER_EXISTS',
};


export const saveUser = (dispatch, userDetails) => {
    return socialApi.post('/create/user', {
        ...userDetails,
    }, BASIC_AUTH_HEADER).then((result) => {
        console.log(result);
        return dispatch({
            payload: {
                newUserDetails: result,
            },
            type: actionTypes.CREATE_USER,
        });
    });
};

export const validateNewUser = (dispatch, emailId) => {
    dispatch({
        payload: {
            apiValidating: true,
        },
        type: actionTypes.USER_API_VALIDATING,
    });
    return socialApi.get(`/verify/useremailid?emailid=${emailId}`, BASIC_AUTH_HEADER).then((result) => {
        dispatch({
            payload: {
                apiValidating: false,
            },
            type: actionTypes.USER_API_VALIDATING,
        });
        return dispatch({
            payload: {
                userExists: result.email_exists,
            },
            type: actionTypes.USER_EXISTS,
        });
    }).catch((error) => {
        console.log(error);
    });
};

export const resendVerificationEmail = (userId) => {
    return socialApi.post(`/resend/verification`, {
        client_id: AUTH0_WEB_CLIENT_ID,
        user_id: userId,
    }, BASIC_AUTH_HEADER);
};

export const getUserCauses = (dispatch) => {
    const fsa = {
        payload: {
            causesList: null,
        },
        type: actionTypes.GET_USER_CAUSES,
    };
    return socialApi.get(`/user/causes`, BASIC_AUTH_HEADER).then((result) => {
        fsa.payload.causesList = result.data;
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        dispatch(fsa);
    });
};
