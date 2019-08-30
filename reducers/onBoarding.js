
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
        case 'USER_API_VALIDATING':
            newState = {
                ...state,
                apiValidating: action.payload.apiValidating,
            };
            break;
        case 'GET_USER_CAUSES':
            newState = {
                ...state,
                causesList: action.payload.causesList,
            };
            break;
        case 'USER_EMAIL_RESEND':
            newState = {
                ...state,
                apiResendEmail: action.payload.apiResendEmail,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default onBoarding;
