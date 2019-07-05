import _ from 'lodash';
const user = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'USER_AUTH':
            newState = {
                ...state,
                auth: action.payload,
            };
            break;
        case 'GET_MATCH_POLICIES_PAYMENTINSTRUMENTS':
            const {
                companiesAccountsData,
                donationMatchData,
                paymentInstrumentsData,
                defaultTaxReceiptProfile,
                fund,
                userAccountsFetched,
            } = action.payload;
            newState = {
                ...state,
                companiesAccountsData: Object.assign([], state.companiesAccountsData, companiesAccountsData),
                defaultTaxReceiptProfile: {
                    ...state.defaultTaxReceiptProfile,
                    ...defaultTaxReceiptProfile,
                },
                donationMatchData: Object.assign([], state.donationMatchData, donationMatchData),
                fund: {
                    ...state.fund,
                    ...fund,
                },
                paymentInstrumentsData: Object.assign([], state.paymentInstrumentsData, paymentInstrumentsData),
                userAccountsFetched: {
                    ...state.userAccountsFetched,
                    ...userAccountsFetched,
                },
            };
            break;
        default:
            break;
    }
    return newState;
};

export default user;
