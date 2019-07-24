/* eslint-disable no-else-return */

import _ from 'lodash';

import {
    populateAccountOptions,
} from '../helpers/give/utils';
import coreApi from '../services/coreApi';
import authRorApi from '../services/authRorApi';

export const actionTypes = {
    GET_MATCH_POLICIES_PAYMENTINSTRUMENTS: 'GET_MATCH_POLICIES_PAYMENTINSTRUMENTS',
    TAX_RECEIPT_PROFILES:'TAX_RECEIPT_PROFILES',
    SET_USER_INFO: 'SET_USER_INFO',
}

const getAllPaginationData = async (url, params = null) => {
    // Right now taking the only relative url from the absolute url.
    const replacedUrl = _.split(url, '/core/v2').pop();
    const result = await coreApi.get(replacedUrl);
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

export const getDonationMatchAndPaymentInstruments = (userId, type) => {

    // const fetchData = coreApi.get(`/users/${userId}`, {
    //     params: {
    //         include: [
    //             'donationMatchPolicies',
    //             'activePaymentInstruments',
    //             'taxReceiptProfiles',
    //         ],
    //     },
    //     uxCritical: true,
    // });

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
        const fetchData = coreApi.get(`/users/${userId}?include=donationMatchPolicies,activePaymentInstruments,defaultTaxReceiptProfile,taxReceiptProfiles,fund`);
        let groupData = null;
        let campaignsData = null;
        if (type !== 'donations') {
            groupData = callApiAndGetData(`/users/${userId}/administeredGroups?page[size]=50&sort=-id`);
            campaignsData = callApiAndGetData(`/users/${userId}/administeredCampaigns?page[size]=50&sort=-id`);
        }
        const companiesData = callApiAndGetData(`/users/${userId}/administeredCompanies?page[size]=50&sort=-id`);
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
                const {
                    companiesAccountsData,
                    fund,
                    userCampaigns,
                    userGroups,
                } = fsa.payload;
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
            type: 'SET_AUTH',
            payload: {
                isAuthenticated: payload.isAuthenticated,
            },
        });
        dispatch({
            type: actionTypes.SET_USER_INFO,
            payload: {
                userInfo: payload.userInfo,
            },
        });
        return null;
    });
};

export const setTaxReceiptProfile = (data) => {
    return (dispatch) => dispatch({
        type: actionTypes.TAX_RECEIPT_PROFILES,
        payload: {
            taxReceiptGetApiStatus: true,
            taxReceiptProfiles: data,
        },
    });
};

export const getTaxReceiptProfile = (dispatch, userId) => {
    return coreApi.get(`/users/${userId}/taxReceiptProfiles`).then((result) => {
        return dispatch(setTaxReceiptProfile(result.data));
    }).catch((error) => {
        console.log(error);
    })
};

export const updateTaxReceiptProfile = (taxReceiptProfile, action, dispatch) => {
    let result = {};
    if (action === 'update') {
        const params = {
            data: {
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
            },
        };
        return coreApi.patch(`/taxReceiptProfiles/${taxReceiptProfile.id}`, {
            data: params.data,
        });
    } else {
        const params = {
            data: taxReceiptProfile,
        };
        return coreApi.post('/taxReceiptProfiles', {
            data: params.data,
            uxCritical: true,
        });
    }
    // return setTaxReceiptProfile(dispatch, result.data)
};

export const savePaymentInstrument = (cardDetails) => {
    const result = coreApi.post('/paymentInstruments', {
        data: cardDetails,
    });
    return result;
};
