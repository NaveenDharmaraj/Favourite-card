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
        default:
            break;
    }
    return newState;
};

export default charity;
