
const onBoarding = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'CREATE_USER':
            newState = {
                ...state,
                newUserDetails: action.payload.newUserDetails,
            };
            break;
        case 'USER_EXISTS':
            newState = {
                ...state,
                userExists: action.payload.userExists,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default onBoarding;
