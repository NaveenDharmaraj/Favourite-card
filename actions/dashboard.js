import _ from 'lodash';

import coreApi from '../services/coreApi';
import socialApi from '../services/socialApi';

export const actionTypes = {
    USER_DASHBOARD: 'USER_DASHBOARD',
    USER_FRIENDS: 'USER_FRIENDS',
    USER_RECOMMENDATIONS: 'USER_RECOMMENDATIONS',
    USER_STORIES: 'USER_STORIES',
    USER_FRIEND_EMAIL: 'USER_FRIEND_EMAIL',
};

const getPaginatedData = (url, type, dispatch) => {
    const fsa = {
        payload: {
            dataType: type,
        },
        type: actionTypes.USER_DASHBOARD,
    };

    coreApi.get(url).then(
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

const getDashBoardData = (dispatch, type, userId, pageNumber) => {
    const apiTypeUrl = {
        all: 'moneyTransfersAll',
        in: 'moneyTransfersIn',
        out: 'moneyTransfersOut',
    };
    const apiType = (_.isEmpty(type)) ? 'all' : type;
    getPaginatedData(`/users/${userId}/${apiTypeUrl[apiType]}?page[number]=${pageNumber}&page[size]=10`, apiType, dispatch);
};

const getFriendsList = (dispatch, email) => {
    const fsa = {
        payload: {
            email,
        },
        type: actionTypes.USER_FRIENDS,
    };

    socialApi.get(`/user/myfriends?userid=${email}&page[number]=1&page[size]=6`).then(
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

const getRecommendationList = (dispatch, userId) => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_RECOMMENDATIONS,
    };

    socialApi.get(`/recommend/all?userid=${Number(userId)}&page[number]=1&page[size]=3`).then(
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

const getStoriesList = (dispatch, userId) => {
    const fsa = {
        payload: {
            userId,
        },
        type: actionTypes.USER_STORIES,
    };
    socialApi.get(`/blogs/newBlogs?size=7`).then(
        (result) => {
            fsa.payload = {
                count: result.totalCount,
                data: result.results,
            };
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

const storeEmailIdToGive = (dispatch, email) => {
    const fsa = {
        payload: {
            email,
        },
        type: actionTypes.USER_FRIEND_EMAIL,
    };
    dispatch(fsa);
};

export {
    getDashBoardData,
    getPaginatedData,
    getFriendsList,
    getRecommendationList,
    getStoriesList,
    storeEmailIdToGive,
};
