/* eslint-disable no-else-return */

import _ from 'lodash';

import coreApi from '../services/coreApi';
import authRorApi from '../services/authRorApi';
import graphApi from '../services/graphApi';
import { Router } from '../routes';
import {
    triggerUxCritialErrors,
} from './error';

export const actionTypes = {
    GET_MATCH_POLICIES_PAYMENTINSTRUMENTS: 'GET_MATCH_POLICIES_PAYMENTINSTRUMENTS',
    GET_USERS_GROUPS: 'GET_USERS_GROUPS',
    GET_UPCOMING_TRANSACTIONS: 'GET_UPCOMING_TRANSACTIONS',
    MONTHLY_TRANSACTION_API_CALL: 'MONTHLY_TRANSACTION_API_CALL',
    TAX_RECEIPT_PROFILES:'TAX_RECEIPT_PROFILES',
    SAVE_DEEP_LINK: 'SAVE_DEEP_LINK',
    SET_USER_INFO: 'SET_USER_INFO',
    UPDATE_USER_FUND: 'UPDATE_USER_FUND',
    GIVING_GROUPS_AND_CAMPAIGNS: 'GIVING_GROUPS_AND_CAMPAIGNS',
    DISABLE_GROUP_SEE_MORE: 'DISABLE_GROUP_SEE_MORE',
    LEAVE_GROUP_ERROR_MESSAGE: 'LEAVE_GROUP_ERROR_MESSAGE',
    USER_GIVING_GOAL_DETAILS: 'USER_GIVING_GOAL_DETAILS',
    USER_FAVORITES:'USER_FAVORITES',
    UPDATE_FAVORITES: 'UPDATE_FAVORITES',
    ENABLE_FAVORITES_BUTTON: 'ENABLE_FAVORITES_BUTTON',
};

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

const checkForOnlyOneAdmin = (error) => {
    if (!_.isEmpty(error) && error.length === 1) {
        const checkForAdminError = error[0];
        if (!_.isEmpty(checkForAdminError.meta)
            && !_.isEmpty(checkForAdminError.meta.validationCode)
            && (checkForAdminError.meta.validationCode === '1329'
            || checkForAdminError.meta.validationCode === 1329)) {
            return true;
        }
    }
    return false;
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

const setDataToPayload = ({
    avatar,
    balance,
    createdAt,
    name,
    slug,
}, type) => {
    const data = {
        avatar,
        balance: (balance) ? `$${balance}` : null,
        created_at: createdAt,
        name,
    };
    if (type === 'groups' || type === 'campaigns') {
        data.link = `/${type}/${slug}`;
    } else {
        data.slug = slug;
    }
    return data;
};

export const getUser = (dispatch, userId, token = null) => {
    const fsa = {
        payload: {},
        type: actionTypes.SET_USER_INFO,
    };
    let isAuthenticated = false;
    let params = null;
    if (!_.isEmpty(token)) {
        params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }
    const userDetails = coreApi.get(`/users/${userId}?include=chimpAdminRole,donorRole`, params);
    const administeredCompanies = callApiAndGetData(`/users/${userId}/administeredCompanies?page[size]=50&sort=-id`, params);
    const administeredBeneficiaries = callApiAndGetData(`/users/${userId}/administeredBeneficiaries?page[size]=50&sort=-id`, params);
    const beneficiaryAdminRoles = callApiAndGetData(`/users/${userId}/beneficiaryAdminRoles?page[size]=50&sort=-id`, params);
    const companyAdminRoles = callApiAndGetData(`/users/${userId}/companyAdminRoles?page[size]=50&sort=-id`, params);
    return Promise.all([
        userDetails,
        administeredCompanies,
        administeredBeneficiaries,
        beneficiaryAdminRoles,
        companyAdminRoles,
    ])
        .then(
            (allData) => {
                isAuthenticated = true;
                const userData = allData[0];
                const { data } = userData;
                const {
                    activeRoleId,
                } = data.attributes;
                let adminRoleId = null;
                _.merge(fsa.payload, {
                    activeRoleId,
                    currentAccount: {},
                    isAdmin: false,
                    otherAccounts: [],
                    info: data,
                });
                if (!_.isEmpty(data.relationships.chimpAdminRole.data)) {
                    fsa.payload.isAdmin = true;
                    adminRoleId = data.relationships.chimpAdminRole.data.id;
                }
                const includedData = _.concat(
                    userData.included, allData[1], allData[2], allData[3], allData[4],
                );
                if (!_.isEmpty(includedData)) {
                    const accounts = [];
                    const contexts = [];
                    includedData.map((item) => {
                        const {
                            attributes,
                            id,
                            type,
                        } = item;
                        if (type === 'roles') {
                            const { roleType } = attributes;
                            const entityType = _.snakeCase(roleType).split('_')[0];
                            if (entityType.slice(-1) === 'y') {
                                contexts.push({
                                    accountType: (entityType === 'beneficiary') ? 'charity' : entityType,
                                    entityId: attributes[`${entityType}Id`],
                                    roleId: id,
                                });
                            } else if (entityType === 'donor') {
                                const donor = {
                                    accountType: 'personal',
                                    avatar: data.attributes.avatar,
                                    balance: `$${data.attributes.balance}`,
                                    location: `/contexts/${id}`,
                                    name: data.attributes.displayName,
                                };
                                if (id == activeRoleId
                        || adminRoleId == activeRoleId) {
                                    fsa.payload.currentAccount = donor;
                                } else {
                                    fsa.payload.otherAccounts.unshift(donor);
                                }
                            }
                        } else {
                            accounts[id] = (setDataToPayload(attributes, type));
                        }
                    });
                    // Loading all companies and charities to otherAccounts / currentAccount
                    // based on the activeRoleId.
                    _.map(contexts, (context) => {
                        const { roleId } = context;
                        const account = accounts[context.entityId];
                        if (!_.isEmpty(account)) {
                            account.location = `/contexts/${roleId}`;
                            account.accountType = context.accountType;
                            if (roleId == activeRoleId) {
                                fsa.payload.currentAccount = account;
                            } else {
                                fsa.payload.otherAccounts.push(account);
                            }
                        }
                    });
                }
            },
        ).catch((error) => {
            console.log(JSON.stringify(error));
            isAuthenticated = false;
        }).finally(() => {
            dispatch({
                payload: {
                    isAuthenticated,
                },
                type: 'SET_AUTH',
            });
            dispatch(fsa);
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
                info: payload.userInfo,
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
        return coreApi.patch(`/taxReceiptProfiles/${taxReceiptProfile.id}`, {
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

export const getGroupsAndCampaigns = (dispatch, url, type, appendData = true, previousData = []) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.GIVING_GROUPS_AND_CAMPAIGNS,
    };
    let dataArray = [];
    if (appendData) {
        dataArray = previousData;
    }
    coreApi.get(
        url,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    ).then(
        (result) => {
            fsa.payload[type] = {
                currentLink: url,
                data: dataArray.concat(result.data),
                nextLink: (result.links.next) ? result.links.next : null,
                dataCount: result.meta.recordCount,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        fsa.payload[type] = {
            ...fsa.payload[type],
            flag: true,
        };
        dispatch(fsa);
    });
};



export const leaveGroup = (dispatch, group, allData, type) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.GIVING_GROUPS_AND_CAMPAIGNS,
    };
    const dataArray = _.merge([], allData.data);
    const currentpath = allData.currentLink;
    coreApi.patch(`/groups/leave?slug=${group.attributes.slug}`, {
    }).then(
        async () => {
            _.remove(dataArray, (e) => e.id === group.id);
            const currentData = await coreApi.get(currentpath);
            fsa.payload[type] = {
                currentLink: currentpath,
                data: _.uniqBy(_.concat(dataArray, currentData.data), 'id'),
                nextLink: (currentData.links.next) ? currentData.links.next : null,
                dataCount: currentData.meta.recordCount,
            };

            dispatch(fsa);
        },
    ).catch((error) => {
        const errorFsa = {
            payload: {
                type,
                id: group.id,
                message: error.errors[0].detail,
                adminError:0,
            },
            type: actionTypes.LEAVE_GROUP_ERROR_MESSAGE,
        };
        if (checkForOnlyOneAdmin(error.errors)) {
            errorFsa.payload.message = 'You are the only admin in this Group. In order to leave, please appoint another Group member as admin.';
            errorFsa.payload.adminError = 1;
        }
        dispatch(errorFsa);
    });
};

export const getInitalGivingGroupsAndCampaigns = (dispatch, userId) => {
    getGroupsAndCampaigns(dispatch, `/users/${userId}/administeredGroups?page[size]=9&sort=-id`, 'administeredGroups', false);
    getGroupsAndCampaigns(dispatch, `/users/${userId}/administeredCampaigns?page[size]=9&sort=-id`, 'administeredCampaigns', false);
    getGroupsAndCampaigns(dispatch, `/users/${userId}/groupsWithOnlyMemberships?page[size]=9&sort=-id`, 'groupsWithMemberships', false);
};

export const getUserGivingGoal = (dispatch, userId) => {
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
        });
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

export const getFavoritesList = (dispatch, userId, pageNumber, pageSize) => {
    const fsa = {
        payload: {
            favorites: {
                data: [],
            },
        },
        type: actionTypes.USER_FAVORITES,
    };
    const url = `user/favourites?userid=${Number(userId)}&page[number]=${pageNumber}&page[size]=${pageSize}`;
    return graphApi.get(
        url,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        },
    ).then(
        (result) => {
            fsa.payload.favorites = {
                data: result.data,
                dataCount: result.meta.recordCount,
                pageCount: result.meta.pageCount,
                currentPageNumber: pageNumber,
            };
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => {
        dispatch(fsa);
    });
};

export const removeFavorite = (dispatch, favId, userId, favorites, type, dataCount, pageSize, currentPageNumber, pageCount) => {

    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_FAVORITES,
    };
    const dataArray = _.merge([], favorites);
    const target = (type === 'charity') ? {
        entity: 'charity',
        filters: {
            charity_id: Number(favId),
        },
    } : {
        entity: 'group',
        filters: {
            group_id: Number(favId),
        },
    };
    const params = {
        relationship: 'FOLLOWS',
        source: {
            entity: 'user',
            filters: {
                user_id: Number(userId),
            },
        },
        target,
    };
    graphApi.post(`/users/deleterelationship`, params).then(
        async () => {
            const removedItem = (type === 'charity') ? { attributes: { charity_id: favId } }
                : { attributes: { group_id: favId } };
            _.remove(dataArray, removedItem);
            let pageNumber = currentPageNumber;

            const url = `user/favourites?userid=${Number(userId)}&page[number]=${currentPageNumber}&page[size]=${pageSize}`;
            const currentData = await graphApi.get(url);
            if (currentData) {
                if (_.size(currentData.data) === 0 && currentData.meta.pageCount < currentPageNumber) {
                    pageNumber = (currentData.meta.pageCount === 0) ? 1 : 0;
                }
                fsa.payload.favorites = {
                    currentPageNumber: pageNumber,
                    data: _.uniqWith(_.concat(dataArray, currentData.data), _.isEqual),
                    dataCount: currentData.meta.recordCount,
                    pageCount: currentData.meta.pageCount,
                };
                dispatch(fsa);
            }
        },
    ).catch((err) => {
        triggerUxCritialErrors(err.errors || err, dispatch);
        fsa.payload.favorites = {
            currentPageNumber,
            data: dataArray,
            dataCount,
            pageCount,
        };
        dispatch(fsa);
        dispatch({
            payload: {
            },
            type: actionTypes.ENABLE_FAVORITES_BUTTON,
        });
    });
};
