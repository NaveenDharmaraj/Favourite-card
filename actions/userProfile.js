import _ from 'lodash';

import graphApi from '../services/graphApi';
import searchApi from '../services/searchApi';
import securityApi from '../services/securityApi';
import coreApi from '../services/coreApi';
import eventApi from '../services/eventApi';
import utilityApi from '../services/utilityApi';

import {
    createToken,
} from './give';
import {
    getUser,
    savePaymentInstrument,
} from './user';
import {
    triggerUxCritialErrors,
} from './error';

// eslint-disable-next-line import/exports-last
export const actionTypes = {
    
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
    USER_PROFILE_ADD_FRIEND: 'USER_PROFILE_ADD_FRIEND',
    USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS: 'USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS',
    USER_PROFILE_ACCEPT_FRIEND: 'USER_PROFILE_ACCEPT_FRIEND',
    USER_PROFILE_ADMIN_GROUP: 'USER_PROFILE_ADMIN_GROUP',
    USER_PROFILE_BASIC: 'USER_PROFILE_BASIC',
    USER_PROFILE_BASIC_FRIEND: 'USER_PROFILE_BASIC_FRIEND',
    USER_PROFILE_BLOCK_USER: 'USER_PROFILE_BLOCK_USER',
    USER_PROFILE_BLOCKED_FRIENDS: 'USER_PROFILE_BLOCKED_FRIENDS',
    USER_PROFILE_CAUSES: 'USER_PROFILE_CAUSES',
    USER_PROFILE_CHARITABLE_INTERESTS: 'USER_PROFILE_CHARITABLE_INTERESTS',
    USER_PROFILE_CREDIT_CARDS: 'USER_PROFILE_CREDIT_CARDS',
    USER_PROFILE_DEFAULT_TAX_RECEIPT: 'USER_PROFILE_DEFAULT_TAX_RECEIPT',
    USER_PROFILE_FAVOURITES: 'USER_PROFILE_FAVOURITES',
    USER_PROFILE_FIND_FRIENDS: 'USER_PROFILE_FIND_FRIENDS',
    USER_PROFILE_FIND_TAGS: 'USER_PROFILE_FIND_TAGS',
    USER_PROFILE_FOLLOWED_TAGS: 'USER_PROFILE_FOLLOWED_TAGS',
    USER_PROFILE_FRIEND_ACCEPT: 'USER_PROFILE_FRIEND_ACCEPT',
    USER_PROFILE_FRIEND_REQUEST: 'USER_PROFILE_FRIEND_REQUEST',
    USER_PROFILE_INVITATIONS: 'USER_PROFILE_INVITATIONS',
    USER_PROFILE_INVITE_FRIENDS: 'USER_PROFILE_INVITE_FRIENDS',
    USER_PROFILE_MEMBER_GROUP: 'USER_PROFILE_MEMBER_GROUP',
    USER_PROFILE_MY_FRIENDS: 'USER_PROFILE_MY_FRIENDS',
    USER_PROFILE_RECOMMENDED_TAGS: 'USER_PROFILE_RECOMMENDED_TAGS',
    USER_PROFILE_REMOVE_FRIEND: 'USER_PROFILE_REMOVE_FRIEND',
    USER_PROFILE_REMOVE_PHOTO: 'USER_PROFILE_REMOVE_PHOTO',
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
    return coreApi.get(`/users/${Number(userId)}/activePaymentInstruments?page[number]=${pageNumber}&page[size]=10&sort=-default`).then(
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
    const givingAmount = Number(userData.givingGoal) === 0 ? null : Number(userData.givingGoal);
    const bodyData = {
        description: userData.about,
        family_name: userData.lastName,
        given_name: userData.firstName,
        giving_goal_amt: givingAmount,
        user_id: Number(userId),
    };
    if (userData.displayName !== '') {
        bodyData.display_name = userData.displayName;
    }
    return securityApi.patch(`/update/user`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getUserProfileBasic(dispatch, email, userId, userId);
            getUser(dispatch, userId, null);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const sendFriendRequest = (dispatch, sourceUserId, sourceEmail, avatar, firstName, userData, searchWord, pageNumber) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_REQUEST,
    };
    const bodyData = {
        data: {
            attributes: {
                recipient_email_id: Buffer.from(userData.attributes.email_hash, 'base64').toString('ascii'),
                recipient_user_id: Number(userData.attributes.user_id),
                requester_avatar_link: avatar,
                requester_email_id: sourceEmail,
                requester_first_name: firstName,
                requester_user_id: Number(sourceUserId),
                source: 'web',
            },
        },
    };
    return eventApi.post(`/friend/request`, bodyData).then(
        (result) => {
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

const acceptFriendRequest = (dispatch, sourceUserId, sourceEmailId, sourceAvatar, sourceFirstName, destinationEmailId, destinationUserId, pageNumber, pageName, searchWord) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_ACCEPT,
    };
    const bodyData = {
        data: {
            attributes: {
                acceptor_avatar_link: sourceAvatar,
                acceptor_email_id: sourceEmailId,
                acceptor_first_name: sourceFirstName,
                acceptor_user_id: Number(sourceUserId),
                requester_email_id: Buffer.from(destinationEmailId, 'base64').toString('ascii'),
                requester_user_id: Number(destinationUserId),
                source: 'web',
            },
        },
    };
    return eventApi.post(`/friend/accept`, bodyData).then(
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
            getUserFriendProfile(dispatch, sourceEmailId, destinationUserId, sourceUserId);
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
            type: actionTypes.USER_PROFILE_ADD_NEW_CREDIT_CARD_STATUS,
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
    return securityApi.post('/user/changepassword', bodyData).then(
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
    return eventApi.post(`/friend/request`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getUserFriendProfile(dispatch, sourceEmail, destinationUserId, sourceUserId);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
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
    return eventApi.post(`/friend/accept`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            getUserFriendProfile(dispatch, sourceEmail, destinationUserId, sourceUserId);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
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
    return coreApi.post(`/users/friend_mail_notifications`, bodyData).then(
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

const generateDeeplinkSignup = (dispatch, profileType) => {
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
            getUserFriendProfile(dispatch, sourceEmail, destinationUserId, sourceUserId);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const generateDeeplinkUserProfile = (dispatch, sourceUserId, destinationUserId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_USERPROFILE_DEEPLINK,
    };
    return utilityApi.get(`/deeplink?profileType=userprofile&sourceId=${Number(sourceUserId)}&profileId=${Number(destinationUserId)}&webLink=true`).then(
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
    return coreApi.delete(`/users/${Number(sourceUserId)}/deleteLogo`).then(
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
};
