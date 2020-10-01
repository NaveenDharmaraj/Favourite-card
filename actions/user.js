/* eslint-disable no-else-return */

import _ from 'lodash';
import coreApi from '../services/coreApi';
import authRorApi from '../services/authRorApi';
import graphApi from '../services/graphApi';
import securityApi from '../services/securityApi';
import wpApi from '../services/wpApi';
import { Router } from '../routes';
import getConfig from 'next/config';
import {
    triggerUxCritialErrors,
} from './error';
import {
    generatePayloadBodyForFollowAndUnfollow,
} from './profile';
import storage from '../helpers/storage';

const { publicRuntimeConfig } = getConfig();
const {
    BASIC_AUTH_KEY,
    PARAMSTORE_APP_NAME,
    PARAMSTORE_ENV_NAME,
    PARAMSTORE_NAME_SPACE
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
    APPLICATION_ENV_CONFIG_VARIABLES: 'APPLICATION_ENV_CONFIG_VARIABLES',
    GET_MATCH_POLICIES_PAYMENTINSTRUMENTS: 'GET_MATCH_POLICIES_PAYMENTINSTRUMENTS',
    GET_USERS_GROUPS: 'GET_USERS_GROUPS',
    GET_UPCOMING_TRANSACTIONS: 'GET_UPCOMING_TRANSACTIONS',
    GIVING_GROUPS_lEAVE_MODAL: 'GIVING_GROUPS_lEAVE_MODAL',
    MONTHLY_TRANSACTION_API_CALL: 'MONTHLY_TRANSACTION_API_CALL',
    TAX_RECEIPT_PROFILES: 'TAX_RECEIPT_PROFILES',
    SAVE_DEEP_LINK: 'SAVE_DEEP_LINK',
    SET_USER_INFO: 'SET_USER_INFO',
    SET_USER_ACCOUNT_FETCHED: 'SET_USER_ACCOUNT_FETCHED',
    UPDATE_USER_FUND: 'UPDATE_USER_FUND',
    GIVING_GROUPS_AND_CAMPAIGNS: 'GIVING_GROUPS_AND_CAMPAIGNS',
    DISABLE_GROUP_SEE_MORE: 'DISABLE_GROUP_SEE_MORE',
    LEAVE_GROUP_ERROR_MESSAGE: 'LEAVE_GROUP_ERROR_MESSAGE',
    USER_GIVING_GOAL_DETAILS: 'USER_GIVING_GOAL_DETAILS',
    USER_INITIAL_FAVORITES: 'USER_INITIAL_FAVORITES',
    USER_FAVORITES: 'USER_FAVORITES',
    UPDATE_FAVORITES: 'UPDATE_FAVORITES',
    ENABLE_FAVORITES_BUTTON: 'ENABLE_FAVORITES_BUTTON',
    CLAIM_CHARITY_ERROR_MESSAGE: 'CLAIM_CHARITY_ERROR_MESSAGE',
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

// eslint-disable-next-line import/exports-last
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
        dispatch({
            payload: {
                userAccountsFetched: false,
            },
            type: actionTypes.SET_USER_ACCOUNT_FETCHED,
        });
        const fetchData = coreApi.get(
            `/users/${userId}?include=donationMatchPolicies,defaultTaxReceiptProfile,taxReceiptProfiles,fund`,
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
        const paymentInstruments = coreApi.get(
            `/users/${userId}/activePaymentInstruments?sort=-default`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            },
        );
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
            paymentInstruments,
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
                    fsa.payload.paymentInstrumentsData = [
                        ...data[4].data,
                    ];
                    dispatch({
                        payload: {
                            userAccountsFetched: true,
                        },
                        type: actionTypes.SET_USER_ACCOUNT_FETCHED,
                    });
                },
            ).catch((error) => {
                fsa.error = error;
                dispatch({
                    payload: {
                        userAccountsFetched: true,
                    },
                    type: actionTypes.SET_USER_ACCOUNT_FETCHED,
                });
            }).finally(() => {
                dispatch(fsa);
            });
    };
};

export const wpLogin = (token = null) => {
    let params = null;
    if (!_.isEmpty(token)) {
        params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }
    return wpApi.post('/login', null, params);
};

export const chimpLogin = (token = null, options = null) => {
    let params = null;
    const claimCharityAccessCode = storage.getLocalStorageWithExpiry('claimToken','local');
    if (!_.isEmpty(token)) {
        params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }
    if (options && typeof options === 'object') {
        params = {
            ...params,
            params: {
                ...options,
                beneficiaryClaimToken: claimCharityAccessCode,
            },
        }
    }
    return authRorApi.post(`/auth/login`, null, params);
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

export const getUser = async (dispatch, userId, token = null) => {
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
    await coreApi.get(`/users/${userId}?include=activeRole`, params).then((result) => {
        isAuthenticated = true;
        const { data } = result;
        const dataMap = {
            BeneficiaryAdminRole: 'charity',
            CompanyAdminRole: 'company',
            DonorRole: 'personal',
            ChimpAdminRole: 'personal',
        };
        const {
            activeRoleId,
        } = data.attributes;
        _.merge(fsa.payload, {
            activeRoleId,
            info: data,
            isAdmin: false,
        });
        if (!_.isEmpty(data.relationships.chimpAdminRole.data)) {
            fsa.payload.isAdmin = true;
        }
        const {
            attributes: {
                roleType,
                roleDetails,
            },
            id,
        } = result.included[0];
        fsa.payload.currentAccount = {
            accountType: dataMap[roleType],
            avatar: roleDetails.avatar,
            balance: `$${roleDetails.balance}`,
            location: `/contexts/${id}`,
            name: roleDetails.name,
            slug: !_.isEmpty(roleDetails.slug) ? roleDetails.slug : null,
        };
    }).catch((error) => {
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

export const getUserAllDetails = (dispatch, userId) => {
    const fsa = {
        payload: {},
        type: actionTypes.SET_USER_INFO,
    };
    const userDetails = coreApi.get(`/users/${userId}?include=chimpAdminRole,donorRole`);
    const administeredCompanies = callApiAndGetData(`/users/${userId}/administeredCompanies?page[size]=50&sort=-id`);
    const administeredBeneficiaries = callApiAndGetData(`/users/${userId}/administeredBeneficiaries?page[size]=50&sort=-id`);
    const beneficiaryAdminRoles = callApiAndGetData(`/users/${userId}/beneficiaryAdminRoles?page[size]=50&sort=-id`);
    const companyAdminRoles = callApiAndGetData(`/users/${userId}/companyAdminRoles?page[size]=50&sort=-id`);
    return Promise.all([
        userDetails,
        administeredCompanies,
        administeredBeneficiaries,
        beneficiaryAdminRoles,
        companyAdminRoles,
    ])
        .then(
            (allData) => {
                const userData = allData[0];
                const { data } = userData;
                const {
                    activeRoleId,
                    hasAdminAccess,
                    donorAccount,
                } = data.attributes;
                let adminRoleId = null;
                _.merge(fsa.payload, {
                    activeRoleId,
                    currentAccount: {},
                    info: data,
                    isAdmin: false,
                    otherAccounts: [],
                });
                if (!_.isEmpty(data.relationships.chimpAdminRole.data)) {
                    // fsa.payload.isAdmin = true;
                    adminRoleId = data.relationships.chimpAdminRole.data.id;
                }
                if (hasAdminAccess) {
                    fsa.payload.isAdmin = true;
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
                                if (id == activeRoleId || donorAccount) {
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
                return fsa.payload.otherAccounts;
            },
        ).catch((error) => {
            // console.log(JSON.stringify(error));
        }).finally(() => {
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
        // console.log(error);
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
        // console.log(error);
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
        ).catch(() => {
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
    dispatch({
        payload: { buttonLoading: true },
        type: actionTypes.GIVING_GROUPS_lEAVE_MODAL,
    });
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
            dispatch({
                payload: {
                    buttonLoading: false,
                    closeModal: true,
                },
                type: actionTypes.GIVING_GROUPS_lEAVE_MODAL,
            });
        },
    ).catch((error) => {
        dispatch({
            payload: { buttonLoading: false },
            type: actionTypes.GIVING_GROUPS_lEAVE_MODAL,
        });
        const errorFsa = {
            payload: {
                type,
                id: group.id,
                message: error.errors[0].detail,
                adminError: 0,
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
            // console.log(error);
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
    }).then((result) => {
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
        // console.log(error);
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
        // console.log(error);
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
    if (pageNumber === 1) {
        fsa.type = actionTypes.USER_INITIAL_FAVORITES;
    }
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
        // console.log(error);
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
    const params = generatePayloadBodyForFollowAndUnfollow(userId, favId, type);
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

export const saveUserCauses = (dispatch, userId, userCauses, discoverValue) => {
    const bodyDataCauses = {
        causes: userCauses,
        userid: Number(userId),
    };

    const bodyData = {
        is_searchable: discoverValue,
        skipCauseSelection: true,
        user_id: Number(userId),
    };

    return graphApi.patch(`/user/updatecauses`, bodyDataCauses).then(
        () => {
            securityApi.patch(`update/user`, bodyData).then(
                () => {
                    getUserFund(dispatch, userId).then(() => {
                        Router.pushRoute('/dashboard');
                    });
                },
            );
        },
    ).catch((err) => {
        dispatch({
            payload: {
                continueButtonDisable: false,
            },
            type: 'DISABLE_BUTTON_IN_USER_MIGRATION'
        });
        triggerUxCritialErrors(err.errors || err, dispatch);
    });
};

export const checkClaimCharityAccessCode = (accessCode, userId) => (dispatch) => {
    return coreApi.post(`/claimCharities`, {
        data: {
            type: "claimCharities",
            attributes: {
                claimToken: accessCode,
            }
        }
    }).then(
        (result) => {
            let {
                data: {
                    attributes: {
                        beneficiarySlug,
                    }
                }
            } = result;
            // Doing the other accounts API call on componentDidMount of success page. This is to make sure that it will 
            // work fine in login scenario too.
            // getUserAllDetails(dispatch, userId).then(() => {
                Router.pushRoute(`/claim-charity/success?slug=${beneficiarySlug ? beneficiarySlug : ''}`);
            // });
        }
    ).catch(() => {
        const errorMessage = "That code doesn't look right or it's expired. Try again or claim without a code below.";
        dispatch(claimCharityErrorCondition(errorMessage));
    });
};

export const validateClaimCharityAccessCode = (accessCode) => (dispatch) => {
    return coreApi.get(`/claim_charities/validate_claim_charity_token?claimToken=${accessCode}`, BASIC_AUTH_HEADER)
        .then(async (res) => {
            let {
                data: {
                    success,
                    signup_source,
                    signup_source_id,
                }
            } = res;
            if (success === true) {
                const now = new Date();
                const expiry = 3600000;
                const claimCharityCode = {
                    value: accessCode,
                    expiry: now.getTime() + expiry,
                };
                const signup_sourceCode = {
                    value: signup_source,
                    expiry: now.getTime() + expiry,
                };
                const signup_sourceIdCode = {
                    value: signup_source_id,
                    expiry: now.getTime() + expiry,
                };
                await storage.set('claimToken', claimCharityCode, 'local');
                await storage.set('signup_source', signup_sourceCode, 'local');
                await storage.set('signup_source_id', signup_sourceIdCode, 'local');
                Router.pushRoute('/users/new?isClaimCharity=true');
            }
        }).catch(() => {
            const errorMessage = "That code doesn't look right or it's expired. Try again or claim without a code below.";
            dispatch(claimCharityErrorCondition(errorMessage));
        });
}

export const claimCharityErrorCondition = (message) => (dispatch) =>{
    dispatch({
        payload: { 
            claimCharityErrorMessage: message
        },
        type: actionTypes.CLAIM_CHARITY_ERROR_MESSAGE,
    });
};

export const getParamStoreConfig = (params = []) => async (dispatch) => {
    try {
        const paramStoreConfigResponse = await securityApi.post('/paramStore/readParams', {
            appName: PARAMSTORE_APP_NAME,
            envName: PARAMSTORE_ENV_NAME,
            nameSpace: PARAMSTORE_NAME_SPACE,
            ssmKey: [
                ...params,
            ],
        });
        let paramStoreConfigObj = {};
        paramStoreConfigResponse.data.filter((item) => {
            paramStoreConfigObj = {
                ...paramStoreConfigObj,
                [`${item.attributes.key}`]: item.attributes.value,
            };
        });
        dispatch({
            payload: paramStoreConfigObj,
            type: 'APPLICATION_ENV_CONFIG_VARIABLES',
        });
        return paramStoreConfigObj;
    } catch (err) { }
};
