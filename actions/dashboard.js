/* eslint-disable import/exports-last */
import _ from 'lodash';

import coreApi from '../services/coreApi';
import graphApi from '../services/graphApi';
import utilityApi from '../services/utilityApi';
import logger from '../helpers/logger';

export const actionTypes = {
    USER_DASHBOARD: 'USER_DASHBOARD',
    USER_FRIEND_EMAIL: 'USER_FRIEND_EMAIL',
    USER_FRIENDS: 'USER_FRIENDS',
    USER_HIDE_RECOMMENDATION: 'USER_HIDE_RECOMMENDATION',
    USER_RECOMMENDATIONS: 'USER_RECOMMENDATIONS',
    USER_STORIES: 'USER_STORIES',
};

const getPaginatedData = (url, type, dispatch) => {
    const fsa = {
        payload: {
            dataType: type,
        },
        type: actionTypes.USER_DASHBOARD,
    };

    coreApi.get(url, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(
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

    graphApi.get(`/user/myfriends?userid=${email}&page[number]=1&page[size]=6&status=accepted`, { params: {
        dispatch,
        uxCritical: true,
    } }).then(
        (result) => {
            fsa.payload = {
                count: result.meta.recordCount,
                data: result.data,
            };
        },
    ).catch((error) => {
        fsa.error = error;
        logger.error(' ->>>> getFriendsList API failed');
    }).finally(() => {
        logger.debug('[Debug] -> getFriendsList API finally block and dispatching');
        dispatch(fsa);
    });
};

const getRecommendationList = (dispatch, url) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_RECOMMENDATIONS,
    };

    graphApi.get(url, {
        params: {
            dispatch,
            uxCritical: true,
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
        logger.error('->>>> getRecommendationList API failed');
    }).finally(() => {
        logger.debug('[Debug] -> getRecommendationList API finally block and dispatching');
        dispatch(fsa);
    });
};

const getStoriesList = (dispatch, url) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_STORIES,
    };
    utilityApi.get(url, { params: {
        dispatch,
        uxCritical: true,
    } }).then(
        (result) => {
            fsa.payload = {
                count: result.totalCount,
                data: result.results,
            };
        },
    ).catch((error) => {
        fsa.error = error;
        logger.error(' ->>>> getStoriesList API failed');
    }).finally(() => {
        logger.debug('[Debug] -> getStoriesList API finally block and dispatching');
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

const hideRecommendations = (dispatch, sourceUserId, hideEntityId, type) => {
    const fsa = {
        payload: {
        },
        type: actionTypes.USER_HIDE_RECOMMENDATION,
    };
    const hideEntities = [];
    hideEntities.push(hideEntityId);
    const bodyData = {
        hide_entity_ids: hideEntities,
        user_id: Number(sourceUserId),
    };
    return graphApi.post(`/core/updateUser/hide/${type}`, bodyData).then(
        (result) => {
            fsa.payload = {
                data: result.data,
            };
            const url = `/recommend/all?userid=${Number(sourceUserId)}&page[number]=1&page[size]=9`;
            getRecommendationList(dispatch, url);
        },
    ).catch((error) => {
        fsa.error = error;
    }).finally(() => {
        dispatch(fsa);
    });
};

export {
    getDashBoardData,
    getPaginatedData,
    getFriendsList,
    getRecommendationList,
    getStoriesList,
    storeEmailIdToGive,
    hideRecommendations,
};
