import _ from 'lodash';

import graphApi from '../services/graphApi';
import searchApi from '../services/searchApi';
import coreApi from '../services/coreApi';

// eslint-disable-next-line import/exports-last
export const actionTypes = {
    USER_PROFILE_ADMIN_GROUP: 'USER_PROFILE_ADMIN_GROUP',
    USER_PROFILE_BASIC: 'USER_PROFILE_BASIC',
    USER_PROFILE_BLOCKED_FRIENDS: 'USER_PROFILE_BLOCKED_FRIENDS',
    USER_PROFILE_CAUSES: 'USER_PROFILE_CAUSES',
    USER_PROFILE_CHARITABLE_INTERESTS: 'USER_PROFILE_CHARITABLE_INTERESTS',
    USER_PROFILE_CREDIT_CARDS: 'USER_PROFILE_CREDIT_CARDS',
    USER_PROFILE_FAVOURITES: 'USER_PROFILE_FAVOURITES',
    USER_PROFILE_FIND_FRIENDS: 'USER_PROFILE_FIND_FRIENDS',
    USER_PROFILE_FOLLOWED_TAGS: 'USER_PROFILE_FOLLOWED_TAGS',
    USER_PROFILE_INVITATIONS: 'USER_PROFILE_INVITATIONS',
    USER_PROFILE_MEMBER_GROUP: 'USER_PROFILE_MEMBER_GROUP',
    USER_PROFILE_MY_FRIENDS: 'USER_PROFILE_MY_FRIENDS',
    USER_PROFILE_RECOMMENDED_TAGS: 'USER_PROFILE_RECOMMENDED_TAGS',
};

const getUserProfileBasic = (dispatch, email, userId) => {
    const fsa = {
        payload: {
            email,
        },
        type: actionTypes.USER_PROFILE_BASIC,
    };
    graphApi.get(`/recommendation/user?emailid=${email}&targetId=0&sourceId=${Number(userId)}`).then(
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

const getUserTagsRecommended = (dispatch, url, userId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_RECOMMENDED_TAGS,
    };
    return graphApi.get(`/get/tags/recommended?id=${Number(userId)}&page[number]=1&page[size]=10&sort=asc`).then(
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

const getMyCreditCards = (dispatch, userId) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_PROFILE_CREDIT_CARDS,
    };
    return coreApi.get(`/users/${Number(userId)}/paymentInstruments?page[number]=1&page[size]=10`).then(
        (result) => {
            fsa.payload = {
                count: result.meta.pageCount,
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

export {
    getUserProfileBasic,
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
};
