
const dashboard = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'USER_DASHBOARD':
            newState = {
                ...state,
                dashboardData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_FRIENDS':
            newState = {
                ...state,
                friendsData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_RECOMMENDATIONS':
            newState = {
                ...state,
                recommendationData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_STORIES':
            newState = {
                ...state,
                storiesData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_FRIEND_EMAIL':
            newState = {
                ...state,
                userFriendEmail: Object.assign({}, action.payload),
            };
            break;
        default:
            break;
    }
    return newState;
};

export default dashboard;
