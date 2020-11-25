/* eslint-disable no-else-return */
import _ from 'lodash';
import getConfig from 'next/config';

import securityApi from '../services/securityApi';
import graphApi from '../services/graphApi';
import coreApi from '../services/coreApi';

import {
    triggerUxCritialErrors,
} from './error';

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
    USER_EMAIL_RESEND: 'USER_EMAIL_RESEND',
    USER_EXISTS: 'USER_EXISTS',
};

export const saveUser = (dispatch, userDetails) => {
    return securityApi.post('/create/user', {
        ...userDetails,
    }, BASIC_AUTH_HEADER).then((result) => {
        return dispatch({
            payload: {
                newUserDetails: result,
            },
            type: actionTypes.CREATE_USER,
        });
    }).catch((error) => {
        triggerUxCritialErrors(error.errors || error, dispatch);
    });
};

export const validateNewUser = (dispatch, emailId) => {
    dispatch({
        payload: {
            apiValidating: true,
        },
        type: actionTypes.USER_API_VALIDATING,
    });
    return securityApi.get(`/verify/useremailid`, {
        headers: {
            Authorization: `Basic ${BASIC_AUTH_KEY}`,
        },
        params: {
            emailid: emailId,
        },
    }).then((result) => {
        dispatch({
            payload: {
                apiValidating: false,
            },
            type: actionTypes.USER_API_VALIDATING,
        });
        dispatch({
            payload: {
                userExists: result.data[0].attributes.email_exists,
            },
            type: actionTypes.USER_EXISTS,
        });
        return result.data[0].attributes.email_exists;
    }).catch((error) => {
        // console.log(error);
    });
};

export const resendVerificationEmail = (userId, dispatch) => {
    return securityApi.post(`/resend/verification`, {
        client_id: AUTH0_WEB_CLIENT_ID,
        user_id: userId,
    }, BASIC_AUTH_HEADER).then(() => {
        dispatch({
            payload: {
                apiResendEmail: true,
            },
            type: actionTypes.USER_EMAIL_RESEND,
        });

    });
};

export const getUserCauses = (dispatch) => {
    const fsa = {
        payload: {
            causesList: null,
        },
        type: actionTypes.GET_USER_CAUSES,
    };
    return graphApi.get(`/user/causes`, BASIC_AUTH_HEADER).then((result) => {
        fsa.payload.causesList = result.data;
    }).catch((error) => {
        // console.log(error);
        triggerUxCritialErrors(error.errors || error, dispatch);
    }).finally(() => {
        dispatch(fsa);
    });
};

export const claimp2pCreateNewUser = (firstName, lastName, email, password, claimToken) => (dispatch) => {
    const bodyData = {
        data: {
            attributes: {
                claimToken,
                email,
                firstName,
                lastName,
                password,
            },
        },
        params: {
            dispatch,
            uxCritical: true,
        },
    };
    return coreApi.post('/claimP2ps', bodyData);
};
