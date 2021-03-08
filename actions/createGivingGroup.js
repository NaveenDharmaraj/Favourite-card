import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';

import searchApi from '../services/searchApi';
import coreApi from '../services/coreApi';
import { dateFormatConverter } from '../helpers/createGrouputils';

export const actionTypes = {
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

export const getUniqueCities = (pageNumber = 1, pageSize = 50) => dispatch => {
    dispatch({
        type: actionTypes.GET_UNIQUE_CITIES_LOADER,
        payload: true
    });
    const params = {
        'page[number]': pageNumber,
        'page[size]': pageSize,
    };
    const getUniqueCitiesPromise = searchApi.get('/autocomplete/uniquecities', { params });
    getUniqueCitiesPromise
        .then(({ data }) => {
            const citiesOption = data.map(({ attributes }) => {
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
            dispatch({
                type: actionTypes.GET_UNIQUE_CITIES_LOADER,
                payload: false
            });
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
    if (editGroupObject.groupPurposeDescriptions) {
        editGroupObject.groupPurposeDescriptions.map((item) => delete item.id)
    }
    const EditGivingGroupApiCallPromise = coreApi.patch(`/groups/${groupId}`, { data: editGroupObject })
    EditGivingGroupApiCallPromise
        .then((result) => {
            delete result.data.links;
            delete result.data.relationships;
            const editGivingGroupObjResponse = result.data;
            if(editGivingGroupObjResponse.attributes.groupPurposeDescriptions){
                editGivingGroupObjResponse.attribues.groupPurposeDescriptions.map(item=>{
                    return{
                        ...item,
                        id: `${item.purpose}${item.length}`
                    }
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
                videoUrl: editGivingGroupObjResponse.attributes.videoDirectLink
            };
            editGivingGroupObjResponse.beneficiaryIds = editGivingGroupObjResponse.attributes.beneficiaryIds
            editGivingGroupObjResponse.groupPurposeDescriptions = editGivingGroupObjResponse.attributes.groupPurposeDescriptions;
            editGivingGroupObjResponse.galleryImages = editGivingGroupObjResponse.attributes.gallerySlides[0];
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