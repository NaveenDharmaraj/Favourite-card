import mockAxios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
    charityDetails,
    beneficiaryFinance,
    donationDetails,
} from '../components/charity/Data';
import {
    getBeneficiaryFromSlug,
    getBeneficiaryFinance,
    getBeneficiaryDoneeList,
} from '../../actions/charity';

describe('Charity profile actions test', () => {
    let store;
    beforeEach(() => {
        const middlewares = [
            thunk,
        ];
        const mockStore = configureMockStore(middlewares);
        store = mockStore();
    });
    describe('Testing charity details data', () => {
        it('Should dispatch charity data without Token', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    data: {
                        ...charityDetails,
                    },
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        redirectToDashboard: false,
                    },
                    type: 'CHARITY_REDIRECT_TO_DASHBOARD',
                },
                {
                    payload: {
                        charityDetails,
                    },
                    type: 'GET_CHARITY_DETAILS_FROM_SLUG',
                },
            ];
            await store.dispatch(getBeneficiaryFromSlug(
                'the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge',
            )).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
        it('Should dispatch charity data with token', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    data: {
                        ...charityDetails,
                    },
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        redirectToDashboard: false,
                    },
                    type: 'CHARITY_REDIRECT_TO_DASHBOARD',
                },
                {
                    payload: {
                        charityDetails,
                    },
                    type: 'GET_CHARITY_DETAILS_FROM_SLUG',
                },
            ];
            // TODO check for token in header
            await store.dispatch(getBeneficiaryFromSlug(
                'the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge',
                'TESTTOKEN',
            )).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
        it('Should not dispatch charity data with empty api data', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    data: [],
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        redirectToDashboard: false,
                    },
                    type: 'CHARITY_REDIRECT_TO_DASHBOARD',
                },
            ];
            await store.dispatch(getBeneficiaryFromSlug(
                'the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge',
                'TESTTOKEN',
            )).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
        it('Should not dispatch charity data on api ERROR', async () => {
            const error = 'Error scenario';
            mockAxios.get.mockImplementationOnce(() => Promise.reject(
                error,
            ));
            const expectedActions = [
                {
                    payload: {
                        redirectToDashboard: false,
                    },
                    type: 'CHARITY_REDIRECT_TO_DASHBOARD',
                },
                {
                    payload: {
                        redirectToDashboard: true,
                    },
                    type: 'CHARITY_REDIRECT_TO_DASHBOARD',
                }
            ];
            await store.dispatch(getBeneficiaryFromSlug(
                'the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge',
                'TESTTOKEN',
            )).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
    describe('Testing Beneficiary Finance data', () => {
        it('Should dispatch Beneficiary Finance data', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    beneficiaryFinanceList: [
                        ...beneficiaryFinance,
                    ],
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        chartLoader: true,
                    },
                    type: 'CHARITY_CHART_LOADER',
                },
                {
                    payload: {
                        beneficiaryFinance,
                    },
                    type: 'GET_BENEFICIARY_FINANCE_DETAILS',
                },
                {
                    payload: {
                        chartLoader: false,
                    },
                    type: 'CHARITY_CHART_LOADER',
                },
            ];
            await store.dispatch(getBeneficiaryFinance(87)).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
        it('Should not dispatch Beneficiary Finance data with empty api data', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    beneficiaryFinanceList: [],
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        chartLoader: true,
                    },
                    type: 'CHARITY_CHART_LOADER',
                },
                {
                    payload: {
                        chartLoader: false,
                    },
                    type: 'CHARITY_CHART_LOADER',
                },
            ];
            await store.dispatch(getBeneficiaryFinance(87)).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
    describe('Testing doneelist data', () => {
        it('Should dispatch doneelist with more than 20 total records', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    ...donationDetails,
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        showPlaceholder: true,
                    },
                    type: 'CHARITY_PLACEHOLDER_STATUS',
                },
                {
                    payload: {
                        donationDetails: donationDetails._embedded.donee_list,
                        remainingAmount: donationDetails.totalAmount.remainingAmount,
                        remainingElements: donationDetails.page.totalElements - donationDetails.page.size,
                    },
                    type: 'GET_BENEFICIARY_DONEE_LIST',
                },
                {
                    payload: {
                        showPlaceholder: false,
                    },
                    type: 'CHARITY_PLACEHOLDER_STATUS',
                },
            ];
            await store.dispatch(getBeneficiaryDoneeList('87', 2018, 1, false)).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
        it('Should not dispatch doneelist with empty api data', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    ...donationDetails,
                    _embedded: {
                        ...donationDetails._embedded,
                        donee_list: [],
                    },
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        showPlaceholder: true,
                    },
                    type: 'CHARITY_PLACEHOLDER_STATUS',
                },
                {
                    payload: {
                        showPlaceholder: false,
                    },
                    type: 'CHARITY_PLACEHOLDER_STATUS',
                },
            ];
            await store.dispatch(getBeneficiaryDoneeList('87', 2018, 1, false)).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
        it('Should dispatch remaining amount and remaining elements as 0 for less than or equal to 20 total records', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    ...donationDetails,
                    page: {
                        ...donationDetails.page,
                        totalElements: 20,
                    },
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        showPlaceholder: true,
                    },
                    type: 'CHARITY_PLACEHOLDER_STATUS',
                },
                {
                    payload: {
                        donationDetails: donationDetails._embedded.donee_list,
                        remainingAmount: 0,
                        remainingElements: 0,
                    },
                    type: 'GET_BENEFICIARY_DONEE_LIST',
                },
                {
                    payload: {
                        showPlaceholder: false,
                    },
                    type: 'CHARITY_PLACEHOLDER_STATUS',
                },
            ];
            await store.dispatch(getBeneficiaryDoneeList('87', 2018, 1, false)).then(() => {
                expect.assertions(1);
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});
