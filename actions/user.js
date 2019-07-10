/* eslint-disable no-else-return */

import _ from 'lodash';

import {
    populateAccountOptions,
} from '../helpers/give/utils';
import coreApi from '../services/coreApi';

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

export const actionTypes = {
    DONATIONS_ADDTO_DROPDOWN: 'DONATIONS_ADDTO_DROPDOWN',
    GET_MATCH_POLICIES_PAYMENTINSTRUMENTS: 'GET_MATCH_POLICIES_PAYMENTINSTRUMENTS',
    TAX_RECEIPT_PROFILES: 'TAX_RECEIPT_PROFILES',
    USER_AUTH: 'USER_AUTH',
};


export const getDonationMatchAndPaymentInstruments = () => {

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
        const userId = '888000'; // 999614 , 888000
        const fsa = {
            payload: {
                companiesAccountsData: [],
                defaultTaxReceiptProfile: {},
                donationMatchData: [],
                fund: {},
                paymentInstrumentsData: [],
                userAccountsFetched: false,
                // userCampaigns: [],
                // userGroups: [],
            },
            type: actionTypes.GET_MATCH_POLICIES_PAYMENTINSTRUMENTS,
        };
        const fetchData = coreApi.get(`/users/${userId}?include=donationMatchPolicies,activePaymentInstruments,defaultTaxReceiptProfile,fund`);
        // const groupData =  callApiAndGetData(`/users/${userId}/administeredGroups?page[size]=50&sort=-id`);
        // const campaignsData =  callApiAndGetData(`/users/${userId}/administeredCampaigns?page[size]=50&sort=-id`);
        const companiesData = callApiAndGetData(`/users/${userId}/administeredCompanies?page[size]=50&sort=-id`);
        Promise.all([
            fetchData,
            // groupData,
            // campaignsData,
            companiesData,
        ])
            .then(
                (data) => {
                    const userData = data[0];
                    if (!_.isEmpty(userData.included)) {
                        const { included } = userData;
                        const dataMap = {
                            donationMatches: 'donationMatchData',
                            paymentInstruments: 'paymentInstrumentsData',
                        };
                        included.map((item) => {
                            const {
                                attributes,
                                id,
                                type,
                            } = item;
                            if (type === 'taxReceiptProfiles') {
                                // Getting the default taxReceiptProfiles
                                fsa.payload.defaultTaxReceiptProfile = {
                                    attributes,
                                    id,
                                    type,
                                };
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
                    // fsa.payload.userGroups = data[1];
                    // fsa.payload.userCampaigns = data[2];
                    fsa.payload.companiesAccountsData = data[1];
                    fsa.payload.userAccountsFetched = true;
                },
            ).catch((error) => {
                fsa.error = error;
                fsa.payload.userAccountsFetched = true;
            }).finally(() => {
                const {
                    companiesAccountsData,
                    fund,
                } = fsa.payload;
                dispatch(fsa);
                dispatch({
                    payload: {
                        donationAddToData: populateAccountOptions({
                            companiesAccountsData,
                            firstName: 'Demo',
                            fund,
                            id: '888000', // 888000 // 999614
                            lastName: 'UI',
                        }),
                    },
                    type: actionTypes.DONATIONS_ADDTO_DROPDOWN,
                });
            });
    };
};


export const validateUser = (dispatch) => {
    return coreApi.get('/users/888000?include=chimpAdminRole,donorRole,fund').then((result) => {
        return dispatch({type: actionTypes.USER_AUTH, payload: {isAuthenticated: true}})
    }).catch((error) => {
        console.log(JSON.stringify(error));
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

