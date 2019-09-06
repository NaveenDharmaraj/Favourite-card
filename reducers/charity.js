const charity = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_BENEFICIARY_DONEE_LIST':
            newState = {
                ...state,
                donationDetails: Object.assign({}, state.donationDetails, action.payload),
            };
            break;
        case 'SAVE_DEEP_LINK':
            newState = {
                ...state,
                charityDeepLink: action.payload.deepLink,
            };
            break;
        case 'GET_BENEFICIARY_FROM_SLUG':
            newState = {
                ...state,
                charityDetails: Object.assign({}, state.charityDetails, action.payload),
            };
            break;
        case 'SAVE_FOLLOW_STATUS_CHARITY':
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
                // disableFollow: false,
            };
            break;
        case 'REDIRECT_TO_DASHBOARD':
            newState = {
                ...state,
                redirectToDashboard: action.payload.redirectToDashboard,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default charity;
