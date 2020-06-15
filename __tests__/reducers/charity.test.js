import charity from '../../reducers/charity';
import {
    charityDetails,
    donationDetails,
    beneficiaryFinance,
} from '../components/charity/Data';

describe('Testing charity profile Reducer', () => {
    test('should return state for GET_CHARITY_DETAILS_FROM_SLUG', () => {
        const type = 'GET_CHARITY_DETAILS_FROM_SLUG';
        const payload = {
            charityDetails,
        };
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    test('Testing GET_BENEFICIARY_DONEE_LIST state', () => {
        const type = 'GET_BENEFICIARY_DONEE_LIST';
        const payload = {
            donationDetails: donationDetails._embedded.donee_list,
            remainingAmount: donationDetails.totalAmount.remainingAmount,
            remainingElements: donationDetails.page.totalElements - donationDetails.page.size,
        };
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    test('Testing CHARITY_REDIRECT_TO_DASHBOARD state', () => {
        const type = 'CHARITY_REDIRECT_TO_DASHBOARD';
        const payload = {
            redirectToDashboard: false,
        };
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    test('Testing CHARITY_PLACEHOLDER_STATUS state', () => {
        const type = 'CHARITY_PLACEHOLDER_STATUS';
        const payload = {
            showPlaceholder: false,
        };
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    test('Testing RESET_CHARITY_STATES state', () => {
        const type = 'RESET_CHARITY_STATES';
        const payload = {};
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    test('Testing GET_BENEFICIARY_FINANCE_DETAILS state', () => {
        const type = 'GET_BENEFICIARY_FINANCE_DETAILS';
        const payload = {
            beneficiaryFinance,
        };
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    test('Testing CHARITY_CHART_LOADER state', () => {
        const type = 'CHARITY_CHART_LOADER';
        const payload = {
            chartLoader: false,
        };
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    test('Testing default state', () => {
        const type = '';
        const payload = {};
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
});
