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
        case 'COVER_FEES':
            const {
                coverFees,
            } = action.payload;
            newState = {
                ...state,
                coverFeesData: Object.assign({}, state.coverFees, coverFees),
            };
            break;
        case 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT':
            newState = {
                ...state,
                companyData: Object.assign({}, state.companyData, action.payload),
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
        case 'SAVE_SUCCESS_DATA':
            newState = {
                ...state,
                successData: action.payload.successData,
            };
            break;
        default:
            break;
        case 'SAVE_FOLLOW_STATUS':
            newState = {
                ...state,
                charityDetails: {
                    ...state.charityDetails,
                    charityDetails: {
                        ...state.charityDetails.charityDetails,
                        attributes: {
                            ...state.charityDetails.charityDetails.attributes,
                            following: action.payload.followStatus,

                        },
                    },
                },
                disableFollow: false,
            };
            break;
        case 'DISABLE_FOLLOW_BUTTON':
            newState = {
                ...state,
                disableFollow: true,
            };
            break;
    }
    return newState;
};

export default give;
