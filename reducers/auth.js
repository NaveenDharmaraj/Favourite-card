const auth = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'SET_AUTH':
            newState = {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
            };
            break;
        case 'SET_AUTH0_USER_FAILURE':
            newState = {
                ...state,
                auth0Failure: { ...action.payload },
            };
            break;
        default:
            break;
    }
    return newState;
};

export default auth;
