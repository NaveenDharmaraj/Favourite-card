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
        case 'USER_PROFILE_LOCATION_SEARCH':
            newState = {
                ...state,
                locationOptions: action.payload.data,
            };
            break;
        case 'USER_PROFILE_LOCATION_SEARCH_LOADER':
            newState = {
                ...state,
                locationLoader: action.payload.locationLoader,
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
            if (state.userFindTagsList && state.userFindTagsList.data && !action.payload.isSearch) {
                newState = {
                    ...state,
                    loadedData: action.payload.loadedData,
                    pageNumber: action.payload.pageNumber,
                    recordCount: action.payload.recordCount,
                    userFindTagsList: {
                        ...state.userFindTagsList,
                        data: state.userFindTagsList.data.concat(action.payload.data),
                    },
                };
            } else {
                newState = {
                    ...state,
                    loadedData: action.payload.loadedData,
                    pageNumber: action.payload.pageNumber,
                    recordCount: action.payload.recordCount,
                    userFindTagsList: action.payload,
                };
            }
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
        case 'USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS':
            newState = {
                ...state,
                newCreditCardApiCall: action.payload.newCreditCardApiCall,
            };
            break;
        case 'USER_PROFILE_DEFAULT_TAX_RECEIPT':
            newState = {
                ...state,
                userDefaultTaxReceipt: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_SIGNUP_DEEPLINK':
            newState = {
                ...state,
                userProfileSignUpDeeplink: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_USERPROFILE_DEEPLINK':
            newState = {
                ...state,
                userProfileProfilelink: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_ADMIN_GROUP_LOAD_STATUS':
            newState = {
                ...state,
                userProfileAdminGroupsLoadStatus: action.payload.userProfileAdminGroupsLoadStatus,
            };
            break;
        case 'USER_PROFILE_MEMBER_GROUP_LOAD_STATUS':
            newState = {
                ...state,
                userProfileMemberGroupsLoadStatus: action.payload.userProfileMemberGroupsLoadStatus,
            };
            break;
        case 'USER_PROFILE_FAVOURITES_LOAD_STATUS':
            newState = {
                ...state,
                userProfileFavouritesLoadStatus: action.payload.userProfileFavouritesLoadStatus,
            };
            break;
        case 'USER_PROFILE_CHARITABLE_INTERESTS_LOAD_STATUS':
            newState = {
                ...state,
                userProfileCharitableInterestsLoadStatus: action.payload.userProfileCharitableInterestsLoadStatus,
            };
            break;
        case 'USER_PROFILE_RESET_TAG_LIST':
            newState = {
                ...state,
                loadedData: 0,
                pageNumber: 1,
                userFindTagsList: {},
            };
            break;
        case 'USER_PROFILE_GET_EMAIL_LIST':
            newState = {
                ...state,
                emailDetailList: action.payload.emailDetailList,
            };
            break;
        case 'USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR':
            newState = {
                ...state,
                errorMessageTitle: action.payload.errorMessageTitle,
                showEmailError: action.payload.showEmailError,
            };
            break;
        case 'USER_PROFILE_SHOW_EMAIL_LOADER':
            newState = {
                ...state,
                showEmailLoader: action.payload.showEmailLoader,
            };
            break;
        case 'USER_PROFILE_SHOW_ADD_BUTTON_LOADER':
            newState = {
                ...state,
                showAddButtonLoader: action.payload.showAddButtonLoader,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default userProfile;
