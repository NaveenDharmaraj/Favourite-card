
const userProfile = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'USER_PROFILE_BASIC':
            newState = {
                ...state,
                userProfileBasicData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_CHARITABLE_INTERESTS':
            newState = {
                ...state,
                userProfileCharitableData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_MEMBER_GROUP':
            newState = {
                ...state,
                userProfileMemberGroupData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_ADMIN_GROUP':
            newState = {
                ...state,
                userProfileAdminGroupData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_FAVOURITES':
            newState = {
                ...state,
                userProfileFavouritesData: Object.assign({}, action.payload),
            };
            break;
        default:
            break;
    }
    return newState;
};

export default userProfile;
