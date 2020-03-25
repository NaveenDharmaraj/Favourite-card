const give = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'SAVE_FLOW_OBJECT':
            newState = {
                ...state,
                flowObject: {
                    ...state.flowObject,
                    ...action.payload,
                },
            };
            break;
        case 'CLOSE_CREDIT_CARD_MODAL':
            newState = {
                ...state,
                ...action.payload,
            };
            break;
        case 'COVER_FEES':
            const {
                coverFees,
            } = action.payload;
            newState = {
                ...state,
                coverFeesData: Object.assign({}, state.coverFees, coverFees),
            };
            break;
        case 'COVER_AMOUNT_DISPLAY':
            const {
                coverAmountDisplay,
            } = action.payload;
            newState = {
                ...state,
                coverAmountDisplay,
            };
            break;
        case 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT':
            newState = {
                ...state,
                companyData: Object.assign({}, state.companyData, action.payload),
            };
            break;
        case 'SET_COMPANY_ACCOUNT_FETCHED':
            newState = {
                ...state,
                companyAccountsFetched: action.payload.companyAccountsFetched,
            };
            break;
        case 'GET_BENIFICIARY_FOR_GROUP':
            newState = {
                ...state,
                benificiaryForGroupDetails: Object.assign({}, state.benificiaryForGroupDetails, action.payload),
            };
            break;
        case 'GET_BENEFICIARY_FROM_SLUG':
            newState = {
                ...state,
                charityDetails: Object.assign({}, state.charityDetails, action.payload),
            };
            break;
        case 'GET_COMPANY_TAXRECEIPTS':
            newState = {
                ...state,
                companyData: {
                    ...state.companyData,
                    taxReceiptGetApiStatus: action.payload.taxReceiptGetApiStatus,
                    taxReceiptProfiles: action.payload.companyTaxReceiptProfiles,
                },
            };
            break;
        case 'SET_COMPANY_TAX_API_STATUS_FALSE':
            newState = {
                ...state,
                companyData: {
                    ...state.companyData,
                    taxReceiptGetApiStatus: action.payload.taxReceiptGetApiStatus,
                },
            };
            break;
        case 'GET_GROUP_FROM_SLUG':
            newState = {
                ...state,
                groupSlugDetails: {
                    ...action.payload.groupDetails,
                },
            };
            break;
        case 'SAVE_SUCCESS_DATA':
            newState = {
                ...state,
                successData: action.payload.successData,
            };
            break;
        case 'TAX_RECEIPT_API_CALL_STATUS':
            newState = {
                ...state,
                taxReceiptEditApiCall: action.payload.taxReceiptApiCall,
            };
            break;
        case 'ADD_NEW_CREDIT_CARD_STATUS':
            newState = {
                ...state,
                creditCardApiCall: action.payload.creditCardApiCall,
            };
            break;
        case 'SET_COMPANY_PAYMENT_ISTRUMENTS':
            newState = {
                ...state,
                companyData: {
                    ...state.companyData,
                    companyPaymentInstrumentsData: action.payload.companyPaymentInstrumentsData,
                },
            };
            break;
        default:
            break;
    }
    return newState;
};

export default give;
