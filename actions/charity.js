import _ from 'lodash';

import utilityApi from '../services/utilityApi';
import graphApi from '../services/graphApi';
import coreApi from '../services/coreApi';

export const actionTypes = {
    GET_BENEFICIARY_DONEE_LIST: 'GET_BENEFICIARY_DONEE_LIST',
    GET_BENEFICIARY_FROM_SLUG: 'GET_BENEFICIARY_FROM_SLUG',
    REDIRECT_TO_DASHBOARD: 'REDIRECT_TO_DASHBOARD',
    SAVE_DEEP_LINK: 'SAVE_DEEP_LINK',
    SAVE_FOLLOW_STATUS: 'SAVE_FOLLOW_STATUS',
};

export const getBeneficiaryDoneeList = (dispatch, charityId) => {
    const fsa = {
        payload: {
            donationDetails: {},
        },
        type: actionTypes.GET_BENEFICIARY_DONEE_LIST,
    };
    utilityApi.get(`/beneficiaryDoneeList/${charityId}?locale=en_ca&tenant_name=chimp&page=1&size=10`).then(
        (result) => {
            if (result) {
                fsa.payload.donationDetails = result;
            }
            return dispatch(fsa);
        },
    ).catch((error) => {
        // console.log(error);
    }).finally(() => {
        return dispatch(fsa);
    });
};

export const saveFollowStatus = (dispatch, userId, charityId) => {
    const fsa = {
        payload: {
            followStatus: false,
        },
        type: actionTypes.SAVE_FOLLOW_STATUS,
    };
    graphApi.post(`/core/create/relationship`,
        {
            relationship: 'FOLLOWS',
            source: {
                entity: 'user',
                filters: {
                    user_id: Number(userId),
                },
            },
            target: {
                entity: 'charity',
                filters: {
                    charity_id: Number(charityId),
                },
            },
        }).then(
        (result) => {
            fsa.payload.followStatus = true;
        },
    ).catch((error) => {
        // console.log(error);
    }).finally(() => dispatch(fsa));
};

export const deleteFollowStatus = (dispatch, userId, charityId) => {
    const fsa = {
        payload: {
            followStatus: true,
        },
        type: actionTypes.SAVE_FOLLOW_STATUS,
    };
    graphApi.post(`/users/deleterelationship`, {
        relationship: 'FOLLOWS',
        source: {
            entity: 'user',
            filters: {
                user_id: Number(userId),
            },
        },
        target: {
            entity: 'charity',
            filters: {
                charity_id: Number(charityId),
            },
        },
    }).then(
        (result) => {
            fsa.payload.followStatus = false;
        },
    ).catch((error) => {
        // console.log(error);
    }).finally(() => dispatch(fsa));
};

export const copyDeepLink = (url, dispatch) => {
    const fsa = {
        payload: {
            deepLink: {},
        },
        type: actionTypes.SAVE_DEEP_LINK,
    };
    utilityApi.get(url).then(
        (result) => {
            fsa.payload.deepLink = result.data;
        },
    ).catch((error) => {
        // console.log(error);
    }).finally(() => dispatch(fsa));
};

export const getBeneficiaryFromSlug = async (dispatch, slug) => {
    if (slug !== ':slug') {
        const fsa = {
            payload: {
                charityDetails: {},
            },
            type: actionTypes.GET_BENEFICIARY_FROM_SLUG,
        };
        dispatch({
            payload: {
                redirectToDashboard: false,
            },
            type: actionTypes.REDIRECT_TO_DASHBOARD,
        });
        await coreApi.get(`/beneficiaries/find_by_slug?load_full_profile=true`, {
            params: {
                dispatch,
                slug,
                uxCritical: true,
            },
        }).then(
            (result) => {
                if (result && !_.isEmpty(result.data)) {
                    fsa.payload.charityDetails = result.data;
                }
            },
        ).catch(() => {
            dispatch({
                payload: {
                    redirectToDashboard: true,
                },
                type: actionTypes.REDIRECT_TO_DASHBOARD,
            });
            return null;
        }).finally(() => {
            dispatch(fsa);
        });
    } else {
        //redirect('/dashboard');
    }
};
