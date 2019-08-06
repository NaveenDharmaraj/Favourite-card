const app = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'TRIGGER_UX_CRITICAL_ERROR':
            newState = {
                ...state,
                errors: Object.assign([], state.errors, action.payload.errors),
            };
            break;
        case 'DISMISS_UX_CRITICAL_ERROR':
            newState = {
                ...state,
                errors: action.payload.errors,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default app;
