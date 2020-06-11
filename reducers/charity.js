const charity = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_BENEFICIARY_DONEE_LIST':
            newState = {
                ...state,
                donationDetails: Object.assign([], action.payload.donationDetails),
                remainingAmount: action.payload.remainingAmount,
                remainingElements: action.payload.remainingElements,
            };
            break;
        case 'GET_CHARITY_DETAILS_FROM_SLUG':
            newState = {
                ...state,
                charityDetails: Object.assign({}, state.charityDetails, action.payload.charityDetails),
            };
            break;
        case 'CHARITY_REDIRECT_TO_DASHBOARD':
            newState = {
                ...state,
                redirectToDashboard: action.payload.redirectToDashboard,
            };
            break;
        case 'CHARITY_PLACEHOLDER_STATUS':
            newState = {
                ...state,
                showPlaceholder: action.payload.showPlaceholder,
            };
            break;
        case 'RESET_CHARITY_STATES':
            newState = {};
            break;
        case 'SAVE_FOLLOW_STATUS_CHARITY':
            newState = {
                ...state,
                charityDetails: {
                    ...state.charityDetails,
                    attributes: {
                        ...state.charityDetails.attributes,
                        following: action.payload.followStatus,
                    },
                },
            };
            break;
        case 'GET_BENEFICIARY_FINANCE_DETAILS':
            newState = {
                ...state,
                beneficiaryFinance: action.payload.beneficiaryFinance,
            };
            break;
        case 'CHARITY_CHART_LOADER':
            newState = {
                ...state,
                chartLoader: action.payload.chartLoader,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default charity;
