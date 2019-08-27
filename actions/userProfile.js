import _ from 'lodash';

import graphApi from '../services/graphApi';
import searchApi from '../services/searchApi';
import coreApi from '../services/coreApi';
import eventApi from '../services/eventApi';

// eslint-disable-next-line import/exports-last
export const actionTypes = {
    UPDATE_USER_BASIC_PROFILE: 'UPDATE_USER_BASIC_PROFILE',
    UPDATE_USER_CHARITY_CAUSES: 'UPDATE_USER_CHARITY_CAUSES',
    UPDATE_USER_CHARITY_TAGS: 'UPDATE_USER_CHARITY_TAGS',
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
    USER_PROFILE_UNBLOCK_FRIEND: 'USER_PROFILE_UNBLOCK_FRIEND'
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
    return graphApi.get(`/user/myfriends?userid=${email}&page[number]=${pageNumber}&page[size]=2&status=accepted`).then(
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
        "text": searchText,
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
    return coreApi.get(`/users/${Number(userId)}/paymentInstruments?page[number]=${pageNumber}&page[size]=10`).then(
        (result) => {
            fsa.payload = {
                count: result.meta.pageCount,
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

const saveUserBasicProfile = (dispatch, userData, userId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_BASIC_PROFILE,
    };
    const bodyData = {
        "data": {
            "giving_goal_amt": userData.givingGoal,
            "description": userData.about,
            "first_name": userData.firstName,
            "last_name": userData.lastName,
            "location": userData.location,
        },
        "filters": {
            "user_id": Number(userId)
        }
    };
    console.log(bodyData);
    return graphApi.patch(`/core/update/user/property`, bodyData).then(
        (result) => {
            console.log(result);
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

const sendFriendRequest = (dispatch, sourceUserId, destinationEmailId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_REQUEST,
    };
    const emailHash = Buffer.from(destinationEmailId).toString('base64');
    const bodyData = {
            "data": {
            "type": "event",
            "attributes": {
                "source": "socialapi",
                "category": "social",
                "subCategory": "friend",
                "eventName": "friendRequest",
                "payload": {
                    "sourceUserId": sourceUserId,
                    "destinationEmailId": emailHash,
                    "message": "Friend Request",
                    "deepLink": "https://testLink.com"
                }
            }
        }
    }
    return eventApi.post(`/event`, bodyData).then(
        (result) => {
            console.log(result);
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

const acceptFriendRequest = (dispatch, sourceUserId, destinationEmailId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_FRIEND_ACCEPT,
    };
    const emailHash = Buffer.from(destinationEmailId).toString('base64');
    const bodyData = {
        "data": {
            "type": "event",
            "attributes": {
                "source": "socialapi",
                "category": "social",
                "subCategory": "friend",
                "eventName": "friendAccept",
                "payload": {
                    "sourceUserId": Number(sourceUserId),
                    "destinationEmailId": emailHash,
                    "message": "Hi, I would like to add you to my friend list",
                    "deepLink": "https://testLink.com",
                    "linkedEventId":"1563362089449:venkata-Latitude-5580:12091:jy75dh74:10000"
                }
            }
        }
    }
    return eventApi.post(`/event`, bodyData).then(
        (result) => {
            console.log(result);
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

const unblockFriend = (dispatch, sourceUserId, destinationUserId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_UNBLOCK_FRIEND,
    };
    const bodyData = {
        "source_user_id": Number(sourceUserId),
        "unblock_user_ids": `[${destinationUserId}]`
    };
    return graphApi.post(`/core/unblockUser`, bodyData).then(
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

const saveCharitableInterests = (dispatch, userId, userCauses, userTags) => {
    const fsaCauses = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_CHARITY_CAUSES,
    };
    const fsaTags = {
        payload: {
        },
        type: actionTypes.UPDATE_USER_CHARITY_TAGS,
    };
    const bodyDataCauses = {
        causes: userCauses,
        userid: Number(userId),
    };
    const bodyDataTags = {
        tags: userTags,
        userid: Number(userId),
    };
    graphApi.patch(`/user/updatecauses`, bodyDataCauses).then(
        (result) => {
            console.log(result);
            fsaCauses.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsaCauses.error = error;
    }).finally(() => {
        dispatch(fsaCauses);
    });
    graphApi.patch(`/user/updatetags`, bodyDataTags).then(
        (result) => {
            console.log(result);
            fsaTags.payload = {
                data: result.data,
            };
        },
    ).catch((error) => {
        fsaTags.error = error;
    }).finally(() => {
        dispatch(fsaTags);
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
    saveCharitableInterests,
    sendFriendRequest,
    acceptFriendRequest,
    unblockFriend,
};
