import charity from '../../reducers/charity';
import {
    charityDetails,
    donationDetails,
    beneficiaryFinance,
} from '../components/charity/Data';

describe('Testing charity profile Reducer', () => {
    it('should match state with payload for charity data', () => {
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
    it('Should match state with payload for donee list data', () => {
        const type = 'GET_BENEFICIARY_DONEE_LIST';
        const payload = {
            donationDetails: donationDetails._embedded.donee_list,
            remainingAmount: donationDetails.totalAmount.remainingAmount,
            remainingElements: 34,
        };
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    it('Should match state with payload on api error', () => {
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
    it('Should match state with payload for donee list popup placeholder', () => {
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
    it('Should reset state on landing to charity page', () => {
        const type = 'RESET_CHARITY_STATES';
        const payload = {};
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
    it('Should match state with payload for chart data', () => {
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
    it('Should match state with payload for chart loader', () => {
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
    it('Should reset to default state', () => {
        const type = '';
        const payload = {};
        const newState = charity(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });
});
