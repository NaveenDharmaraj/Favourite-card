import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';

import searchApi from '../services/searchApi';
import coreApi from '../services/coreApi';
import { dateFormatConverter, intializeCreateGivingGroup } from '../helpers/createGrouputils';

export const actionTypes = {
    GET_PROVINCE_LIST: 'GET_PROVINCE_LIST',
    GET_PROVINCES_LIST_LOADER: 'GET_PROVINCES_LIST_LOADER',
    GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER: 'GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER',
    GET_CHARITY_BASED_ON_SERACH_QUERY: 'GET_CHARITY_BASED_ON_SERACH_QUERY',
    GET_UNIQUE_CITIES: 'GET_UNIQUE_CITIES',
    GET_UNIQUE_CITIES_LOADER: 'GET_UNIQUE_CITIES_LOADER',
    UPDATE_CREATE_GIVING_GROUP_OBJECT: 'UPDATE_CREATE_GIVING_GROUP_OBJECT',
};

export const updateCreateGivingGroupObj = (createGivingGroupObject = {}) => dispatch =>
    dispatch({
        type: actionTypes.UPDATE_CREATE_GIVING_GROUP_OBJECT,
        payload: createGivingGroupObject,
    });

const getPaginatedCitiesCalls = (pageNumber = 1, pageSize = 50, value = '') => {
    const params = {
        'page[number]': pageNumber,
        'page[size]': pageSize,
    };
    const bodyData = {
        "text": "",
        "filter": [
            {
                "field": "province_name",
                "value": [value]
            }
        ]
    };
    return searchApi.post('/uniquecities', { ...bodyData }, { params });
}
export const getUniqueCities = (pageNumber = 1, pageSize = 50, value = '') => async (dispatch) => {
    dispatch({
        type: actionTypes.GET_UNIQUE_CITIES_LOADER,
        payload: true
    });
    const getUniqueCitiesPromise = getPaginatedCitiesCalls(pageNumber, pageSize, value, false)
    getUniqueCitiesPromise
        .then((data) => {
            dispatch({
                type: actionTypes.GET_UNIQUE_CITIES_LOADER,
                payload: false
            });
            const citiesOption = data.data.map(({ attributes }) => {
                return {
                    key: attributes.city + attributes.province_name,
                    text: attributes.city,
                    value: attributes.city,
                }
            });
            dispatch({
                type: actionTypes.GET_UNIQUE_CITIES,
                payload: citiesOption,
            });
            if (data.meta.pageCount > 1) {
                const citiesPromise = [];
                for (let i = 2; i <= data.meta.pageCount; i++) {
                    citiesPromise.push(getPaginatedCitiesCalls(i, 50, value, false));
                }
                Promise.all(citiesPromise).then((data) => {
                    const citiesOptionsPromisesData = [];
                    data.map(({ data }) => {
                        data.map(({ attributes }) => {
                            citiesOptionsPromisesData.push({
                                key: attributes.city + attributes.province_name,
                                text: attributes.city,
                                value: attributes.city,
                            });
                        })
                    });
                    dispatch({
                        type: actionTypes.GET_UNIQUE_CITIES,
                        payload: citiesOption.concat(citiesOptionsPromisesData),
                    });
                });
            }
        })
        .catch(() => {
            // handle error
            dispatch({
                type: actionTypes.GET_UNIQUE_CITIES_LOADER,
                payload: false
            });
        });
    return getUniqueCitiesPromise;
};

export const getCharityBasedOnSearchQuery = (query = '', pageNumber = '', pageSize = '') => dispatch => {
    dispatch({
        type: actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER,
        payload: true
    });
    const params = {
        query,
        'page[number]': pageNumber,
        'page[size]': pageSize,
    }
    const GetCharityBasedOnSearchQueryPromise = searchApi.get('/autocomplete/charities', { params });
    GetCharityBasedOnSearchQueryPromise.then(({ data }) => {
        dispatch({
            type: actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER,
            payload: false
        });
        const charityOptions = data.map(({ attributes }) => {
            return {
                avatar: attributes.avatar,
                key: attributes.name + attributes.charity_id,
                text: attributes.name,
                value: attributes.name,
                id: attributes.charity_id,
            }
        });
        dispatch({
            type: actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY,
            payload: charityOptions
        });
    })
        .catch(() => {
            dispatch({
                type: actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER,
                payload: false
            });
        });
    return GetCharityBasedOnSearchQueryPromise;
};

export const createGivingGroupApiCall = (createGivingGroupObj) => dispatch => {
    const cloneCreateGivingGroupObject = _cloneDeep(createGivingGroupObj);
    const {
        attributes: {
            fundraisingCreated,
            fundraisingDate
        },
        galleryImages,
        groupDescriptions,
    } = cloneCreateGivingGroupObject;
    if (fundraisingDate != '') {
        cloneCreateGivingGroupObject.attributes.fundraisingDate = dateFormatConverter(fundraisingDate, '/');
    };
    if (fundraisingCreated != '') {
        cloneCreateGivingGroupObject.attributes.fundraisingCreated = dateFormatConverter(fundraisingCreated, '/')
    };
    let newGroupDescriptions = [];
    if (!_isEmpty(groupDescriptions) && groupDescriptions.length > 0) {
        groupDescriptions.map(({ name, description }) => {
            newGroupDescriptions.push({ [name]: description })
        });
        cloneCreateGivingGroupObject.groupPurposeDescriptions = [...newGroupDescriptions];
    };
    let newGalleryImage = [];
    if (galleryImages && galleryImages.length > 0) {
        galleryImages.map((item) => {
            newGalleryImage.push(item.src)
        })
    };
    cloneCreateGivingGroupObject.galleryImages = [...newGalleryImage];
    delete cloneCreateGivingGroupObject.groupDescriptions;
    delete cloneCreateGivingGroupObject.beneficiaryItems;
    const bodyData = cloneCreateGivingGroupObject;
    return coreApi.post('/groups', { data: bodyData });
};

export const getProvincesList = (pageNumber = 1, pageSize = 50) => dispatch => {
    dispatch({
        type: actionTypes.GET_PROVINCES_LIST_LOADER,
        payload: true
    });
    const params = {
        'page[number]': pageNumber,
        'page[size]': pageSize,
    };
    const getProvincesListPromise = searchApi.post('/province', {
        'text': '',
    }, { params });
    getProvincesListPromise
        .then(({ data }) => {
            const provinceOption = data.map(({ attributes }) => {
                return {
                    key: attributes.province_name + attributes.province_code,
                    text: attributes.province_name,
                    value: attributes.province_code,
                }
            });
            dispatch({
                type: actionTypes.GET_PROVINCE_LIST,
                payload: provinceOption,
            });
            dispatch({
                type: actionTypes.GET_PROVINCES_LIST_LOADER,
                payload: false
            });
        })
        .catch(() => {
            // handle error
            dispatch({
                type: actionTypes.GET_PROVINCES_LIST_LOADER,
                payload: false
            });
        });
    return getProvincesListPromise;
};
