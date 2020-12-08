import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';

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
                userFriendProfileData: Object.assign({}, action.payload.data),
            };
            break;
        case 'USER_PROFILE_CHARITABLE_INTERESTS':
            newState = {
                ...state,
                userProfileCausesData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_MEMBER_GROUP':
            if (!_isEmpty(state.userProfileMemberGroupData)) {
                action.payload.data = [...state.userProfileMemberGroupData.data, ...action.payload.data];
                return newState = {
                    ...state,
                    userProfileMemberGroupData: Object.assign({}, action.payload),
                };
            }
            newState = {
                ...state,
                userProfileMemberGroupData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_ADMIN_GROUP':
            if (!_isEmpty(state.userProfileAdminGroupData)) {
                action.payload.data = [...state.userProfileAdminGroupData.data, ...action.payload.data];
                return newState = {
                    ...state,
                    userProfileAdminGroupData: Object.assign({}, action.payload),
                };
            }
            newState = {
                ...state,
                userProfileAdminGroupData: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_FAVOURITES':
            if (!_isEmpty(state.userProfileFavouritesData)) {
                action.payload.data = [...state.userProfileFavouritesData.data, ...action.payload.data];
                return newState = {
                    ...state,
                    userProfileFavouritesData: Object.assign({}, action.payload),
                };
            }
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
            const friendIndex = _findIndex(state.userFindFriendsList.data, (data) => data.attributes.user_id === action.payload.userId);
            const friendsArray = state.userFindFriendsList.data;
            friendsArray[friendIndex].attributes.friend_status = action.payload.status;
            newState = {
                ...state,
                userFindFriendsList: {
                    ...state.userFindFriendsList,
                    data: friendsArray,
                },
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
        case 'USER_PROFILE_MEMBER_GROUP_SEE_MORE_LOADER':
            newState = {
                ...state,
                userProfileMemberGroupsSeeMoreLoader: action.payload.userProfileMemberGroupsSeeMoreLoader,
            };
            break;
        case 'USER_PROFILE_USER_ADMIN_GROUP_SEE_MORE_LOADER':
            newState = {
                ...state,
                userProfileUserAdminGroupSeeMoreLoader: action.payload.userProfileUserAdminGroupSeeMoreLoader,
            };
            break;
        case 'USER_PROFILE_USER_FAVOURITES_SEE_MORE_LOADER':
            newState = {
                ...state,
                userProfileUserFavouritesSeeMoreLoader: action.payload.userProfileUserFavouritesSeeMoreLoader,
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
        case 'USER_INFO_TO_SHARE_OPTIONS':
            newState = {
                ...state,
                infoShareOptions: action.payload.infoShareOptions,
            };
            break;
        case 'USER_INFO_TO_SHARE_OPTIONS_LOADER':
            newState = {
                ...state,
                infoShareDropDownLoader: action.payload.infoShareDropDownLoader,
            };
            break;
        case 'DELETE_CREDIT_CARD_MSG_POPUP_LOADER':
            newState = {
                ...state,
                deleteMsgPopUpLoader: action.payload.deleteMsgPopUpLoader,
            };
            break;
        case 'USER_CREDIT_CARD_ACTIVE_MONTHLY_DONATIONS':
            newState = {
                ...state,
                activeMonthlyDonations: action.payload.activeMonthlyDonations,
            };
            break;
        case 'USER_PROFILE_PREVIEW_MODE':
            newState = {
                ...state,
                previewMode: action.payload.previewMode,
            };
            break;
        case 'USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH':
            newState = {
                ...state,
                friendTypeAheadData: action.payload.data,
            };
            break;
        case 'USER_PROFILE_RESET_DATA':
            newState = {
                ...state,
                userFriendProfileData: Object.assign({}, action.payload),
                userFriendsInvitationsList: Object.assign({}, action.payload),
                userMyFriendsList: Object.assign({}, action.payload),
                userProfileAdminGroupData: Object.assign({}, action.payload),
                userProfileCausesData: Object.assign({}, action.payload),
                userProfileProfilelink: Object.assign({}, action.payload),
            };
            break;
        case 'USER_PROFILE_FIND_DROPDOWN_FRIENDS':
            const selectedFriendIndex = _findIndex(state.userFindFriendsList.data, (data) => data.attributes.user_id === action.payload.userId);
            const selectedFriendsArray = state.userFindFriendsList.data;
            selectedFriendsArray[selectedFriendIndex].attributes.friend_status = action.payload.status;
            newState = {
                ...state,
                userFindFriendsList: {
                    ...state.userFindFriendsList,
                    data: selectedFriendsArray,
                },
            };
            break;
        case 'USER_CHARITY_INFO_TO_SHARE_OPTIONS':
            newState = {
                ...state,
                charityShareInfoOptions: action.payload.charityShareInfoOptions,
            };
            break;
        case 'USER_GROUP_CAMPAIGN_ADMIN_INFO_TO_SHARE_OPTIONS':
            newState = {
                ...state,
                infoOptions: {
                    groupCampaignAdminShareInfoOptions: action.payload.infoOptions.groupCampaignAdminShareInfoOptions,
                    ...(action.payload.infoOptions.groupMemberInfoToShare && { groupMemberInfoToShare: action.payload.infoOptions.groupMemberInfoToShare }),
                },
            };
            break;
        default:
            break;
    }
    return newState;
};

export default userProfile;
