import _ from 'lodash';
import getConfig from 'next/config';

import utilityApi from '../services/utilityApi';
import graphApi from '../services/graphApi';
import coreApi from '../services/coreApi';

const { publicRuntimeConfig } = getConfig();
const {
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
    GET_BENEFICIARY_DONEE_LIST: 'GET_BENEFICIARY_DONEE_LIST',
    GET_CHARITY_DETAILS_FROM_SLUG: 'GET_CHARITY_DETAILS_FROM_SLUG',
    CHARITY_PLACEHOLDER_STATUS: 'CHARITY_PLACEHOLDER_STATUS',
    CHARITY_REDIRECT_TO_DASHBOARD: 'CHARITY_REDIRECT_TO_DASHBOARD',
    CHARITY_SAVE_DEEP_LINK: 'CHARITY_SAVE_DEEP_LINK',
    SAVE_FOLLOW_STATUS: 'SAVE_FOLLOW_STATUS',
    SET_COUNTRIES_GEOCODE: 'SET_COUNTRIES_GEOCODE',
    SET_HEADQUARTER_GEOCODE: 'SET_HEADQUARTER_GEOCODE',
};

export const getBeneficiaryDoneeList = (dispatch, charityId) => {
    const fsa = {
        payload: {
            donationDetails: {},
        },
        type: actionTypes.GET_BENEFICIARY_DONEE_LIST,
    };
    dispatch({
        payload: {
            showPlaceholder: true,
        },
        type: actionTypes.CHARITY_PLACEHOLDER_STATUS,
    });
    utilityApi.get(`/beneficiaryDoneeList/${charityId}?locale=en_ca&tenant_name=chimp&page=1&size=20`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(
        (result) => {
            if (result && result._embedded && result._embedded.donee_list && !_.isEmpty(result._embedded.donee_list)) {
                fsa.payload.donationDetails = result;
                dispatch(fsa);
            }
        },
    ).catch().finally(() => {
        dispatch({
            payload: {
                showPlaceholder: false,
            },
            type: actionTypes.CHARITY_PLACEHOLDER_STATUS,
        });
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
        type: actionTypes.CHARITY_SAVE_DEEP_LINK,
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
            type: actionTypes.GET_CHARITY_DETAILS_FROM_SLUG,
        };
        dispatch({
            payload: {
                redirectToDashboard: false,
            },
            type: actionTypes.CHARITY_REDIRECT_TO_DASHBOARD,
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
                type: actionTypes.CHARITY_REDIRECT_TO_DASHBOARD,
            });
            return null;
        }).finally(() => {
            dispatch(fsa);
        });
    } else {
        //redirect('/dashboard');
    }
};

export const getGeoCoding = async (dispatch, city, isHeadQuarter) => {
    const fsa = {
        payload: {
            city: [],
        },
    };
    await utilityApi.post('/getZipcode', {
        address: city,
    }, BASIC_AUTH_HEADER).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.city = result.data;
            if (isHeadQuarter) {
                fsa.type = actionTypes.SET_HEADQUARTER_GEOCODE;
            } else {
                fsa.type = actionTypes.SET_COUNTRIES_GEOCODE;
            }
            dispatch(fsa);
        }
    }).catch().finally();
};
