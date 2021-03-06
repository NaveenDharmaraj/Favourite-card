import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import utilityApi from '../services/utilityApi';
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
    CHARITY_PLACEHOLDER_STATUS: 'CHARITY_PLACEHOLDER_STATUS',
    CHARITY_REDIRECT_TO_DASHBOARD: 'CHARITY_REDIRECT_TO_DASHBOARD',
    GET_BENEFICIARY_DONEE_LIST: 'GET_BENEFICIARY_DONEE_LIST',
    GET_BENEFICIARY_FINANCE_DETAILS: 'GET_BENEFICIARY_FINANCE_DETAILS',
    GET_CHARITY_DETAILS_FROM_SLUG: 'GET_CHARITY_DETAILS_FROM_SLUG',
};

export const getBeneficiaryDoneeList = (charityId, year, isAuthenticated) => (dispatch) => {
    const fsa = {
        payload: {
            donationDetails: [],
            remainingAmount: 0,
            remainingElements: 0,
        },
        type: actionTypes.GET_BENEFICIARY_DONEE_LIST,
    };
    dispatch({
        payload: {
            showPlaceholder: true,
        },
        type: actionTypes.CHARITY_PLACEHOLDER_STATUS,
    });
    let fullParams = {
        params: {
            dispatch,
            locale: 'en_ca',
            page: 1,
            returnsYear: year,
            size: 20,
            tenant_name: 'chimp',
            uxCritical: true,
        },
    };
    if (!isAuthenticated) {
        fullParams = {
            ...fullParams,
            ...BASIC_AUTH_HEADER,
        };
    }
    return utilityApi.get(`/beneficiaryDoneeList/${charityId}`, {
        ...fullParams,
    }).then(
        (result) => {
            if (result && result._embedded && result._embedded.donee_list
                && !_isEmpty(result._embedded.donee_list)) {
                fsa.payload.donationDetails = result._embedded.donee_list;
                if (result.page.totalElements > 20) {
                    fsa.payload.remainingElements = result.page.totalElements - result.page.size;
                    fsa.payload.remainingAmount = result.totalAmount.remainingAmount;
                }
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
                load_full_profile: true,
                slug,
                uxCritical: true,
            },
        };
        if (!_isEmpty(token)) {
            fullParams.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
        await coreApi.get(`/beneficiaries/find_by_slug?`, {
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
        // redirect('/dashboard');
    }
};

export const getBeneficiaryFinance = (id, isAuthenticated) => (dispatch) => {
    const fsa = {
        payload: {
            beneficiaryFinance: [],
            beneficiaryFinanceApiFail: false,
        },
        type: actionTypes.GET_BENEFICIARY_FINANCE_DETAILS,
    };
    dispatch({
        payload: {
            chartLoader: true,
        },
        type: actionTypes.CHARITY_CHART_LOADER,
    });
    let fullParams = {
        params: {
            dispatch,
            locale: 'en_ca',
            tenant_name: 'chimp',
            uxCritical: true,
        },
    };
    if (!isAuthenticated) {
        fullParams = {
            ...fullParams,
            ...BASIC_AUTH_HEADER,
        };
    }
    return utilityApi.get(`/beneficiaryfinance/${id}`, {
        ...fullParams,
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.beneficiaryFinance = result.data;
            dispatch(fsa);
        }
    }).catch(() => {
        dispatch({
            payload: {
                beneficiaryFinance: [],
                beneficiaryFinanceApiFail: true,
            },
            type: actionTypes.GET_BENEFICIARY_FINANCE_DETAILS,
        });
    }).finally(() => {
        dispatch({
            payload: {
                chartLoader: false,
            },
            type: actionTypes.CHARITY_CHART_LOADER,
        });
    });
};
