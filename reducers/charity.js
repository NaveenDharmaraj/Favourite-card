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
        case 'SAVE_FOLLOW_STATUS':
                newState = {
                    ...state,
                    followStatus: Object.assign({}, state.donationDetails, action.payload),
                };
        default:
            break;
    }
    return newState;
};

export default charity;
