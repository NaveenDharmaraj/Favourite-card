import _isEmpty from 'lodash/isEmpty';

import graphApi from '../services/graphApi';
import searchApi from '../services/searchApi';
import securityApi from '../services/securityApi';
import coreApi from '../services/coreApi';
import eventApi from '../services/eventApi';
import utilityApi from '../services/utilityApi';
import { Router } from '../routes';

import {
    createToken,
} from './give';
import {
    getUser,
    savePaymentInstrument,
    updateInfoShareUserPreferences,
} from './user';
import {
    triggerUxCritialErrors,
} from './error';

// eslint-disable-next-line import/exports-last
export const actionTypes = {

    ADD_USER_CREDIT_CARD: 'ADD_USER_CREDIT_CARD',
    DELETE_CREDIT_CARD_MSG_POPUP_LOADER: 'DELETE_CREDIT_CARD_MSG_POPUP_LOADER',
    DELETE_USER_CREDIT_CARD: 'DELETE_USER_CREDIT_CARD',
    TRIGGER_UX_CRITICAL_ERROR: 'TRIGGER_UX_CRITICAL_ERROR',
    UPDATE_USER_BASIC_PROFILE: 'UPDATE_USER_BASIC_PROFILE',
    UPDATE_USER_CHARITY_CAUSES: 'UPDATE_USER_CHARITY_CAUSES',
    UPDATE_USER_CHARITY_TAGS: 'UPDATE_USER_CHARITY_TAGS',
    UPDATE_USER_CREDIT_CARD: 'UPDATE_USER_CREDIT_CARD',
    UPDATE_USER_DEFAULT_CARD: 'UPDATE_USER_DEFAULT_CARD',
    UPDATE_USER_PASSWORD: 'UPDATE_USER_PASSWORD',
    UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
    UPDATE_USER_PRIVACY_SETTING: 'UPDATE_USER_PRIVACY_SETTING',
    USER_CHARITY_INFO_TO_SHARE_OPTIONS: 'USER_CHARITY_INFO_TO_SHARE_OPTIONS',
    USER_CREDIT_CARD_ACTIVE_MONTHLY_DONATIONS: 'USER_CREDIT_CARD_ACTIVE_MONTHLY_DONATIONS',
    USER_GROUP_CAMPAIGN_ADMIN_INFO_TO_SHARE_OPTIONS: 'USER_GROUP_CAMPAIGN_ADMIN_INFO_TO_SHARE_OPTIONS',
    USER_INFO_TO_SHARE_OPTIONS: 'USER_INFO_TO_SHARE_OPTIONS',
    USER_INFO_TO_SHARE_OPTIONS_LOADER: 'USER_INFO_TO_SHARE_OPTIONS_LOADER',
    USER_PROFILE_ACCEPT_FRIEND: 'USER_PROFILE_ACCEPT_FRIEND',
    USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR: 'USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR',
    USER_PROFILE_ADD_FRIEND: 'USER_PROFILE_ADD_FRIEND',
    USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS: 'USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS',
    USER_PROFILE_ADMIN_GROUP: 'USER_PROFILE_ADMIN_GROUP',
    USER_PROFILE_ADMIN_GROUP_LOAD_STATUS: 'USER_PROFILE_ADMIN_GROUP_LOAD_STATUS',
    USER_PROFILE_ADMIN_GROUP_CLEAR_DATA: 'USER_PROFILE_ADMIN_GROUP_CLEAR_DATA',
    USER_PROFILE_BASIC: 'USER_PROFILE_BASIC',
    USER_PROFILE_BASIC_FRIEND: 'USER_PROFILE_BASIC_FRIEND',
    USER_PROFILE_BLOCK_USER: 'USER_PROFILE_BLOCK_USER',
    USER_PROFILE_BLOCKED_FRIENDS: 'USER_PROFILE_BLOCKED_FRIENDS',
    USER_PROFILE_CAUSES: 'USER_PROFILE_CAUSES',
    USER_PROFILE_CHARITABLE_INTERESTS: 'USER_PROFILE_CHARITABLE_INTERESTS',
    USER_PROFILE_CHARITABLE_INTERESTS_LOAD_STATUS: 'USER_PROFILE_CHARITABLE_INTERESTS_LOAD_STATUS',
    USER_PROFILE_CREDIT_CARDS: 'USER_PROFILE_CREDIT_CARDS',
    USER_PROFILE_DEFAULT_TAX_RECEIPT: 'USER_PROFILE_DEFAULT_TAX_RECEIPT',
    USER_PROFILE_FAVOURITES: 'USER_PROFILE_FAVOURITES',
    USER_PROFILE_FAVOURITES_LOAD_STATUS: 'USER_PROFILE_FAVOURITES_LOAD_STATUS',
    USER_PROFILE_FAVOURITES_CLEAR_DATA: 'USER_PROFILE_FAVOURITES_CLEAR_DATA',
    USER_PROFILE_FIND_DROPDOWN_FRIENDS: 'USER_PROFILE_FIND_DROPDOWN_FRIENDS',
    USER_PROFILE_FIND_FRIENDS: 'USER_PROFILE_FIND_FRIENDS',
    USER_PROFILE_FIND_FRIENDS_LOADER: 'USER_PROFILE_FIND_FRIENDS_LOADER',
    USER_PROFILE_FIND_TAGS: 'USER_PROFILE_FIND_TAGS',
    USER_PROFILE_FOLLOWED_TAGS: 'USER_PROFILE_FOLLOWED_TAGS',
    USER_PROFILE_FRIEND_ACCEPT: 'USER_PROFILE_FRIEND_ACCEPT',
    USER_PROFILE_FRIEND_REQUEST: 'USER_PROFILE_FRIEND_REQUEST',
    USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH: 'USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH',
    USER_PROFILE_GET_EMAIL_LIST: 'USER_PROFILE_GET_EMAIL_LIST',
    USER_PROFILE_MEMBER_GROUP_SEE_MORE_LOADER: 'USER_PROFILE_MEMBER_GROUP_SEE_MORE_LOADER',
    USER_PROFILE_USER_FAVOURITES_SEE_MORE_LOADER: 'USER_PROFILE_USER_FAVOURITES_SEE_MORE_LOADER',
    USER_PROFILE_USER_ADMIN_GROUP_SEE_MORE_LOADER: 'USER_PROFILE_USER_ADMIN_GROUP_SEE_MORE_LOADER',
    USER_PROFILE_INVITATIONS: 'USER_PROFILE_INVITATIONS',
    USER_PROFILE_INVITE_FRIENDS: 'USER_PROFILE_INVITE_FRIENDS',
    USER_PROFILE_LOCATION_SEARCH: 'USER_PROFILE_LOCATION_SEARCH',
    USER_PROFILE_LOCATION_SEARCH_LOADER: 'USER_PROFILE_LOCATION_SEARCH_LOADER',
    USER_PROFILE_MEMBER_GROUP: 'USER_PROFILE_MEMBER_GROUP',
    USER_PROFILE_MEMBER_GROUP_CLEAR_DATA: 'USER_PROFILE_MEMBER_GROUP_CLEAR_DATA',
    USER_PROFILE_MEMBER_GROUP_LOAD_STATUS: 'USER_PROFILE_MEMBER_GROUP_LOAD_STATUS',
    USER_PROFILE_MY_FRIENDS: 'USER_PROFILE_MY_FRIENDS',
    USER_PROFILE_MY_FRIENDS_Loader: 'USER_PROFILE_MY_FRIENDS_LOADER',
    USER_PROFILE_RECOMMENDED_TAGS: 'USER_PROFILE_RECOMMENDED_TAGS',
    USER_PROFILE_REMOVE_FRIEND: 'USER_PROFILE_REMOVE_FRIEND',
    USER_PROFILE_REMOVE_PHOTO: 'USER_PROFILE_REMOVE_PHOTO',
    USER_PROFILE_SHOW_ADD_BUTTON_LOADER: 'USER_PROFILE_SHOW_ADD_BUTTON_LOADER',
    USER_PROFILE_SHOW_EMAIL_LOADER: 'USER_PROFILE_SHOW_EMAIL_LOADER',
    USER_PROFILE_SIGNUP_DEEPLINK: 'USER_PROFILE_SIGNUP_DEEPLINK',
    USER_PROFILE_TAX_RECEIPTS: 'USER_PROFILE_TAX_RECEIPTS',
    USER_PROFILE_UNBLOCK_FRIEND: 'USER_PROFILE_UNBLOCK_FRIEND',
    USER_PROFILE_UPLOAD_IMAGE: 'USER_PROFILE_UPLOAD_IMAGE',
    USER_PROFILE_USERPROFILE_DEEPLINK: 'USER_PROFILE_USERPROFILE_DEEPLINK',
};

const getUserProfileBasic = (dispatch, email, userId, loggedInUserId) => {
    const fsa = {
        payload: {
            email,
        },
        type: actionTypes.USER_PROFILE_BASIC,
    };
    graphApi.get(`/recommendation/withProfileType/user`, {
        params: {
            emailid: email,
            sourceId: Number(userId),
            targetId: Number(loggedInUserId),
        },
    }).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getUserFriendProfile = (email, userId, loggedInUserId) => dispatch => {
    const fsa = {
        payload: {
            data: [],
        },
        type: actionTypes.USER_PROFILE_BASIC_FRIEND,
    };
    graphApi.get(`/recommendation/withProfileType/user`, {
        params: {
            dispatch,
            emailid: email,
            sourceId: Number(loggedInUserId),
            targetId: Number(userId),
            uxCritical: true,
        },
    }).then(
        (result) => {
            if (result && !_isEmpty(result.data)) {
                fsa.payload.data = result.data[0];
                dispatch(fsa);
            }
        },
    ).catch((error) => {
        Router.back();
        fsa.error = error;
    }).finally();
};

const getUserCharitableInterests = (userId) => dispatch => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_CHARITABLE_INTERESTS,
    };
    dispatch({
        payload: {
            userProfileCharitableInterestsLoadStatus: true,
        },
        type: actionTypes.USER_PROFILE_CHARITABLE_INTERESTS_LOAD_STATUS,
    });
    const params = {
        userid: `${Number(userId)}`,
    };
    graphApi.get(`/get/user/causetags`, { params }).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch({
            payload: {
                userProfileCharitableInterestsLoadStatus: false,
            },
            type: actionTypes.USER_PROFILE_CHARITABLE_INTERESTS_LOAD_STATUS,
        });
        dispatch(fsa);
    });
};

const getUserMemberGroup = (userId, sourceUserId, pageNumber = 1, seeMoreLoader = false) => (dispatch) => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_MEMBER_GROUP,
    };
    if (seeMoreLoader) {
        dispatch({
            payload: {
                userProfileMemberGroupsSeeMoreLoader: true,
            },
            type: actionTypes.USER_PROFILE_MEMBER_GROUP_SEE_MORE_LOADER,
        });
    } else {
        dispatch({
            payload: {
                userProfileMemberGroupsLoadStatus: true,
            },
            type: actionTypes.USER_PROFILE_MEMBER_GROUP_LOAD_STATUS,
        });
    }
    const params = {
        'friend_id': `${Number(userId)}`,
        'fields[groups]': 'name,city,province,slug,avatar,groupType,totalMoneyRaised',
        'page[number]': Number(pageNumber),
        'page[size]': 10,
    }
    const userMemberGroupPromise = coreApi.get(`/users/${Number(sourceUserId)}/friendGroups`, { params });
    userMemberGroupPromise.then(
        (result) => {
            fsa.payload = {
                data: result.data,
                totalMemberGroupRecordCount: result.meta.recordCount,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        if (seeMoreLoader) {
            dispatch({
                payload: {
                    userProfileMemberGroupsSeeMoreLoader: false,
                },
                type: actionTypes.USER_PROFILE_MEMBER_GROUP_SEE_MORE_LOADER,
            });
        } else {
            dispatch({
                payload: {
                    userProfileMemberGroupsLoadStatus: false,
                },
                type: actionTypes.USER_PROFILE_MEMBER_GROUP_LOAD_STATUS,
            });
        }
        dispatch(fsa);
    });
    return userMemberGroupPromise;
};

const getUserAdminGroup = (userId, sourceUserId, pageNumber = 1, seeMoreLoader = false) => dispatch => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_ADMIN_GROUP,
    };
    if (seeMoreLoader) {
        dispatch({
            payload: {
                userProfileUserAdminGroupSeeMoreLoader: true,
            },
            type: actionTypes.USER_PROFILE_USER_ADMIN_GROUP_SEE_MORE_LOADER,
        });
    } else {
        dispatch({
            payload: {
                userProfileAdminGroupsLoadStatus: true,
            },
            type: actionTypes.USER_PROFILE_ADMIN_GROUP_LOAD_STATUS,
        });
    }
    const params = {
        'friend_id': `${Number(userId)}`,
        'fields[groups]': 'name,city,province,slug,avatar,groupType,totalMoneyRaised',
        'page[number]': pageNumber,
        'page[size]': 10
    };
    const userAdminGroupPromise = coreApi.get(`users/${Number(sourceUserId)}/friendAdministeredGroups`, { params });
    userAdminGroupPromise.then(
        (result) => {
            fsa.payload = {
                data: result.data,
                totalUserAdminGroupRecordCount: result.meta.recordCount,
                seeMoreLoader,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        if (seeMoreLoader) {
            dispatch({
                payload: {
                    userProfileUserAdminGroupSeeMoreLoader: false,
                },
                type: actionTypes.USER_PROFILE_USER_ADMIN_GROUP_SEE_MORE_LOADER,
            });
        } else {
            dispatch({
                payload: {
                    userProfileAdminGroupsLoadStatus: false,
                },
                type: actionTypes.USER_PROFILE_ADMIN_GROUP_LOAD_STATUS,
            });
        }
        dispatch(fsa);
    });
    return userAdminGroupPromise;
};

const getUserFavourites = (userId, pageNumber = 1, seeMoreLoader = false) => dispatch => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_FAVOURITES,
    };
    if (seeMoreLoader) {
        dispatch({
            payload: {
                userProfileUserFavouritesSeeMoreLoader: true,
            },
            type: actionTypes.USER_PROFILE_USER_FAVOURITES_SEE_MORE_LOADER,
        });
    } else {
        dispatch({
            payload: {
                userProfileFavouritesLoadStatus: true,
            },
            type: actionTypes.USER_PROFILE_FAVOURITES_LOAD_STATUS,
        });
    }
    const params = {
        'userid': `${Number(userId)}`,
        'page[number]': Number(pageNumber),
        'page[size]': 10,

    }
    const userFavouritePromise = graphApi.get(`/user/favourites`, { params });
    userFavouritePromise.then(
        (result) => {
            fsa.payload = {
                data: result.data,
                totalUserFavouritesRecordCount: result.meta.recordCount,
                totalUserFavouritesPageCount: result.meta.pageCount,
                seeMoreLoader,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        if (seeMoreLoader) {
            dispatch({
                payload: {
                    userProfileUserFavouritesSeeMoreLoader: false,
                },
                type: actionTypes.USER_PROFILE_USER_FAVOURITES_SEE_MORE_LOADER,
            });
        } else {
            dispatch({
                payload: {
                    userProfileFavouritesLoadStatus: false,
                },
                type: actionTypes.USER_PROFILE_FAVOURITES_LOAD_STATUS,
            });
        }
        dispatch(fsa);
    });
    return userFavouritePromise;
};

const getUserProfileCauses = (dispatch, userId) => {
    const fsa = {
        payload: {
            userCausesList: null,
        },
        type: actionTypes.USER_PROFILE_CAUSES,
    };
    return graphApi.get(`/user/causes?userid=${Number(userId)}`).then((result) => {
        fsa.payload.userCausesList = result.data;
    }).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getUserTagsFollowed = (dispatch, userId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FOLLOWED_TAGS,
    };
    return graphApi.get(`/get/tags/user?id=${Number(userId)}&page[number]=1&page[size]=15&sort=asc`).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getUserTagsRecommended = (dispatch, userId, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_RECOMMENDED_TAGS,
    };
    return graphApi.get(`/get/tags/recommended?id=${Number(userId)}&page[number]=${pageNumber}&page[size]=15&sort=asc`).then(
        (result) => {
            fsa.payload = {
                count: result.meta.recordCount,
                data: result.data,
                pageCount: result.meta.pageCount,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getMyFriendsList = (email, pageNumber, userId = null) => (dispatch) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_MY_FRIENDS,
    };
    const paramsList = {
        params: {
            'page[number]': pageNumber,
            'page[size]': 10,
            status: 'accepted',
            userid: email,
        },
    };
    if (userId) {
        paramsList.params.parentId = userId;
    }
    dispatch({
        type: 'USER_PROFILE_MY_FRIENDS_LOADER',
        payload: true
    })
    return graphApi.get(`/user/myfriends`, {
        ...paramsList,
    }).then(
        (result) => {
            fsa.payload = {
                count: result.meta.recordCount,
                data: result.data,
                pageCount: result.meta.pageCount,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
        dispatch({
            type: 'USER_PROFILE_MY_FRIENDS_LOADER',
            payload: false
        })
    });
};

const getFriendsInvitations = (email, pageNumber) => (dispatch) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_INVITATIONS,
    };
    return graphApi.get(`/user/myfriends`, {
        params: {
            direction: 'in',
            'page[number]': pageNumber,
            'page[size]': 10,
            state: '',
            status: 'pending',
            userid: email,
        },
    }).then(
        (result) => {
            fsa.payload = {
                count: result.meta.recordCount,
                data: result.data,
                pageCount: result.meta.pageCount,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getBlockedFriends = (userId) => (dispatch) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_BLOCKED_FRIENDS,
    };
    return graphApi.get(`/core/blockedUser/list?source_user_id=${userId}`).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getFriendsByText = (userId, searchText, pageNumber) => (dispatch) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FIND_FRIENDS,
    };
    const bodyData = {
        // sort: {
        //     field: 'first_name',
        //     order: 'asc',
        // },
        text: searchText,
    };
    dispatch({
        type: actionTypes.USER_PROFILE_FIND_FRIENDS_LOADER,
        payload: {
            userProfileFindFriendsLoader: true,
        }
    });
    return searchApi.post(`/users?page[number]=${pageNumber}&page[size]=10&user_id=${Number(userId)}`, bodyData).then(
        (result) => {
            fsa.payload = {
                count: result.meta.record_count,
                data: result.data,
                pageCount: result.meta.pageCount,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
        dispatch({
            type: actionTypes.USER_PROFILE_FIND_FRIENDS_LOADER,
            payload: {
                userProfileFindFriendsLoader: false,
            }
        });
    });
};

const getTagsByText = (dispatch, userId, searchText, isSearch, pageNumber = 1, loadedData = 0) => {
    const bodyData = {
        text: searchText,
    };
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FIND_TAGS,
    };
    return searchApi.post(`/tags?page[number]=${pageNumber}&page[size]=24`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
                isSearch,
                loadedData: loadedData + result.data.length,
                pageNumber: pageNumber + 1,
                recordCount: result.meta.record_count,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getMyCreditCards = (dispatch, userId, pageNumber, updatedCurrentActivePage = 0) => {
    const fsa = {
        payload: {
            updatedCurrentActivePage,
        },
        type: actionTypes.USER_PROFILE_CREDIT_CARDS,
    };
    return coreApi.get(`/users/${Number(userId)}/activePaymentInstruments?page[number]=${pageNumber}&page[size]=10&sort=-default`).then(
        (result) => {
            if (_.isEmpty(result.data) && pageNumber > 1) {
                getMyCreditCards(dispatch, userId, pageNumber - 1, pageNumber - 1);
                return;
            }
            if (updatedCurrentActivePage > 0) {
                fsa.payload.updatedCurrentActivePage = updatedCurrentActivePage;
            }
            fsa.payload = {
                count: result.meta.recordCount,
                data: result.data,
                pageCount: result.meta.pageCount,
                ...fsa.payload,
            };
            dispatch(fsa);
        },
    ).catch((error) => {
        fsa.error = error;
        dispatch(fsa);
    });
};

const saveUserBasicProfile = (userData, userId, email, isMyprofile = false) => dispatch => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_BASIC_PROFILE,
    };
    const givingAmount = Number(userData.givingGoal) === 0 ? null : Number(userData.givingGoal);
    const bodyData = {
        city: userData.city,
        description: userData.about,
        family_name: userData.lastName,
        gender: userData.gender,
        given_name: userData.firstName,
        giving_goal_amt: givingAmount,
        province: userData.province,
        user_id: Number(userId),
    };
    if (userData.displayName !== '') {
        bodyData.display_name = userData.displayName;
    }
    const basicResponse = securityApi.patch(`/update/user`, bodyData);
    basicResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            if (isMyprofile) {
                dispatch(getUserFriendProfile(email, userId, userId));
            } else {
                getUserProfileBasic(dispatch, email, userId, userId);
            }
            getUser(dispatch, userId, null);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
    return basicResponse;
};

function searchFriendsObj(friendList, toSearch) {
    for (let i = 0; i < friendList.data.length; i++) {
        if (friendList.data[i].attributes.user_id === toSearch) {
            friendList.data[i].attributes.friend_status = 'PENDING_OUT';
        }
    }
    return friendList;
}

const sendFriendRequest = (requestObj) => (dispatch) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_REQUEST,
    };

    const bodyData = {
        data: {
            attributes: {
                recipient_email_id: requestObj.recipientEmail,
                recipient_user_id: requestObj.recipientUserId,
                requester_avatar_link: requestObj.requesterAvatar,
                requester_display_name: requestObj.requesterDisplayName,
                requester_email_id: requestObj.requesterEmail,
                requester_first_name: requestObj.requesterFirstName,
                requester_user_id: requestObj.requesterUserId,
                source: 'web',
            },
        },
    };
    const sendFriendRequestResponse = eventApi.post(`/friend/request`, bodyData);
    sendFriendRequestResponse.then(
        (result) => {
            if (result && !_isEmpty(result.data)) {
                fsa.payload.userId = requestObj.recipientUserId;
                fsa.payload.status = 'PENDING_OUT';
                dispatch(fsa);
            }
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
    });
    return sendFriendRequestResponse;
};

const acceptFriendRequest = (dispatch, sourceUserId, sourceEmailId, sourceAvatar, sourceFirstName, sourceDisplayName, destinationEmailId, destinationUserId, pageNumber, pageName, searchWord) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_ACCEPT,
    };
    const bodyData = {
        data: {
            attributes: {
                acceptor_avatar_link: sourceAvatar,
                acceptor_display_name: sourceDisplayName,
                acceptor_email_id: sourceEmailId,
                acceptor_first_name: sourceFirstName,
                acceptor_user_id: Number(sourceUserId),
                requester_email_id: Buffer.from(destinationEmailId, 'base64').toString('ascii'),
                requester_user_id: Number(destinationUserId),
                source: 'web',
            },
        },
    };
    const acceptFriendRequestResponse = eventApi.post(`/friend/accept`, bodyData);
    acceptFriendRequestResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            if (pageName === 'MYFRIENDS') {
                dispatch(getFriendsInvitations(sourceEmailId, pageNumber));
                dispatch(getMyFriendsList(sourceEmailId, 1, sourceUserId));
            } else {
                dispatch(getFriendsByText(sourceUserId, searchWord, pageNumber));
            }
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
    return acceptFriendRequestResponse;
};

const blockUser = (dispatch, sourceUserId, sourceEmailId, destinationUserId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_BLOCK_USER,
    };
    const blockUsers = [];
    blockUsers.push(Number(destinationUserId));
    const bodyData = {
        block_user_ids: blockUsers,
        source_user_id: Number(sourceUserId),
    };
    return graphApi.post(`/core/blockUser`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            dispatch(getUserFriendProfile(sourceEmailId, destinationUserId, sourceUserId));
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const unblockFriend = (dispatch, sourceUserId, destinationUserId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_UNBLOCK_FRIEND,
    };
    const blockUsers = [];
    blockUsers.push(Number(destinationUserId));
    const bodyData = {
        source_user_id: Number(sourceUserId),
        unblock_user_ids: blockUsers,
    };
    const unblockFriendResponse = graphApi.post(`/core/unblockUser`, bodyData);
    unblockFriendResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            dispatch(getBlockedFriends(sourceUserId));
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
    return unblockFriendResponse;
};

const saveCharitableCauses = (dispatch, userId, userCauses) => {
    const fsaCauses = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_CHARITY_CAUSES,
    };
    const bodyDataCauses = {
        causes: userCauses,
        userid: Number(userId),
    };
    const causesResponse = graphApi.patch(`/user/updatecauses`, bodyDataCauses);
    causesResponse.then(
        (result) => {
            fsaCauses.payload = {
                data: result.data,
            };
            getUserProfileCauses(dispatch, userId);
        },
    ).catch((error) => {
        fsaCauses.error = error;
    }).finally(() => {
        dispatch(fsaCauses);
    });
    return causesResponse;
};

const saveCharitableTags = (dispatch, userId, userTags) => {
    const fsaTags = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_CHARITY_TAGS,
    };
    const bodyDataTags = {
        tags: userTags,
        userid: Number(userId),
    };
    const tagsResponse = graphApi.patch(`/user/updatetags`, bodyDataTags);
    tagsResponse.then(
        (result) => {
            fsaTags.payload = {
                data: result.data,
            };
            getUserTagsFollowed(dispatch, userId);
            getUserTagsRecommended(dispatch, userId, 1);
        },
    ).catch((error) => {
        fsaTags.error = error;
    }).finally(() => {
        dispatch(fsaTags);
    });
    return tagsResponse;
};

const editUserCreditCard = (dispatch, instrumentDetails) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_CREDIT_CARD,
    };
    const expiryDate = instrumentDetails.expiry.split('/');
    const bodyData = {
        data: {
            attributes: {
                expMonth: expiryDate[0],
                expYear: expiryDate[1],
            },
            id: instrumentDetails.editPaymetInstrumentId,
            type: 'paymentInstruments',
        },
    };
    const editCreditCardResponse = coreApi.patch(`/paymentInstruments/${Number(instrumentDetails.editPaymetInstrumentId)}`, bodyData);
    editCreditCardResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            const statusMessageProps = {
                message: 'Your Credit Card updated Successfully.',
                type: 'success',
            };
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: 'TRIGGER_UX_CRITICAL_ERROR',
            });
        },
    ).catch((error) => {
        fsa.error = error;
        triggerUxCritialErrors(error.errors || error, dispatch);
    }).finally(() => {
        dispatch(fsa);
    });
    return editCreditCardResponse;
};

const getPaymentInstrumentById = (paymentInstrumentId) => (dispatch) => {
    dispatch({
        payload: {
            deleteMsgPopUpLoader: true,
        },
        type: actionTypes.DELETE_CREDIT_CARD_MSG_POPUP_LOADER,
    });
    coreApi.get(`/paymentInstruments/${Number(paymentInstrumentId)}`)
        .then((response) => {
            dispatch({
                payload: {
                    deleteMsgPopUpLoader: false,
                },
                type: actionTypes.DELETE_CREDIT_CARD_MSG_POPUP_LOADER,
            });
            dispatch({
                payload: {
                    activeMonthlyDonations: response.data.attributes.activeMonthlyDonations,
                },
                type: actionTypes.USER_CREDIT_CARD_ACTIVE_MONTHLY_DONATIONS,
            });
        })
        .catch((err) => {
            dispatch({
                payload: {
                    deleteMsgPopUpLoader: false,
                },
                type: actionTypes.DELETE_CREDIT_CARD_MSG_POPUP_LOADER,
            });
        });
};

const deleteUserCreditCard = (dispatch, paymentInstrumentId, userId, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.DELETE_USER_CREDIT_CARD,
    };
    const deleteCreditCardResponse = coreApi.delete(`/paymentInstruments/${Number(paymentInstrumentId)}`);
    deleteCreditCardResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            const statusMessageProps = {
                message: 'Credit card deleted.',
                type: 'success',
            };
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: 'TRIGGER_UX_CRITICAL_ERROR',
            });
            getMyCreditCards(dispatch, userId, pageNumber);
        },
    ).catch((error) => {
        fsa.error = error;
        triggerUxCritialErrors(error.errors || error, dispatch);
    }).finally(() => {
        dispatch(fsa);
    });
    return deleteCreditCardResponse;
};

const setUserDefaultCard = (dispatch, paymentInstrumentId, userId, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_DEFAULT_CARD,
    };
    return coreApi.patch(`/paymentInstruments/${Number(paymentInstrumentId)}/set_as_default`).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getMyCreditCards(dispatch, userId, pageNumber);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const saveNewCreditCard = async (dispatch, stripeCreditCard, cardHolderName, userId, isDefaultCard, activePage) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.ADD_USER_CREDIT_CARD,
    };
    dispatch({
        payload: {
            newCreditCardApiCall: true,
        },
        type: actionTypes.USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS,
    });
    const token = await createToken(stripeCreditCard, cardHolderName);
    const paymentInstrumentsData = {
        attributes: {
            stripeToken: token.id,
        },
        relationships: {
            paymentable: {
                data: {
                    id: userId,
                    type: 'user',
                },
            },
        },
        type: 'paymentInstruments',
    };
    const creditCardResponse = savePaymentInstrument(paymentInstrumentsData);
    creditCardResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            if (isDefaultCard) {
                setUserDefaultCard(dispatch, Number(result.data.id), userId, activePage);
            } else {
                getMyCreditCards(dispatch, userId, activePage);
            }
            const statusMessageProps = {
                message: 'Credit card saved.',
                type: 'success',
            };
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: 'TRIGGER_UX_CRITICAL_ERROR',
            });
        },
    ).catch((error) => {
        fsa.error = error;
        triggerUxCritialErrors(error.errors || error, dispatch);
    }).finally(() => {
        dispatch({
            payload: {
                newCreditCardApiCall: false,
            },
            type: actionTypes.USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS,
        });
        dispatch(fsa);
    });
    return creditCardResponse;
};

const userResetPassword = (dispatch, userData) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_PASSWORD,
    };
    const bodyData = {
        auth_user_id: userData.authId,
        password: userData.password,
    };
    const resetPasswordResponse = securityApi.post('/user/changepassword', bodyData);
    resetPasswordResponse.then(
        (result) => {
            fsa.payload = {
                data: result,
            };
        },
    ).catch((error) => {
        fsa.error = error;
        triggerUxCritialErrors(error.errors || error, dispatch);
    }).finally(() => {
        dispatch(fsa);
    });
    return resetPasswordResponse;
};

const savePrivacySetting = (dispatch, userId, email, columnName, columnValue) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_PRIVACY_SETTING,
    };
    const dataName = {};
    dataName[columnName] = columnValue;
    const bodyData = {
        data: dataName,
        filters: {
            user_id: Number(userId),
        },
    };
    return graphApi.patch(`/core/update/user/property`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            dispatch(getUserFriendProfile(email, userId, userId));
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const updateUserPreferences = (dispatch, userId, preferenceColumn, preferenceValue, selectedTaxReceipt) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_PREFERENCES,
    };
    const dataName = {};
    if (preferenceColumn === 'charities_share_my_name') {
        dataName.charities_share_my_name_address = false;
        dataName.charities_share_my_name_email = false;
        dataName[preferenceColumn] = preferenceValue;
    } else if (preferenceColumn === 'charities_share_my_name_address') {
        dataName.charities_share_my_name = false;
        dataName.charities_share_my_name_email = false;
        dataName[preferenceColumn] = preferenceValue;
        dataName.address = Number(selectedTaxReceipt);
    } else if (preferenceColumn === 'charities_share_my_name_email') {
        dataName.charities_share_my_name_address = false;
        dataName.charities_share_my_name = false;
        dataName[preferenceColumn] = preferenceValue;
    } else if (preferenceColumn === 'charities_dont_share' && preferenceValue === false) {
        dataName.charities_share_my_name_address = false;
        dataName.charities_share_my_name = false;
        dataName.charities_share_my_name_email = false;
    } else if (preferenceColumn === 'charities_dont_share' && preferenceValue === true) {
        dataName.charities_share_my_name_address = false;
        dataName.charities_share_my_name = true;
        dataName.charities_share_my_name_email = false;
    } else {
        dataName[preferenceColumn] = preferenceValue;
    }
    const bodyData = {
        data: {
            attributes: {
                preferences: dataName,
            },
            id: userId,
            type: 'users',
        },
    };
    return coreApi.patch(`/users/${userId}`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getUser(dispatch, userId, null);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const updateInfoUserPreferences = (userId, preferences) => (dispatch) => {
    const bodyData = {
        data: {
            attributes: {
                preferences,
            },
            id: userId,
            type: 'users',
        },
        params: {
            dispatch,
            uxCritical: true,
        },
    };
    return coreApi.patch(`/users/${userId}`, bodyData).then(
        (result) => {
            dispatch(updateInfoShareUserPreferences(result.data))
        },
    ).catch((error) => {
        //fsa.error = error;
    });
};

const getUserDefaultTaxReceipt = (dispatch, userid) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_DEFAULT_TAX_RECEIPT,
    };
    return coreApi.get(`/users/${Number(userid)}/defaultTaxReceiptProfile`).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const addToFriend = (dispatch, sourceUserId, sourceEmail, sourceAvatar, sourceFirstName, destinationUserId, destinationEmailId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_ADD_FRIEND,
    };
    const bodyData = {
        data: {
            attributes: {
                recipient_email_id: destinationEmailId,
                recipient_user_id: Number(destinationUserId),
                requester_avatar_link: sourceAvatar,
                requester_email_id: sourceEmail,
                requester_first_name: sourceFirstName,
                requester_user_id: Number(sourceUserId),
                source: 'web',
            },
        },
    };
    const addToFriendResponse = eventApi.post(`/friend/request`, bodyData);
    addToFriendResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            dispatch(getUserFriendProfile(sourceEmail, destinationUserId, sourceUserId));
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
    return addToFriendResponse;
};

const acceptFriend = (dispatch, sourceUserId, sourceEmail, sourceAvatar, sourceFirstName, destinationUserId, destinationEmailId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_ACCEPT_FRIEND,
    };
    const bodyData = {
        data: {
            attributes: {
                requester_email_id: destinationEmailId,
                requester_user_id: Number(destinationUserId),
                acceptor_avatar_link: sourceAvatar,
                acceptor_email_id: sourceEmail,
                acceptor_first_name: sourceFirstName,
                acceptor_user_id: Number(sourceUserId),
                source: 'web',
            },
        },
    };
    const acceptFriendResponse = eventApi.post(`/friend/accept`, bodyData);
    acceptFriendResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            dispatch(getUserFriendProfile(sourceEmail, destinationUserId, sourceUserId));
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
    return acceptFriendResponse;
};

const inviteFriends = (dispatch, inviteEmailIds) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_INVITE_FRIENDS,
    };
    const bodyData = {
        data: {
            attributes: {
                email: inviteEmailIds,
                notification_type: 'inviteFriends',
            },
            type: 'users',
        },
    };
    const inviteFriendsResponse = coreApi.post(`/users/friend_mail_notifications`, bodyData, {
        params: {
            dispatch,
            uxCritical: true,
        },
    });
    inviteFriendsResponse.then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            const statusMessage = {
                message: 'Invitation sent',
                type: 'success',
            };
            dispatch(updateUserProfileToastMsg(statusMessage));
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
    return inviteFriendsResponse;
};

const generateDeeplinkSignup = (profileType) => dispatch => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_SIGNUP_DEEPLINK,
    };
    return utilityApi.get(`/deeplink?profileType=${profileType}&webLink=true`).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const uploadUserImage = (dispatch, sourceUserId, imageData) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_UPLOAD_IMAGE,
    };
    const bodyData = {
        data: {
            attributes: {
                logo: imageData,
            },
            id: sourceUserId,
            type: 'users',
        },
    };
    return coreApi.patch(`/users/${Number(sourceUserId)}`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getUser(dispatch, sourceUserId, null);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const removeFriend = (dispatch, sourceUserId, sourceEmail, destinationUserId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_REMOVE_FRIEND,
    };
    const bodyData = {
        data: {
            attributes: {
                recipient_user_id: Number(destinationUserId),
                requester_user_id: Number(sourceUserId),
                source: 'web',
            },
        },
    };
    return eventApi.post(`/friend/remove`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            dispatch(getUserFriendProfile(sourceEmail, destinationUserId, sourceUserId));
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const searchLocationByUserInput = (searchText) => (dispatch) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_LOCATION_SEARCH,
    };
    dispatch({
        payload: {
            locationLoader: true,
        },
        type: actionTypes.USER_PROFILE_LOCATION_SEARCH_LOADER,
    });
    const cityArr = [];
    const config = {
        params: {
            'page[number]': 1,
            'page[size]': 999,
            query: searchText,
        },
    };
    return searchApi.get('/autocomplete/uniquecities', config).then(
        (result) => {
            if (result.data && result.data.length >= 1) {
                const {
                    data,
                } = result;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].attributes && data[i].attributes.city) {
                        const dataObj = {
                            id: i,
                            text: `${data[i].attributes.city}${data[i].attributes.province_name ? ', ' : ''}${data[i].attributes.province_name}`,
                            value: `${data[i].attributes.city}${i}`,
                            city: `${data[i].attributes.city}`,
                            province: `${data[i].attributes.province_name}`,
                        };
                        cityArr.push(dataObj);
                    }
                }
            }
            fsa.payload = {
                data: cityArr,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch({
            payload: {
                locationLoader: false,
            },
            type: actionTypes.USER_PROFILE_LOCATION_SEARCH_LOADER,
        });
        dispatch(fsa);
    });
};

const generateDeeplinkUserProfile = (dispatch, sourceUserId, destinationUserId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_USERPROFILE_DEEPLINK,
    };
    return utilityApi.get(`/deeplink`, {
        params: {
            profileId: destinationUserId,
            profileType: 'userprofile',
            sourceId: sourceUserId,
            webLink: true,
        },
    }).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const removeProfilePhoto = (dispatch, sourceUserId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_REMOVE_PHOTO,
    };
    const removeProfilePhotoResponse = coreApi.delete(`/users/${Number(sourceUserId)}/deleteLogo`);
    removeProfilePhotoResponse.then(
        (result) => {
            fsa.payload = {
                data: result,
            };
            getUser(dispatch, sourceUserId, null);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
    return removeProfilePhotoResponse;
};

const getEmailList = (dispatch, userId) => {
    const fsa = {
        payload: {
            emailDetailList: [],
        },
        type: actionTypes.USER_PROFILE_GET_EMAIL_LIST,
    };
    coreApi.get(`users/${userId}/emailAddresses?sort=-isPrimary,-verified`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.emailDetailList = result.data;
            dispatch(fsa);
        }
    }).catch().finally();
};

const createUserEmailAddress = (dispatch, emailId, userId) => {
    const bodyData = {
        data: {
            attributes: {
                email: emailId,
            },
            type: 'emailAddresses',
        },
        params: {
            dispatch,
            uxCritical: true,
        },
    };
    const statusMessageProps = {
        message: 'Email address added',
        type: 'success',
    };
    dispatch({
        payload: {
            showAddButtonLoader: true,
        },
        type: actionTypes.USER_PROFILE_SHOW_ADD_BUTTON_LOADER,
    });
    dispatch({
        payload: {
            showEmailLoader: true,
        },
        type: actionTypes.USER_PROFILE_SHOW_EMAIL_LOADER,
    });
    coreApi.post(`emailAddresses`, bodyData).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            getEmailList(dispatch, userId);
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
            });
            dispatch({
                payload: {
                    showEmailError: false,
                },
                type: actionTypes.USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR,
            });
        }
    }).catch((error) => {
        if (error.errors[0]) {
            dispatch({
                payload: {
                    errorMessageTitle: error.errors[0].title,
                    showEmailError: true,
                },
                type: actionTypes.USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR,
            });
        }
    }).finally(() => {
        dispatch({
            payload: {
                showAddButtonLoader: false,
            },
            type: actionTypes.USER_PROFILE_SHOW_ADD_BUTTON_LOADER,
        });
        dispatch({
            payload: {
                showEmailLoader: false,
            },
            type: actionTypes.USER_PROFILE_SHOW_EMAIL_LOADER,
        });
    });
};

const deleteUserEmailAddress = (dispatch, userEmailId, userId) => {
    const statusMessageProps = {
        message: 'Email address removed',
        type: 'success',
    };
    dispatch({
        payload: {
            showEmailLoader: true,
        },
        type: actionTypes.USER_PROFILE_SHOW_EMAIL_LOADER,
    });
    coreApi.delete(`emailAddresses/${userEmailId}`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && (result.status === 200)) {
            getEmailList(dispatch, userId);
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
            });
        }
    }).catch().finally(() => {
        dispatch({
            payload: {
                showEmailLoader: false,
            },
            type: actionTypes.USER_PROFILE_SHOW_EMAIL_LOADER,
        });
    });
};

const setPrimaryUserEmailAddress = (dispatch, userEmailId, userId) => {
    coreApi.patch(`emailAddresses/${userEmailId}/setPrimaryEmail`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && (result.status === 200)) {
            Router.pushRoute('/users/logout');
        }
    }).catch().finally();
};

const resendUserVerifyEmail = (dispatch, userEmailId, userId) => {
    const statusMessageProps = {
        message: 'Verification email sent',
        type: 'success',
    };
    coreApi.get(`emailAddresses/${userEmailId}/resendVerify`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && (result.status === 200)) {
            getEmailList(dispatch, userId);
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
            });
        }
    }).catch().finally();
};

const ingnoreFriendRequest = (currentUserId, friendUserId, email, type = '', rejectType = 'ignore') => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.USER_PROFILE_FIND_DROPDOWN_FRIENDS,
    };
    const payloadObj = {
        fromChimpId: currentUserId,
        state: 'ignored',
        toChimpId: friendUserId,
    };
    let urlType = 'ignoreFriendRequest';
    if (rejectType !== 'ignore') {
        urlType = 'removeFriendRequest';
        payloadObj.state = undefined;
    }
    const ingnoreFriendRequestPromise = graphApi.post(`/users/${urlType}`, payloadObj, {
        params: {
            dispatch,
            ignore401: true,
        },
    });
    ingnoreFriendRequestPromise.then((result) => {
        if (type === 'invitation') {
            dispatch(getFriendsInvitations(email, 1));
            dispatch(getMyFriendsList(email, 1, currentUserId));
            // dispatch(getUserFriendProfile(email, friendUserId, currentUserId));
        } else if (type === 'friendSearch') {
            fsa.payload.userId = friendUserId;
            fsa.payload.status = '';
            dispatch(fsa);
        } else if (type === 'myProfile') {
            dispatch(getUserFriendProfile(email, friendUserId, currentUserId));
        }
    }).catch();
    return ingnoreFriendRequestPromise;
};

// const rejectFriendInvite = (currentUserId, friendUserId, email, type = '') => (dispatch) => {
//     const fsa = {
//         payload: {},
//         type: actionTypes.USER_PROFILE_FIND_DROPDOWN_FRIENDS,
//     };
//     const payloadObj = {
//         relationship: 'IS_CHIMP_FRIEND_OF',
//         source: {
//             entity: 'user',
//             filters: {
//                 user_id: Number(currentUserId),
//             },
//         },
//         target: {
//             entity: 'user',
//             filters: {
//                 user_id: Number(friendUserId),
//             },
//         },
//     };
//     const rejectFriendInvitePromise = graphApi.post(`/users/deleterelationship`, payloadObj, {
//         params: {
//             dispatch,
//             ignore401: true,
//         },
//     });
//     rejectFriendInvitePromise.then((result) => {
//         if (type === 'invitation') {
//             dispatch(getFriendsInvitations(email, 1));
//             dispatch(getMyFriendsList(email, 1, currentUserId));
//             //dispatch(getUserFriendProfile(email, friendUserId, currentUserId));
//         } else if (type === 'friendSearch') {
//             fsa.payload.userId = friendUserId;
//             fsa.payload.status = '';
//             dispatch(fsa);
//         } else if (type === 'myProfile') {
//             dispatch(getUserFriendProfile(email, friendUserId, currentUserId));
//         }
//     }).catch(err => {
//         // hanlde error message
//     });
//     return rejectFriendInvitePromise;
// };

const searchMyfriend = (userId, queryText) => (dispatch) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_MY_FRIENDS,
    }
    const payloadObj = {
        filter: [
            {
                field: 'friends_list.accepted',
                value: [
                    userId,
                ],
            },
        ],
        text: queryText,
    };
    const params = {
        'page[number]': 1,
        'page[size]': 10,
        'user_id': `${Number(userId)}`,
    };
    return searchApi.post(`/users`, payloadObj, { params }).then((result) => {
        fsa.payload = {
            count: result.meta.record_count,
            data: result.data,
            pageCount: result.meta.pageCount,
        };
        dispatch(fsa);
    }).catch(err => {
        // handle error message
    });
};

const searchFriendByUserInput = (searchText, UserId) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH,
    };

    return searchApi.get('/autocomplete/users', {
        params: {
            dispatch,
            'page[size]': 8,
            query: searchText,
            user_id: UserId,
            uxCritical: true,
        },
    }).then((result) => {
        if (result) {
            fsa.payload.data = result.data;
            dispatch(fsa);
        }
    }).finally();
};

const getCharityInfoToShare = (userId) => async (dispatch) => {
    const fsa = {
        payload: {
            charityShareInfoOptions: [],
        },
        type: actionTypes.USER_CHARITY_INFO_TO_SHARE_OPTIONS,
    };
    try {
        const charityShare = await coreApi.get(`users/${userId}/charityShare`, {
            params: {
                dispatch,
                uxCritical: true,
            },
        });
        fsa.payload.charityShareInfoOptions = charityShare.data;
    } catch (err) { }
    dispatch(fsa);
};

const getGroupCampaignAdminInfoToShare = (userId, isCampaign) => async (dispatch) => {
    const fsa = {
        payload: {
            infoOptions: {
                groupCampaignAdminShareInfoOptions: [],
                groupMemberInfoToShare: [],
            },
        },
        type: actionTypes.USER_GROUP_CAMPAIGN_ADMIN_INFO_TO_SHARE_OPTIONS,
    };
    if (isCampaign) {
        try {
            const campaignAdminShare = await coreApi.get(`users/${userId}/campaignAdminShare`, {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            });
            fsa.payload.infoOptions.groupCampaignAdminShareInfoOptions = campaignAdminShare.data;
            dispatch(fsa);
        } catch (err) { }
    } else {
        try {
            const groupAdminShare = await coreApi.get(`users/${userId}/groupAdminShare`, {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            });
            const groupMemberShare = await coreApi.get(`users/${userId}/groupMemberShare`, {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            });
            fsa.payload.infoOptions.groupCampaignAdminShareInfoOptions = groupAdminShare.data;
            fsa.payload.infoOptions.groupMemberInfoToShare = groupMemberShare.data;
            dispatch(fsa);
        } catch (err) { }
    }
};

const getInfoToShareDropdownOptions = (userId, infoShareDropDownLoader = false) => async (dispatch) => {
    const fsa = {
        payload: {
            infoShareOptions: {
                campaignAdminShareInfoOptions: [],
                charityShareInfoOptions: [],
                groupAdminShareInfoOptions: [],
                groupMemberShareInfoOptions: [],
            },
        },
        type: actionTypes.USER_INFO_TO_SHARE_OPTIONS,
    };
    dispatch({
        payload: {
            infoShareDropDownLoader,
        },
        type: actionTypes.USER_INFO_TO_SHARE_OPTIONS_LOADER,
    });
    try {
        const charityShare = await coreApi.get(`users/${userId}/charityShare`, {
            params: {
                dispatch,
                uxCritical: true,
            },
        });
        fsa.payload.infoShareOptions.charityShareInfoOptions = charityShare.data;
    } catch (err) { }
    try {
        const groupMemberShare = await coreApi.get(`users/${userId}/groupMemberShare`, {
            params: {
                dispatch,
                uxCritical: true,
            },
        });
        fsa.payload.infoShareOptions.groupMemberShareInfoOptions = groupMemberShare.data;
    } catch (err) { }
    try {
        const groupAdminShare = await coreApi.get(`users/${userId}/groupAdminShare`, {
            params: {
                dispatch,
                uxCritical: true,
            },
        });
        fsa.payload.infoShareOptions.groupAdminShareInfoOptions = groupAdminShare.data;
    } catch (err) { }
    try {
        const campaignAdminShare = await coreApi.get(`users/${userId}/campaignAdminShare`, {
            params: {
                dispatch,
                uxCritical: true,
            },
        });
        fsa.payload.infoShareOptions.campaignAdminShareInfoOptions = campaignAdminShare.data;
    } catch (err) { }
    dispatch(fsa);
    dispatch({
        payload: {
            infoShareDropDownLoader: false,
        },
        type: actionTypes.USER_INFO_TO_SHARE_OPTIONS_LOADER,
    });
};

const updateUserProfileToastMsg = (statusMessageProps = {}) => dispatch => {
    dispatch({
        payload: {
            errors: [
                statusMessageProps,
            ],
        },
        type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
    });
}

const clearFindFriendsList = () => dispatch => {
    dispatch({
        payload: {},
        type: actionTypes.USER_PROFILE_FIND_FRIENDS,
    })
};

export {
    clearFindFriendsList,
    getCharityInfoToShare,
    getGroupCampaignAdminInfoToShare,
    getInfoToShareDropdownOptions,
    getPaymentInstrumentById,
    getUserProfileBasic,
    getUserFriendProfile,
    getUserCharitableInterests,
    getUserMemberGroup,
    getUserAdminGroup,
    getUserFavourites,
    getUserProfileCauses,
    getUserTagsRecommended,
    getUserTagsFollowed,
    getMyFriendsList,
    getFriendsByText,
    getFriendsInvitations,
    getBlockedFriends,
    getMyCreditCards,
    getTagsByText,
    saveUserBasicProfile,
    saveCharitableCauses,
    saveCharitableTags,
    sendFriendRequest,
    acceptFriendRequest,
    blockUser,
    unblockFriend,
    editUserCreditCard,
    deleteUserCreditCard,
    saveNewCreditCard,
    setUserDefaultCard,
    userResetPassword,
    savePrivacySetting,
    updateUserPreferences,
    getUserDefaultTaxReceipt,
    addToFriend,
    acceptFriend,
    inviteFriends,
    generateDeeplinkSignup,
    uploadUserImage,
    removeFriend,
    generateDeeplinkUserProfile,
    removeProfilePhoto,
    getEmailList,
    createUserEmailAddress,
    deleteUserEmailAddress,
    setPrimaryUserEmailAddress,
    resendUserVerifyEmail,
    searchLocationByUserInput,
    // rejectFriendInvite,
    searchMyfriend,
    searchFriendByUserInput,
    updateInfoUserPreferences,
    updateUserProfileToastMsg,
    ingnoreFriendRequest,
};
