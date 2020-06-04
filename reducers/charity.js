const charity = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_BENEFICIARY_DONEE_LIST':
            if (!action.payload.isSeeMore) {
                newState = {
                    ...state,
                    donationDetails: Object.assign([], action.payload.donationDetails),
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                };
            } else {
                newState = {
                    ...state,
                    donationDetails: state.donationDetails.concat(action.payload.donationDetails),
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                }
            }
            break;
        // case 'CHARITY_SAVE_DEEP_LINK':
        //     newState = {
        //         ...state,
        //         charityDeepLink: action.payload.deepLink,
        //     };
        //     break;
        case 'GET_CHARITY_DETAILS_FROM_SLUG':
            newState = {
                ...state,
                charityDetails: Object.assign({}, state.charityDetails, action.payload.charityDetails),
            };
            break;
        // case 'SAVE_FOLLOW_STATUS_CHARITY':
        //     newState = {
        //         ...state,
        //         charityDetails: {
        //             ...state.charityDetails,
        //             attributes: {
        //                 ...state.charityDetails.attributes,
        //                 following: action.payload.followStatus,

        //             },
        //         },
        //         // disableFollow: false,
        //     };
        //     break;
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
        // case 'SET_HEADQUARTER_GEOCODE':
        //     newState = {
        //         ...state,
        //         headQuarterData: action.payload.city,
        //     };
        //     break;
        // case 'SET_COUNTRIES_GEOCODE':
        //     newState = {
        //         ...state,
        //         countriesData: action.payload.city,
        //     };
        //     break;
        case 'RESET_CHARITY_STATES':
            newState = {};
            break;
        // case 'CHARITY_LOADER_STATUS':
        //     newState = {
        //         ...state,
        //         mapLoader: action.payload.mapLoader,
        //     };
        //     break;
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
        case 'CHARITY_BUTTON_LOADER_STATUS':
            newState = {
                ...state,
                showButtonLoader: action.payload.showButtonLoader,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default charity;
