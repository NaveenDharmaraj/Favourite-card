import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';

import searchApi from '../services/searchApi';
import coreApi from '../services/coreApi';
import { dateFormatConverter } from '../helpers/createGrouputils';

export const actionTypes = {
    GET_PROVINCE_LIST: 'GET_PROVINCE_LIST',
    GET_PROVINCES_LIST_LOADER: 'GET_PROVINCES_LIST_LOADER',
    GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER: 'GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER',
    GET_CHARITY_BASED_ON_SERACH_QUERY: 'GET_CHARITY_BASED_ON_SERACH_QUERY',
    GET_UNIQUE_CITIES: 'GET_UNIQUE_CITIES',
    GET_UNIQUE_CITIES_LOADER: 'GET_UNIQUE_CITIES_LOADER',
    UPDATE_CREATE_GIVING_GROUP_OBJECT: 'UPDATE_CREATE_GIVING_GROUP_OBJECT',
    UPDATE_EDIT_GIVING_GROUP_OBJECT: 'UPDATE_EDIT_GIVING_GROUP_OBJECT'
};
export const upadateEditGivingGroupObj = (editGivingGroupObject = {}) => dispatch =>
    dispatch({
        type: actionTypes.UPDATE_EDIT_GIVING_GROUP_OBJECT,
        payload: editGivingGroupObject,
    });
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
    const getUniqueCitiesPromise = getPaginatedCitiesCalls(pageNumber, pageSize, value, false);
    let citiesOption = []
    let citiesOptionsPromisesData = [];
    getUniqueCitiesPromise
        .then(async (data) => {
            citiesOption = data.data.map(({ attributes }) => {
                return {
                    key: attributes.city + attributes.province_name,
                    text: attributes.city,
                    value: attributes.city,
                }
            });
            if (data.meta.pageCount > 1) {
                const citiesPromise = [];
                for (let i = 2; i <= data.meta.pageCount; i++) {
                    citiesPromise.push(getPaginatedCitiesCalls(i, 50, value, false));
                }
                await Promise.all(citiesPromise).then((data) => {
                    data.map(({ data }) => {
                        data.map(({ attributes }) => {
                            citiesOptionsPromisesData.push({
                                key: attributes.city + attributes.province_name,
                                text: attributes.city,
                                value: attributes.city,
                            });
                        })
                    });
                });
            }
        })
        .catch(() => {
            // handle error
        })
        .finally(() => {
            dispatch({
                type: actionTypes.GET_UNIQUE_CITIES_LOADER,
                payload: false
            });
            dispatch({
                type: actionTypes.GET_UNIQUE_CITIES,
                payload: citiesOption.concat(citiesOptionsPromisesData),
            });
        });
    return getUniqueCitiesPromise;
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
    } = cloneCreateGivingGroupObject;
    if (fundraisingDate != '') {
        cloneCreateGivingGroupObject.attributes.fundraisingDate = dateFormatConverter(fundraisingDate, '/');
    };
    if (fundraisingCreated != '') {
        cloneCreateGivingGroupObject.attributes.fundraisingCreated = dateFormatConverter(fundraisingCreated, '/')
    };
    let newGalleryImage = [];
    if (galleryImages && galleryImages.length > 0) {
        galleryImages.map((item) => {
            newGalleryImage.push(item.src)
        })
    };
    cloneCreateGivingGroupObject.galleryImages = [...newGalleryImage];
    const bodyData = cloneCreateGivingGroupObject;
    return coreApi.post('/groups', { data: bodyData });
};


export const editGivingGroupApiCall = (editGivingGroupObj, groupId = '') => dispatch => {
    const editGroupObject = {
        type: 'groups',
        id: groupId,
        ...editGivingGroupObj
    };
    const EditGivingGroupApiCallPromise = coreApi.patch(`/groups/${groupId}`, { data: editGroupObject });
    EditGivingGroupApiCallPromise
        .then((result) => {
            delete result.data.links;
            delete result.data.relationships;
            const editGivingGroupObjResponse = result.data;
            let galleryImages = [];
            if (editGivingGroupObjResponse.attributes.galleryImagesList) {
                editGivingGroupObjResponse.attributes.galleryImagesList.map(({ display }) => {
                    galleryImages.push(display)
                })
            }
            let groupDescriptions = [];
            if (editGivingGroupObjResponse.attributes.groupDescriptionsValues) {
                editGivingGroupObjResponse.attributes.groupDescriptionsValues.map(item => {
                    groupDescriptions.push({
                        ...item,
                        id: `${item.purpose}${editGivingGroupObjResponse.attributes.groupDescriptionsValues.length}`
                    });
                })
            };
            editGivingGroupObjResponse.attributes = {
                ...editGivingGroupObjResponse.attributes,
                fundraisingCreated: editGivingGroupObjResponse.attributes.fundraisingStartDate,
                fundraisingDate: editGivingGroupObjResponse.attributes.fundraisingEndDate,
                fundraisingGoal: editGivingGroupObjResponse.attributes.goal,
                logo: editGivingGroupObjResponse.attributes.avatar,
                prefersInviteOnly: editGivingGroupObjResponse.attributes.isPrivate ? "1" : "0",
                prefersRecurringEnabled: editGivingGroupObjResponse.attributes.recurringEnabled ? "1" : "0",
                short: editGivingGroupObjResponse.attributes.description,
                videoUrl: editGivingGroupObjResponse.attributes.videoPlayerLink
            };
            editGivingGroupObjResponse.beneficiaryItems = editGivingGroupObjResponse.attributes.groupCharities
            editGivingGroupObjResponse.groupPurposeDescriptions = [...groupDescriptions];
            editGivingGroupObjResponse.galleryImages = [...galleryImages];
            dispatch(upadateEditGivingGroupObj({ ...editGivingGroupObjResponse }));
        })
        .catch(() => {
            //handle error
        });
    return EditGivingGroupApiCallPromise;
};

export const deleteGroupLogo = (editGivingGroupObj, groupId = '') => dispatch => {
    coreApi.delete(`/groups/${groupId}/delete_logo`)
        .then(() => {
            dispatch(upadateEditGivingGroupObj({
                ...editGivingGroupObj,
                attributes: {
                    ...editGivingGroupObj.attributes,
                    logo: '',
                    avatar: '',
                }
            }));
        })
        .catch(() => {
            //handle error
        })
};
