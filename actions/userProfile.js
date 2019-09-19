import _ from 'lodash';

import graphApi from '../services/graphApi';
import searchApi from '../services/searchApi';
import securityApi from '../services/securityApi';
import coreApi from '../services/coreApi';
import eventApi from '../services/eventApi';

import {
    createToken,
} from './give';
import {
    getUser,
    savePaymentInstrument,
} from './user';
import {
    logout,
} from './auth';

// eslint-disable-next-line import/exports-last
export const actionTypes = {
    ADD_NEW_CREDIT_CARD_STATUS: 'ADD_NEW_CREDIT_CARD_STATUS',
    ADD_USER_CREDIT_CARD: 'ADD_USER_CREDIT_CARD',
    DELETE_USER_CREDIT_CARD: 'DELETE_USER_CREDIT_CARD',
    UPDATE_USER_BASIC_PROFILE: 'UPDATE_USER_BASIC_PROFILE',
    UPDATE_USER_CHARITY_CAUSES: 'UPDATE_USER_CHARITY_CAUSES',
    UPDATE_USER_CHARITY_TAGS: 'UPDATE_USER_CHARITY_TAGS',
    UPDATE_USER_CREDIT_CARD: 'UPDATE_USER_CREDIT_CARD',
    UPDATE_USER_DEFAULT_CARD: 'UPDATE_USER_DEFAULT_CARD',
    UPDATE_USER_PASSWORD: 'UPDATE_USER_PASSWORD',
    UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
    UPDATE_USER_PRIVACY_SETTING: 'UPDATE_USER_PRIVACY_SETTING',
    USER_PROFILE_ADMIN_GROUP: 'USER_PROFILE_ADMIN_GROUP',
    USER_PROFILE_BASIC: 'USER_PROFILE_BASIC',
    USER_PROFILE_BASIC_FRIEND: 'USER_PROFILE_BASIC_FRIEND',
    USER_PROFILE_BLOCKED_FRIENDS: 'USER_PROFILE_BLOCKED_FRIENDS',
    USER_PROFILE_CAUSES: 'USER_PROFILE_CAUSES',
    USER_PROFILE_CHARITABLE_INTERESTS: 'USER_PROFILE_CHARITABLE_INTERESTS',
    USER_PROFILE_CREDIT_CARDS: 'USER_PROFILE_CREDIT_CARDS',
    USER_PROFILE_FAVOURITES: 'USER_PROFILE_FAVOURITES',
    USER_PROFILE_FIND_FRIENDS: 'USER_PROFILE_FIND_FRIENDS',
    USER_PROFILE_FIND_TAGS: 'USER_PROFILE_FIND_TAGS',
    USER_PROFILE_FOLLOWED_TAGS: 'USER_PROFILE_FOLLOWED_TAGS',
    USER_PROFILE_FRIEND_ACCEPT: 'USER_PROFILE_FRIEND_ACCEPT',
    USER_PROFILE_FRIEND_REQUEST: 'USER_PROFILE_FRIEND_REQUEST',
    USER_PROFILE_INVITATIONS: 'USER_PROFILE_INVITATIONS',
    USER_PROFILE_MEMBER_GROUP: 'USER_PROFILE_MEMBER_GROUP',
    USER_PROFILE_MY_FRIENDS: 'USER_PROFILE_MY_FRIENDS',
    USER_PROFILE_RECOMMENDED_TAGS: 'USER_PROFILE_RECOMMENDED_TAGS',
    USER_PROFILE_UNBLOCK_FRIEND: 'USER_PROFILE_UNBLOCK_FRIEND',
};

const getUserProfileBasic = (dispatch, email, userId, loggedInUserId) => {
    const fsa = {
        payload: {
            email,
        },
        type: actionTypes.USER_PROFILE_BASIC,
    };
    graphApi.get(`/recommendation/withProfileType/user?emailid=${email}&targetId=${Number(loggedInUserId)}&sourceId=${Number(userId)}&limit=&sort=`).then(
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

const getUserFriendProfile = (dispatch, email, userId, loggedInUserId) => {
    const fsa = {
        payload: {
            email,
        },
        type: actionTypes.USER_PROFILE_BASIC_FRIEND,
    };
    graphApi.get(`/recommendation/withProfileType/user?emailid=${email}&targetId=${Number(userId)}&sourceId=${Number(loggedInUserId)}&limit=&sort=`).then(
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

const getUserCharitableInterests = (dispatch, userId) => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_CHARITABLE_INTERESTS,
    };
    graphApi.get(`/get/user/causetags?userid=${Number(userId)}`).then(
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

const getUserMemberGroup = (dispatch, userId) => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_MEMBER_GROUP,
    };
    graphApi.get(`/user/groupbyrelationship?type=member&userid=${Number(userId)}&limit=9`).then(
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

const getUserAdminGroup = (dispatch, userId) => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_ADMIN_GROUP,
    };
    graphApi.get(`/user/groupbyrelationship?type=admin&userid=${Number(userId)}&limit=9`).then(
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

const getUserFavourites = (dispatch, userId) => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_PROFILE_FAVOURITES,
    };
    graphApi.get(`/user/favourites?userid=${Number(userId)}`).then(
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
    return graphApi.get(`/get/tags/user?id=${Number(userId)}&page[number]=1&page[size]=10&sort=asc`).then(
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
    return graphApi.get(`/get/tags/recommended?id=${Number(userId)}&page[number]=${pageNumber}&page[size]=10&sort=asc`).then(
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

const getMyFriendsList = (dispatch, email, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_MY_FRIENDS,
    };
    return graphApi.get(`/user/myfriends?userid=${email}&page[number]=${pageNumber}&page[size]=10&status=accepted`).then(
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

const getFriendsInvitations = (dispatch, email, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_INVITATIONS,
    };
    return graphApi.get(`/user/myfriends?userid=${email}&page[number]=${pageNumber}&page[size]=10&status=pending&direction=in`).then(
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

const getBlockedFriends = (dispatch, userId) => {
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

const getFriendsByText = (dispatch, userId, searchText, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FIND_FRIENDS,
    };
    const bodyData = {
        text: searchText,
    };
    return searchApi.post(`/users?page[number]=${pageNumber}&page[size]=10&user_id=${Number(userId)}`, bodyData).then(
        (result) => {
            fsa.payload = {
                count: result.meta.record_count,
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const getTagsByText = (dispatch, userId, searchText) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FIND_TAGS,
    };
    return graphApi.get(`/recommend/searchtags?userid=${Number(userId)}&text=${searchText}&skip=&limit=10&sort=asc`).then(
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

const getMyCreditCards = (dispatch, userId, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_CREDIT_CARDS,
    };
    return coreApi.get(`/users/${Number(userId)}/activePaymentInstruments?page[number]=${pageNumber}&page[size]=10`).then(
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

const saveUserBasicProfile = (dispatch, userData, userId, email) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_BASIC_PROFILE,
    };
    const bodyData = {
        data: {
            description: userData.about,
            first_name: userData.firstName,
            giving_goal_amt: userData.givingGoal,
            last_name: userData.lastName,
            location: userData.location,
        },
        filters: {
            user_id: Number(userId),
        },
    };
    return graphApi.patch(`/core/update/user/property`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getUserProfileBasic(dispatch, email, userId, userId);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const sendFriendRequest = (dispatch, sourceUserId, destinationEmailId, searchWord, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_REQUEST,
    };
    sourceUserId = Number(sourceUserId);
    const bodyData = {
        data: {
            attributes: {
                category: 'social',
                eventName: 'friendRequest',
                payload: {
                    deepLink: 'https://testLink.com',
                    destinationEmailId,
                    message: 'Friend Request',
                    sourceUserId,
                },
                source: 'socialapi',
                subCategory: 'friend',
            },
            type: 'event',
        },
    };
    return eventApi.post(`/event`, bodyData).then(
        (result) => {
            console.log(result);
            fsa.payload = {
                data: result.data,
            };
            getFriendsByText(dispatch, sourceUserId, searchWord, pageNumber);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const acceptFriendRequest = (dispatch, sourceUserId, destinationEmailId, pageNumber, sourceEmailId, pageName, searchWord) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_ACCEPT,
    };
    const bodyData = {
        data: {
            attributes: {
                category: 'social',
                eventName: 'friendAccept',
                payload: {
                    deepLink: 'https://testLink.com',
                    destinationEmailId,
                    linkedEventId: '1563362089449:venkata-Latitude-5580:12091:jy75dh74:10000',
                    message: 'Hi, I would like to add you to my friend list',
                    sourceUserId: Number(sourceUserId),
                },
                source: 'socialapi',
                subCategory: 'friend',
            },
            type: 'event',
        },
    };
    return eventApi.post(`/event`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            if (pageName === 'MYFRIENDS') {
                getFriendsInvitations(dispatch, sourceEmailId, pageNumber);
                getMyFriendsList(dispatch, sourceEmailId, 1);
            } else {
                getFriendsByText(dispatch, sourceUserId, searchWord, pageNumber);
            }
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
    blockUsers.push(destinationUserId);
    const bodyData = {
        source_user_id: Number(sourceUserId),
        unblock_user_ids: blockUsers,
    };
    return graphApi.post(`/core/unblockUser`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getBlockedFriends(dispatch, sourceUserId);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
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
    return graphApi.patch(`/user/updatecauses`, bodyDataCauses).then(
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
    return graphApi.patch(`/user/updatetags`, bodyDataTags).then(
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
};

const editUserCreditCard = (dispatch, instrumentDetails) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_CREDIT_CARD,
    };
    const bodyData = {
        data: {
            attributes: {
                expMonth: instrumentDetails.editMonth,
                expYear: instrumentDetails.editYear,
            },
            id: instrumentDetails.editPaymetInstrumentId,
            type: 'paymentInstruments',
        },
    };
    return coreApi.patch(`/paymentInstruments/${Number(instrumentDetails.editPaymetInstrumentId)}`, bodyData).then(
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

const deleteUserCreditCard = (dispatch, paymentInstrumentId, userId, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.DELETE_USER_CREDIT_CARD,
    };
    return coreApi.delete(`/paymentInstruments/${Number(paymentInstrumentId)}`).then(
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
        type: actionTypes.ADD_NEW_CREDIT_CARD_STATUS,
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
    return savePaymentInstrument(paymentInstrumentsData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            if (isDefaultCard) {
                setUserDefaultCard(dispatch, Number(result.data.id), userId, activePage);
            } else {
                getMyCreditCards(dispatch, userId, activePage);
            }
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch({
            payload: {
                newCreditCardApiCall: false,
            },
            type: actionTypes.ADD_NEW_CREDIT_CARD_STATUS,
        });
        dispatch(fsa);
    });
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
    let isPasswordChanged = true;
    return securityApi.post('/user/changepassword', bodyData).then(
        (result) => {
            fsa.payload = {
                data: result,
            };
        },
    ).catch((error) => {
        isPasswordChanged = false;
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
        if (isPasswordChanged) {
            logout();
        }
    });
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
            getUserProfileBasic(dispatch, email, userId, userId);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const updateUserPreferences = (dispatch, userId, preferenceColumn, preferenceValue) => {
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
            console.log(result);
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

export {
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
    unblockFriend,
    editUserCreditCard,
    deleteUserCreditCard,
    saveNewCreditCard,
    setUserDefaultCard,
    userResetPassword,
    savePrivacySetting,
    updateUserPreferences,
};
