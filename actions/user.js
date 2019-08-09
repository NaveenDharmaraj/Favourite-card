/* eslint-disable no-else-return */

import _ from 'lodash';

import coreApi from '../services/coreApi';
import authRorApi from '../services/authRorApi';
import { Router } from '../routes';

export const actionTypes = {
    GET_MATCH_POLICIES_PAYMENTINSTRUMENTS: 'GET_MATCH_POLICIES_PAYMENTINSTRUMENTS',
    GET_USERS_GROUPS: 'GET_USERS_GROUPS',
    GET_UPCOMING_TRANSACTIONS: 'GET_UPCOMING_TRANSACTIONS',
    MONTHLY_TRANSACTION_API_CALL: 'MONTHLY_TRANSACTION_API_CALL',
    TAX_RECEIPT_PROFILES:'TAX_RECEIPT_PROFILES',
    SET_USER_INFO: 'SET_USER_INFO',
    UPDATE_USER_FUND: 'UPDATE_USER_FUND',
    USER_GIVING_GOAL_DETAILS: 'USER_GIVING_GOAL_DETAILS',
}

const getAllPaginationData = async (url, params = null) => {
    // Right now taking the only relative url from the absolute url.
    const replacedUrl = _.split(url, '/core/v2').pop();
    const result = await coreApi.get(replacedUrl, params);
    const dataArray = result.data;
    if (result.links.next) {
        return dataArray.concat(await getAllPaginationData(result.links.next, params));
    }
    return dataArray;
};

export const callApiAndGetData = (url, params) => getAllPaginationData(url, params).then(
    (result) => {
        const allData = [];
        if (result && !_.isEmpty(result)) {
            result.map((item) => {
                const {
                    attributes,
                    id,
                    type,
                } = item;
                allData.push({
                    attributes,
                    id,
                    type,
                });
            });
        }
        return allData;
    },
);

export const getDonationMatchAndPaymentInstruments = (userId, flowType) => {

    return async (dispatch) => {
        const fsa = {
            payload: {
                companiesAccountsData: [],
                defaultTaxReceiptProfile: {},
                donationMatchData: [],
                fund: {},
                paymentInstrumentsData: [],
                taxReceiptProfiles: [],
                userAccountsFetched: false,
                userCampaigns: [],
                userGroups: [],
            },
            type: actionTypes.GET_MATCH_POLICIES_PAYMENTINSTRUMENTS,
        };
        const fetchData = coreApi.get(
            `/users/${userId}?include=donationMatchPolicies,activePaymentInstruments,defaultTaxReceiptProfile,taxReceiptProfiles,fund`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            },
        );
        let groupData = null;
        let campaignsData = null;
        if (flowType !== 'donations') {
            groupData = callApiAndGetData(
                `/users/${userId}/administeredGroups?page[size]=50&sort=-id`,
                {
                    params: {
                        dispatch,
                        uxCritical: true,
                    },
                },
            );
            campaignsData = callApiAndGetData(
                `/users/${userId}/administeredCampaigns?page[size]=50&sort=-id`,
                {
                    params: {
                        dispatch,
                        uxCritical: true,
                    },
                },
            );
        }
        const companiesData = callApiAndGetData(
            `/users/${userId}/administeredCompanies?page[size]=50&sort=-id`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            },
        );
        Promise.all([
            fetchData,
            groupData,
            campaignsData,
            companiesData,
        ])
            .then(
                (data) => {
                    const userData = data[0];
                    if (!_.isEmpty(userData.included)) {
                        const { included } = userData;
                        const dataMap = {
                            campaigns: 'userCampaigns',
                            companies: 'companiesAccountsData',
                            donationMatches: 'donationMatchData',
                            groups: 'userGroups',
                            paymentInstruments: 'paymentInstrumentsData',
                        };
                        let defaultTaxReceiptId = null;
                        if (!_.isEmpty(userData.data.relationships.defaultTaxReceiptProfile.data)) {
                            defaultTaxReceiptId = userData.data.relationships.defaultTaxReceiptProfile.data.id;
                        }
                        included.map((item) => {
                            const {
                                attributes,
                                id,
                                type,
                            } = item;
                            if (type === 'taxReceiptProfiles') {
                                if (id === defaultTaxReceiptId) {
                                    fsa.payload.defaultTaxReceiptProfile = {
                                        attributes,
                                        id,
                                        type,
                                    };
                                }
                                fsa.payload.taxReceiptProfiles.push({
                                    attributes,
                                    id,
                                    type,
                                });
                            } else if (type === 'funds') {
                                fsa.payload.fund = {
                                    attributes,
                                    id,
                                    type,
                                };
                            } else {
                                fsa.payload[dataMap[type]].push({
                                    attributes,
                                    id,
                                    type,
                                });
                            }
                        });
                    }
                    fsa.payload.userGroups = data[1];
                    fsa.payload.userCampaigns = data[2];
                    fsa.payload.companiesAccountsData = data[3];
                    fsa.payload.userAccountsFetched = true;
                },
            ).catch((error) => {
                fsa.error = error;
                fsa.payload.userAccountsFetched = true;
            }).finally(() => {
                dispatch(fsa);
            });
    };
};

export const chimpLogin = (token = null) => {
    let params = null;
    if (!_.isEmpty(token)) {
        params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }
    return authRorApi.post('/auth/login', null, params);
};

export const getUser = async (dispatch, userId, token = null) => {
    const payload = {
        isAuthenticated: false,
        userInfo: null,
    };
    let params = null;
    if (!_.isEmpty(token)) {
        params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    await coreApi.get(`/users/${userId}?include=chimpAdminRole,donorRole`, params).then((result) => {
        payload.isAuthenticated = true;
        payload.userInfo = result.data;
    }).catch((error) => {
        console.log(JSON.stringify(error));
    }).finally(() => {
        dispatch({
            payload: {
                isAuthenticated: payload.isAuthenticated,
            },
            type: 'SET_AUTH',
        });
        dispatch({
            payload: {
                userInfo: payload.userInfo,
            },
            type: actionTypes.SET_USER_INFO,
        });
        return null;
    });
};

export const getUserFund = (dispatch, userId) => {
    return coreApi.get(`/users/${userId}?include=fund`).then((result) => {
        const payload = {
            userInfo: result.data,
        };
        if (!_.isEmpty(result.included)) {
            const { included } = result;
            included.map((item) => {
                const {
                    attributes,
                    id,
                    type,
                } = item;
                if (type === 'funds') {
                    payload.fund = {
                        attributes,
                        id,
                        type,
                    };
                }
            });
        }
        return dispatch({
            payload: {
                fund: payload.fund,
                userInfo: payload.userInfo,
            },
            type: actionTypes.UPDATE_USER_FUND,
        });
    }).catch((error) => {
        console.log(error);
    });
};

export const setTaxReceiptProfile = (data) => {
    return (dispatch) => dispatch({
        payload: {
            taxReceiptGetApiStatus: true,
            taxReceiptProfiles: data,
        },
        type: actionTypes.TAX_RECEIPT_PROFILES,
    });
};

export const getTaxReceiptProfile = (dispatch, userId) => {
    return coreApi.get(`/users/${userId}/taxReceiptProfiles`).then((result) => {
        return dispatch(setTaxReceiptProfile(result.data));
    }).catch((error) => {
        console.log(error);
    });
};

export const updateTaxReceiptProfile = (taxReceiptProfile, action, dispatch) => {
    if (action === 'update') {
        const data = {
            attributes: _.pick(
                taxReceiptProfile.attributes,
                [
                    'addressOne',
                    'addressTwo',
                    'city',
                    'country',
                    'fullName',
                    'postalCode',
                    'province',
                ],
            ),
            id: taxReceiptProfile.id,
            type: taxReceiptProfile.type,
        };
        return coreApi.patch(`/taxReceiptProfilesf/${taxReceiptProfile.id}`, {
            data,
        });
    } else {
        return coreApi.post('/taxReceiptProfiles', {
            data: taxReceiptProfile,
        });
    }
};

export const getGroupsForUser = (dispatch, userId) => {
    const fsa = {
        payload: {
            userGroups: [],
        },
        type: actionTypes.GET_USERS_GROUPS,
    };
    callApiAndGetData(
        `/users/${userId}/groupsWithMemberships?page[size]=50&sort=-id`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    )
        .then(
            (result) => {
                if (!_.isEmpty(result)) {
                    fsa.payload.userMembershipGroups = result;
                }
                dispatch(fsa);
            },
        ).catch((error) => {
            console.log(error);
            Router.pushRoute('/give/error');
        });
};

export const savePaymentInstrument = (cardDetails) => {
    const result = coreApi.post('/paymentInstruments', {
        data: cardDetails,
    });
    return result;
};

export const getUserGivingGoal = (dispatch, userId) => {
    console.log(userId);
    return coreApi.get(`users/${userId}/givingGoals`)
        .then((result) => {
            dispatch({
                payload: {
                    userGivingGoalDetails: result.data,
                },
                type: actionTypes.USER_GIVING_GOAL_DETAILS,
            });
        }).catch((error) => {
            console.log(error);
        })
};
export const setUserGivingGoal = (dispatch, goalAmount, userId) => {
    const payload = {
        attributes: {
            amount: goalAmount,
        },
        type: 'givingGoals',
    };
    return coreApi.post('givingGoals', {
        data: payload,
    }).then((result)=> {
        getUserGivingGoal(dispatch, userId);
    });
};

export const getUpcomingTransactions = (dispatch, url) => {
    dispatch({
        payload: {
            apiCallStats: true,
        },
        type: actionTypes.MONTHLY_TRANSACTION_API_CALL,
    });
    return coreApi.get(url).then(
        (result) => {
            dispatch({
                payload: {
                    apiCallStats: false,
                },
                type: actionTypes.MONTHLY_TRANSACTION_API_CALL,
            });
            dispatch({
                payload: {
                    upcomingTransactions: result.data,
                    upcomingTransactionsMeta: result.meta,
                    
                },
                type: actionTypes.GET_UPCOMING_TRANSACTIONS,
            });
        },
    ).catch((error) => {
        console.log(error);
        // Router.pushRoute('/give/error');
    });
};

export const deleteUpcomingTransaction = (dispatch, id, transactionType, activePage, userId) => {
    let url = null;
    switch (transactionType) {
        case 'RecurringAllocation':
            url = `recurringAllocations/${id}`;
            break;
        case 'RecurringDonation':
            url = `recurringDonations/${id}`;
            break;
        case 'RecurringFundAllocation':
            url = `recurringGroupAllocations/${id}`;
            break;
        default:
            break;
    }
    dispatch({
        payload: {
            apiCallStats: true,
        },
        type: actionTypes.MONTHLY_TRANSACTION_API_CALL,
    });
    return coreApi.delete(url).then(
        (result) => {
            let activepageUrl = `users/${userId}/upcomingTransactions?page[number]=${activePage}&page[size]=10`;
            if (transactionType === 'RecurringAllocation') {
                activepageUrl += '&filter[type]=RecurringAllocation,RecurringFundAllocation';
            } else {
                activepageUrl += '&filter[type]=RecurringDonation';
            }
            getUpcomingTransactions(dispatch, activepageUrl);
        },
    ).catch((error) => {
        console.log(error);
    });
};
