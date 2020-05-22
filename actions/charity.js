import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import utilityApi from '../services/utilityApi';
import graphApi from '../services/graphApi';
import coreApi from '../services/coreApi';

const { publicRuntimeConfig } = getConfig();
const {
    BASIC_AUTH_KEY,
} = publicRuntimeConfig;
let BASIC_AUTH_HEADER = null;
if (!_isEmpty(BASIC_AUTH_KEY)) {
    BASIC_AUTH_HEADER = {
        headers: {
            Authorization: `Basic ${BASIC_AUTH_KEY}`,
        },
    };
}

export const actionTypes = {
    CHARITY_CHART_LOADER: 'CHARITY_CHART_LOADER',
    CHARITY_LOADER_STATUS: 'CHARITY_LOADER_STATUS',
    CHARITY_PLACEHOLDER_STATUS: 'CHARITY_PLACEHOLDER_STATUS',
    CHARITY_REDIRECT_TO_DASHBOARD: 'CHARITY_REDIRECT_TO_DASHBOARD',
    CHARITY_SAVE_DEEP_LINK: 'CHARITY_SAVE_DEEP_LINK',
    GET_BENEFICIARY_DONEE_LIST: 'GET_BENEFICIARY_DONEE_LIST',
    GET_BENEFICIARY_FINANCE_DETAILS: 'GET_BENEFICIARY_FINANCE_DETAILS',
    GET_CHARITY_DETAILS_FROM_SLUG: 'GET_CHARITY_DETAILS_FROM_SLUG',
    SAVE_FOLLOW_STATUS: 'SAVE_FOLLOW_STATUS',
    SET_COUNTRIES_GEOCODE: 'SET_COUNTRIES_GEOCODE',
    SET_HEADQUARTER_GEOCODE: 'SET_HEADQUARTER_GEOCODE',
};

export const getBeneficiaryDoneeList = (charityId, year, pageNumber = 1, isSeeMore = false) => (dispatch) => {
    const fsa = {
        payload: {
            donationDetails: [],
            totalPages: null,
            currentPage: null,
        },
        type: actionTypes.GET_BENEFICIARY_DONEE_LIST,
    };
    dispatch({
        payload: {
            showPlaceholder: true,
        },
        type: actionTypes.CHARITY_PLACEHOLDER_STATUS,
    });
    utilityApi.get(`/beneficiaryDoneeList/${charityId}`, {
        params: {
            dispatch,
            locale: 'en_ca',
            page: pageNumber,
            returnsYear: year,
            size: 20,
            tenant_name: 'chimp',
            uxCritical: true,
        },
    }).then(
        (result) => {
            if (result && result._embedded && result._embedded.donee_list && !_isEmpty(result._embedded.donee_list)) {
                fsa.payload.donationDetails = result._embedded.donee_list;
                fsa.payload.totalPages = result.page.totalPages;
                fsa.payload.currentPage = result.page.number;
                fsa.payload.isSeeMore = isSeeMore;
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

export const getBeneficiaryFromSlug = (slug, token = null) => async (dispatch) => {
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
        const fullParams = {
            params: {
                dispatch,
                slug,
                uxCritical: true,
            },
        };
        if (!_isEmpty(token)) {
            fullParams.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
        await coreApi.get(`/beneficiaries/find_by_slug?load_full_profile=true`, {
            ...fullParams,
        }).then(
            (result) => {
                if (result && !_isEmpty(result.data)) {
                    fsa.payload.charityDetails = result.data;
                    dispatch(fsa);
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
        if (result && !_isEmpty(result.data)) {
            fsa.payload.city = result.data;
            if (isHeadQuarter) {
                fsa.type = actionTypes.SET_HEADQUARTER_GEOCODE;
            } else {
                fsa.type = actionTypes.SET_COUNTRIES_GEOCODE;
            }
            dispatch(fsa);
        }
    }).catch().finally(() => {
        dispatch({
            payload: {
                mapLoader: false,
            },
            type: actionTypes.CHARITY_LOADER_STATUS,
        });
    });
};

export const getBeneficiaryFinance = (id) => async (dispatch) => {
    const fsa = {
        payload: {
            beneficiaryFinance: [],
        },
        type: actionTypes.GET_BENEFICIARY_FINANCE_DETAILS,
    };
    dispatch({
        payload: {
            chartLoader: true,
        },
        type: actionTypes.CHARITY_CHART_LOADER,
    });
    await utilityApi.get(`/beneficiaryfinance/${id}`, {
        params: {
            dispatch,
            locale: 'en_ca',
            tenant_name: 'chimp',
            uxCritical: true,
        },
    }).then((result) => {
        if(result.beneficiaryFinanceList && !_isEmpty(result.beneficiaryFinanceList)) {
            fsa.payload.beneficiaryFinance = result.beneficiaryFinanceList;
            dispatch(fsa);
        }
    }).catch().finally(() => {
        dispatch({
            payload: {
                chartLoader: false,
            },
            type: actionTypes.CHARITY_CHART_LOADER,
        });
    });
};
