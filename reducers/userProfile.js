import _ from 'lodash';

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
        case 'USER_PROFILE_BASIC_FRIEND':
            newState = {
                ...state,
                userFriendProfileData: Object.assign({}, action.payload),
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
        case 'USER_PROFILE_CAUSES':
            newState = {
                ...state,
                userCausesList: action.payload.userCausesList,
            };
            break;
        case 'USER_PROFILE_FOLLOWED_TAGS':
            newState = {
                ...state,
                userTagsFollowedList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_RECOMMENDED_TAGS':
            newState = {
                ...state,                
                userTagsRecommendedList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_MY_FRIENDS':
            newState = {
                ...state,
                userMyFriendsList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_FIND_FRIENDS':
            newState = {
                ...state,
                userFindFriendsList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_FIND_TAGS':
            newState = {
                ...state,
                userFindTagsList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_INVITATIONS':
            newState = {
                ...state,
                userFriendsInvitationsList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_BLOCKED_FRIENDS':
            newState = {
                ...state,
                userBlockedFriendsList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_CREDIT_CARDS':
            newState = {
                ...state,
                userCreditCardList: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_FRIEND_REQUEST':
            newState = {
                ...state,
                userAddFriendRequestData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_FRIEND_ACCEPT':
            newState = {
                ...state,
                userAcceptFriendRequestData: Object.assign({}, action.payload),
            };
            break;
        case 'ADD_NEW_CREDIT_CARD_STATUS':
            newState = {
                ...state,
                newCreditCardApiCall: action.payload.newCreditCardApiCall,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default userProfile;
