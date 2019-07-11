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
                companiesAccountsData: Object.assign([], state.companiesAccountsData,
                    companiesAccountsData),
                defaultTaxReceiptProfile: {
                    ...state.defaultTaxReceiptProfile,
                    ...defaultTaxReceiptProfile,
                },
                donationMatchData: Object.assign([], state.donationMatchData, donationMatchData),
                fund: {
                    ...state.fund,
                    ...fund,
                },
                paymentInstrumentsData: Object.assign([], state.paymentInstrumentsData,
                    paymentInstrumentsData),
                userAccountsFetched: {
                    ...state.userAccountsFetched,
                    ...userAccountsFetched,
                },
            };
            break;
        case 'TAX_RECEIPT_PROFILES':
            newState = {
                ...state,
                taxReceiptGetApiStatus: action.payload.taxReceiptGetApiStatus,
                taxReceiptProfiles: Object.assign([], state.taxReceiptProfiles, action.payload.taxReceiptProfiles),
            };
            break;
        case 'GROUP_FROM_SLUG':
            newState = {
                ...state,
                giveData: {
                    giveTo: {
                        id: action.payload.groupDetails.id,
                        isCampaign: action.payload.groupDetails.attributes.isCampaign,
                        name: action.payload.groupDetails.attributes.name,
                        recurringEnabled: action.payload.groupDetails.attributes.recurringEnabled,
                        text: action.payload.groupDetails.attributes.name,
                        type: action.payload.groupDetails.type,
                        value: action.payload.groupDetails.attributes.fundId,
                    },
                },
                groupFromUrl: false,
            };
            break;
        case 'SET_USER_TAX_API_STATUS_FALSE':
            newState = {
                ...state,
                taxReceiptGetApiStatus: action.payload.taxReceiptGetApiStatus,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default user;
