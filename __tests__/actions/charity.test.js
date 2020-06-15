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

describe('Charity Profile Action unit test', () => {
    let store;
    beforeEach(() => {
        const middlewares = [
            thunk,
        ];
        const mockStore = configureMockStore(middlewares);
        store = mockStore();
    });
    test('Testing FindBySlug action', async () => {
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
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    test('Testing FindBySlug action with token', async () => {
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
            'TESTTOKEN',
        )).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    test('Testing FindBySlug action with empty data', async () => {
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
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    test('Testing Beneficiary Finance action', async () => {
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
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    test('Testing Beneficiary Finance action with empty data', async () => {
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
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    test('Testing BeneficiaryDoneeList action', async () => {
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
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
