import _isEmpty from 'lodash/isEmpty';

import searchApi from '../services/searchApi';
import graphApi from '../services/graphApi';
import {
    triggerUxCritialErrors,
} from './error';
export const actionTypes = {
    GET_API_DATA_FECHED_FLAG: 'GET_API_DATA_FECHED_FLAG',
    GET_DEFAULT_CHARITIES: 'GET_DEFAULT_CHARITIES',
    GET_DEFAULT_CHARITIES_GROUPS: 'GET_DEFAULT_CHARITIES_GROUPS',
    GET_DEFAULT_GROUPS: 'GET_DEFAULT_GROUPS',
    GET_TEXT_SEARCHED_CHARITIES: 'GET_TEXT_SEARCHED_CHARITIES',
    GET_TEXT_SEARCHED_CHARITIES_GROUPS: 'GET_TEXT_SEARCHED_CHARITIES_GROUPS',
    GET_TEXT_SEARCHED_GROUPS: 'GET_TEXT_SEARCHED_GROUPS',
};
export const fetchInitialCharitiesGroups = (isAuthenticated, userId) => (dispatch) => {
    const fsa = {
        payload: {
            charityFlag: null,
            defaultAllCharities: null,
            defaultAllGroups: null,
            groupFlag: null,
            pageCount: null,
        },
        type: actionTypes.GET_DEFAULT_CHARITIES_GROUPS,
    };
    if (isAuthenticated) {
        dispatch({
            payload: {
                charityFlag: false,
                groupFlag: false,
            },
            type: 'GET_API_DATA_FECHED_FLAG',
        });
        let charityData = null;
        let groupData = null;

        charityData = graphApi.get(`/recommend/charity?userid=${userId}&page[number]=1&page[size]=4`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            });
        groupData = graphApi.get(`/recommend/group?userid=${userId}&page[number]=1&page[size]=4`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            });
        const charitygroupData = Promise.all([
            charityData,
            groupData,
        ]);
        charitygroupData.then((result) => {
            fsa.payload.charityFlag = true;
            fsa.payload.groupFlag = true;
            fsa.payload.defaultAllCharities = result[0];
            fsa.payload.defaultAllGroups = result[1];
        }).catch((err) => {
            fsa.payload.charityFlag = true;
            fsa.payload.groupFlag = true;
            // console.log(err);
        }).finally(() => {
            return dispatch(fsa);
        });
    } else {
        dispatch({
            payload: {
                groupFlag: true,
            },
            type: 'GET_API_DATA_FECHED_FLAG',
        });
    }
};
export const fetchInitialCharities = (pageNumber, isAuthenticated, userId) => (dispatch) => {
    const fsa = {
        payload: {
            charityFlag: null,
            defaultAllCharities: null,
            pageCount: null,
        },
        type: actionTypes.GET_DEFAULT_CHARITIES,
    };
    if (isAuthenticated) {
        dispatch({
            payload: {
                charityFlag: false,
            },
            type: 'GET_API_DATA_FECHED_FLAG',
        });
        let charityData = null;

        charityData = graphApi.get(`/recommend/charity?userid=${userId}&page[number]=${pageNumber}&page[size]=10`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            });
        charityData.then((result) => {
            fsa.payload.defaultAllCharities = result;
            fsa.payload.pageCount = result.meta.pageCount;
            fsa.payload.charityFlag = true;
        }).catch((err) => {
            // console.log(err);
            fsa.payload.charityFlag = true;
        }).finally(() => {
            return dispatch(fsa);
        });
    } else {
        dispatch({
            payload: {
                charityFlag: true,
            },
            type: 'GET_API_DATA_FECHED_FLAG',
        });
    }
};
export const fetchInitialGroups = (pageNumber, isAuthenticated, userId) => (dispatch) => {
    const fsa = {
        payload: {
            defaultAllGroups: null,
        },
        type: actionTypes.GET_DEFAULT_GROUPS,
    };
    if (isAuthenticated) {
        dispatch({
            payload: {
                groupFlag: false,
            },
            type: 'GET_API_DATA_FECHED_FLAG',
        });
        let groupData = null;

        groupData = graphApi.get(`/recommend/group?userid=${userId}&page[number]=${pageNumber}&page[size]=10`,
            {
                params: {
                    dispatch,
                    uxCritical: true,
                },
            });
        groupData.then((result) => {
            fsa.payload.defaultAllGroups = result;
            fsa.payload.pageCount = result.meta.pageCount;
            fsa.payload.groupFlag = true;
        }).catch((err) => {
            fsa.payload.groupFlag = true;
            // console.log(err);
        }).finally(() => {
            return dispatch(fsa);
        });
    } else {
        dispatch({
            payload: {
                groupFlag: true,
            },
            type: 'GET_API_DATA_FECHED_FLAG',
        });
    }
};

export const fetchTextSearchCharitiesGroups = (searchWord, pageNumber, filterData, id) => (dispatch) => {
    const fsa = {
        payload: {
            charityFlag: null,
            TextSearchedCharitiesGroups: null,
        },
        type: actionTypes.GET_TEXT_SEARCHED_CHARITIES_GROUPS,
    };
    dispatch({
        payload: {
            charityFlag: false,
        },
        type: 'GET_API_DATA_FECHED_FLAG',
    });
   
    let textSearchUrl = `/public/charities-groups?page[number]=${pageNumber}&page[size]=10`;
    if (!_isEmpty(id)) {
        textSearchUrl = `/charities-groups?user_id=${id}&page[size]=10&page[number]=${pageNumber}`;
    }
    let textSearchCharitiesGroups = null;
    if (!_isEmpty(filterData)) {
        textSearchCharitiesGroups = searchApi.post(textSearchUrl, {
            text: searchWord,
            filter: filterData,
        });
    } else {
        textSearchCharitiesGroups = searchApi.post(textSearchUrl, {
            text: searchWord,
        });
    }
    textSearchCharitiesGroups.then((result) => {
        fsa.payload.TextSearchedCharitiesGroups = result;
        fsa.payload.pageCount = result.meta.pageCount;
        fsa.payload.charityFlag = true;
    }).catch((err) => {
        fsa.payload.charityFlag = true;
        triggerUxCritialErrors(err.errors || err, dispatch);
    }).finally(() => {
        return dispatch(fsa);
    });
};

export const fetchTextSearchCharities = (searchWord, pageNumber, filterData, id) => (dispatch) => {
    const fsa = {
        payload: {
            TextSearchedCharities: null,
        },
        type: actionTypes.GET_TEXT_SEARCHED_CHARITIES,
    };
    dispatch({
        payload: {
            charityFlag: false,
        },
        type: 'GET_API_DATA_FECHED_FLAG',
    });
    let textSearchUrl = `/public/charities?page[size]=10&page[number]=${pageNumber}`;
    if (!_isEmpty(id)) {
        textSearchUrl = `/charities?user_id=${id}&page[size]=10&page[number]=${pageNumber}`;
    }
    let textSearchCharities = null;
    if (!_isEmpty(filterData)) {
        textSearchCharities = searchApi.post(textSearchUrl, {
            filter: filterData,
            text: searchWord,
        });
    } else {
        textSearchCharities = searchApi.post(textSearchUrl, {
            text: searchWord,
        });
    }
    textSearchCharities.then((result) => {
        fsa.payload.charityFlag = true;
        fsa.payload.TextSearchedCharities = result;
        fsa.payload.pageCount = result.meta.pageCount;
    }).catch((err) => {
        fsa.payload.charityFlag = true;
        triggerUxCritialErrors(err.errors || err, dispatch);
    }).finally(() => {
        return dispatch(fsa);
    });
};

export const fetchTextSearchGroups = (searchWord, pageNumber, filterData, id) => (dispatch) => {
    const fsa = {
        payload: {
            TextSearchedCharities: null,
        },
        type: actionTypes.GET_TEXT_SEARCHED_GROUPS,
    };
    dispatch({
        payload: {
            groupFlag: false,
        },
        type: 'GET_API_DATA_FECHED_FLAG',
    });
    let textSearchUrl = `/public/groups?page[size]=10&page[number]=${pageNumber}`;
    if (!_isEmpty(id)) {
        textSearchUrl = `/groups?user_id=${id}&page[size]=10&page[number]=${pageNumber}`;
    }
    let textSearchGroups = null;
    if (!_isEmpty(filterData)) {
        textSearchGroups = searchApi.post(textSearchUrl, {
            filter: filterData,
            text: searchWord,
        });
    } else {
        textSearchGroups = searchApi.post(textSearchUrl, {
            text: searchWord,
        });
    }
    textSearchGroups.then((result) => {
        fsa.payload.groupFlag = true;
        fsa.payload.TextSearchedGroups = result;
        fsa.payload.pageCount = result.meta.pageCount;
    }).catch((err) => {
        fsa.payload.groupFlag = true;
        triggerUxCritialErrors(err.errors || err, dispatch);
    }).finally(() => {
        return dispatch(fsa);
    });
};
