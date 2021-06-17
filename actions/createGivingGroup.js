import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';

import searchApi from '../services/searchApi';
import coreApi from '../services/coreApi';
import { dateFormatConverter } from '../helpers/createGrouputils';
import { adminActionType } from '../helpers/constants';

export const actionTypes = {
    GET_PROVINCE_LIST: 'GET_PROVINCE_LIST',
    GET_PROVINCES_LIST_LOADER: 'GET_PROVINCES_LIST_LOADER',
    GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER: 'GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER',
    GET_CHARITY_BASED_ON_SERACH_QUERY: 'GET_CHARITY_BASED_ON_SERACH_QUERY',
    GET_UNIQUE_CITIES: 'GET_UNIQUE_CITIES',
    GET_UNIQUE_CITIES_LOADER: 'GET_UNIQUE_CITIES_LOADER',
    UPDATE_CREATE_GIVING_GROUP_OBJECT: 'UPDATE_CREATE_GIVING_GROUP_OBJECT',
    UPDATE_EDIT_GIVING_GROUP_OBJECT: 'UPDATE_EDIT_GIVING_GROUP_OBJECT',
    GET_GROUP_MEMBERS_ROLES: 'GET_GROUP_MEMBERS_ROLES',
    GET_GROUP_PENDING_INVITES: 'GET_GROUP_PENDING_INVITES',
    SHOW_PENDING_INVITES_PLACEHOLDER: 'SHOW_PENDING_INVITES_PLACEHOLDER',
    SHOW_GROUP_MEMBERS_PLACEHOLDER: 'SHOW_GROUP_MEMBERS_PLACEHOLDER',
    TRIGGER_UX_CRITICAL_ERROR: 'TRIGGER_UX_CRITICAL_ERROR',
    GET_GROUP_WIDGET_CODE: 'GET_GROUP_WIDGET_CODE',
    GET_GROUP_FRIEND_LIST: 'GET_GROUP_FRIEND_LIST',
    GET_GROUP_MESSAGE_HISTORY: 'GET_GROUP_MESSAGE_HISTORY',
    SHOW_GROUP_MESSAGE_HISTORY_LOADER: 'SHOW_GROUP_MESSAGE_HISTORY_LOADER',
    SHOW_GROUP_FRIENDS_LIST_PLACEHOLDER: 'SHOW_GROUP_FRIENDS_LIST_PLACEHOLDER',
};

const getPaginatedCitiesCalls = (pageNumber = 1, pageSize = 50, value = '') => {
    const params = {
        dispatch,
        'page[number]': pageNumber,
        'page[size]': pageSize,
        uxCritical: true,
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
};

export const upadateEditGivingGroupObj = (editGivingGroupObject = {}) => (dispatch) =>
    dispatch({
        type: actionTypes.UPDATE_EDIT_GIVING_GROUP_OBJECT,
        payload: editGivingGroupObject,
    });

export const updateCreateGivingGroupObj = (createGivingGroupObject = {}) => (dispatch) =>
    dispatch({
        type: actionTypes.UPDATE_CREATE_GIVING_GROUP_OBJECT,
        payload: createGivingGroupObject,
    });

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
export const getProvincesList = (pageNumber = 1, pageSize = 50) => (dispatch) => {
    dispatch({
        type: actionTypes.GET_PROVINCES_LIST_LOADER,
        payload: true
    });
    const params = {
        dispatch,
        'page[number]': pageNumber,
        'page[size]': pageSize,
        uxCritical: true,
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
export const getCharityBasedOnSearchQuery = (query = '', pageNumber = '', pageSize = '') => (dispatch) => {
    dispatch({
        type: actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER,
        payload: true
    });
    const params = {
        dispatch,
        'page[number]': pageNumber,
        'page[size]': pageSize,
        query,
        uxCritical: true,
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

export const createGivingGroupApiCall = (createGivingGroupObj) => (dispatch) => {
    const cloneCreateGivingGroupObject = _cloneDeep(createGivingGroupObj);
    const {
        attributes: {
            fundraisingCreated,
            fundraisingDate,
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
            newGalleryImage.push(item.src);
        });
    };
    cloneCreateGivingGroupObject.galleryImages = [...newGalleryImage];
    const bodyData = cloneCreateGivingGroupObject;
    return coreApi.post('/groups', {
        data: bodyData,
    }, {
        params: {
            dispatch,
            uxCritical: true,
        },
    });
};


export const editGivingGroupApiCall = (editGivingGroupObj, groupId = '') => (dispatch) => {
    const editGroupObject = {
        type: 'groups',
        id: groupId,
        ...editGivingGroupObj,
    };
    const EditGivingGroupApiCallPromise = coreApi.patch(`/groups/${groupId}`, {
        data: editGroupObject,
    }, {
        params: {
            dispatch,
            uxCritical: true,
        },
    });
    EditGivingGroupApiCallPromise
        .then((result) => {
            delete result.data.links;
            delete result.data.relationships;
            const editGivingGroupObjResponse = result.data;
            const galleryImages = [];
            if (editGivingGroupObjResponse.attributes.galleryImagesList) {
                editGivingGroupObjResponse.attributes.galleryImagesList.map(({ display }) => {
                    galleryImages.push(display)
                });
            }
            const groupDescriptions = [];
            if (editGivingGroupObjResponse.attributes.groupDescriptionsValues) {
                editGivingGroupObjResponse.attributes.groupDescriptionsValues.map((item) => {
                    groupDescriptions.push({
                        ...item,
                        id: `${item.purpose}${editGivingGroupObjResponse.attributes.groupDescriptionsValues.length}`
                    });
                });
            }
            editGivingGroupObjResponse.attributes = {
                ...editGivingGroupObjResponse.attributes,
                fundraisingCreated: editGivingGroupObjResponse.attributes.fundraisingStartDate,
                fundraisingDate: editGivingGroupObjResponse.attributes.fundraisingEndDate,
                fundraisingGoal: editGivingGroupObjResponse.attributes.goal,
                logo: editGivingGroupObjResponse.attributes.avatar,
                prefersInviteOnly: editGivingGroupObjResponse.attributes.isPrivate ? '1' : '0',
                prefersRecurringEnabled: editGivingGroupObjResponse.attributes.recurringEnabled ? '1' : '0',
                short: editGivingGroupObjResponse.attributes.description,
                videoUrl: editGivingGroupObjResponse.attributes.videoPlayerLink,
            };
            editGivingGroupObjResponse.beneficiaryItems = editGivingGroupObjResponse.attributes.groupCharities;
            editGivingGroupObjResponse.groupPurposeDescriptions = [...groupDescriptions];
            editGivingGroupObjResponse.galleryImages = [...galleryImages];
            dispatch(upadateEditGivingGroupObj({ ...editGivingGroupObjResponse }));
        })
        .catch(() => {
            //handle error
        });
    return EditGivingGroupApiCallPromise;
};

export const deleteGroupLogo = (editGivingGroupObj, groupId = '') => (dispatch) => {
    coreApi.delete(`/groups/${groupId}/delete_logo`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        dispatch(upadateEditGivingGroupObj({
            ...editGivingGroupObj,
            attributes: {
                ...editGivingGroupObj.attributes,
                logo: '',
                avatar: '',
            }
        }));
    }).catch(() => {
        //handle error
    });
};

export const getGroupMembers = (groupId, pageNumber = 1) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.GET_GROUP_MEMBERS_ROLES,
    };
    const placeholder = {
        payload: {
            status: true,
        },
        type: actionTypes.SHOW_GROUP_MEMBERS_PLACEHOLDER,
    };
    dispatch(placeholder);
    return coreApi.get(`/groups/${groupId}/groupMembers`, {
        params: {
            dispatch,
            'page[number]': pageNumber,
            'page[size]': 10,
            uxCritical: true,
        },
    }).then(
        (result) => {
            if (!_isEmpty(result) && !_isEmpty(result.data)) {
                fsa.payload = result;
                dispatch(fsa);
            }
        },
    ).finally(() => {
        placeholder.payload.status = false;
        dispatch(placeholder);
    });
};

export const getPendingInvites = (groupId, pageNumber = 1) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.GET_GROUP_PENDING_INVITES,
    };
    const placeholder = {
        payload: {
            status: true,
        },
        type: actionTypes.SHOW_PENDING_INVITES_PLACEHOLDER,
    };
    dispatch(placeholder);
    return coreApi.get(`/groups/${groupId}/pendingGroupInvites`, {
        params: {
            dispatch,
            'page[number]': pageNumber,
            'page[size]': 10,
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result) && !_isEmpty(result.data)) {
            fsa.payload = result.data;
            dispatch(fsa);
        }
    }).finally(() => {
        placeholder.payload.status = false;
        dispatch(placeholder);
    });
};

export const toggleAdmin = (memberId, groupId, type, displayName) => (dispatch) => {
    const queryData = {
        data: {
            attributes: {
                group_id: groupId,
            },
            type: 'groups',
        },
    };
    const toastMessageProps = {
        message: '',
        type: 'success',
    };
    if (type === adminActionType.make_admin) {
        toastMessageProps.message = `${displayName} is an admin now.`;
    } else {
        toastMessageProps.message = `${displayName} has been removed as admin.`;
    }
    return coreApi.patch(`/members/${memberId}/toggleAdmin`, queryData, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        dispatch(getGroupMembers(groupId));
        dispatch({
            payload: {
                errors: [
                    toastMessageProps,
                ],
            },
            type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
        });
    });
};

export const getMessageHistory = (groupId) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.GET_GROUP_MESSAGE_HISTORY,
    };
    const placeholderfsa = {
        payload: {
            showplaceholder: true,
        },
        type: actionTypes.SHOW_GROUP_MESSAGE_HISTORY_LOADER,
    };
    dispatch(placeholderfsa);
    return coreApi.get(`/groups/${groupId}/messageHistories`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result) && !_isEmpty(result.data)) {
            fsa.payload = result;
            dispatch(fsa);
        }
    }).finally(() => {
        placeholderfsa.payload.showplaceholder = false;
        dispatch(placeholderfsa);
    });
};

export const emailMembers = (groupId, data) => (dispatch) => {
    const toastMessageProps = {
        message: 'Your message has been sent!',
        type: 'success',
    };
    return coreApi.post(`/groups/${groupId}/email_members`, data, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        dispatch({
            payload: {
                errors: [
                    toastMessageProps,
                ],
            },
            type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
        });
        dispatch(getMessageHistory(groupId));
    });
};

export const sendEmailInvite = (data) => (dispatch) => {
    const toastMessageProps = {
        message: 'Your invitation has been sent.',
        type: 'success',
    };
    return coreApi.post(`/members`, data, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        dispatch({
            payload: {
                errors: [
                    toastMessageProps,
                ],
            },
            type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
        });
    });
};

export const resendInvite = (data, inviteId) => (dispatch) => {
    const toastMessageProps = {
        message: 'Invite resent.',
        type: 'success',
    };
    return coreApi.patch(`/members/${inviteId}/resendInvite`, data, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        dispatch({
            payload: {
                errors: [
                    toastMessageProps,
                ],
            },
            type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
        });
    });
};

export const cancelInvite = (modifiedpayload, inviteId) => (dispatch) => {
    const toastMessageProps = {
        message: 'Invite cancelled.',
        type: 'success',
    };
    return coreApi.patch(`/members/${inviteId}/cancelInvite`, modifiedpayload, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        dispatch({
            payload: {
                errors: [
                    toastMessageProps,
                ],
            },
            type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
        });
        dispatch(getPendingInvites(modifiedpayload.data.attributes.group_id));
    });
};

export const searchMember = (groupId, searchStr, pageNumber = 1) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.GET_GROUP_MEMBERS_ROLES,
    };
    const placeholder = {
        payload: {
            status: true,
        },
        type: actionTypes.SHOW_GROUP_MEMBERS_PLACEHOLDER,
    };
    dispatch(placeholder);
    return coreApi.get(`/groups/${groupId}/groupMembers`, {
        params: {
            dispatch,
            'filter[groupMembers]': searchStr,
            'page[number]': pageNumber,
            'page[size]': 10,
            sort: 'first_name',
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result) && !_isEmpty(result.data)) {
            fsa.payload = result;
            dispatch(fsa);
        }
    }).finally(() => {
        placeholder.payload.status = false;
        dispatch(placeholder);
    });
};

export const getWidgetCode = (groupId) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.GET_GROUP_WIDGET_CODE,
    };
    return coreApi.get(`/widgets/generateWidgetScript`, {
        params: {
            dispatch,
            entity_type: 'group',
            id: groupId,
            selected_value: 'Green',
            uxCritical: true,
        },
    }).then((greenData) => {
        coreApi.get(`/widgets/generateWidgetScript`, {
            params: {
                dispatch,
                entity_type: 'group',
                id: groupId,
                selected_value: 'Blue',
                uxCritical: true,
            },
        }).then((blueData) => {
            fsa.payload = {
                blue: blueData,
                green: greenData,
            };
            dispatch(fsa);
        });
    });
};

export const removeGroupMember = (userId, groupId, displayName) => (dispatch) => {
    const queryData = {
        data: {
            attributes: {
                group_id: groupId,
            },
            type: 'groups',
        },
    };
    const toastMessageProps = {
        message: `${displayName} has been removed from the group.`,
        type: 'success',
    };
    return coreApi.patch(`/members/${userId}/removeMember`, queryData, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        dispatch(getGroupMembers(groupId));
        dispatch({
            payload: {
                errors: [
                    toastMessageProps,
                ],
            },
            type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
        });
    });
};

export const getMyfriendsList = (groupId, pageNumber = 1) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.GET_GROUP_FRIEND_LIST,
    };
    const placeholderfsa = {
        payload: {
            showplaceholder: true,
        },
        type: actionTypes.SHOW_GROUP_FRIENDS_LIST_PLACEHOLDER,
    };
    dispatch(placeholderfsa);
    return coreApi.get(`/groups/${groupId}/nonGroupFriends`, {
        params: {
            dispatch,
            'page[number]': pageNumber,
            'page[size]': 10,
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result) && !_isEmpty(result.data)) {
            fsa.payload = result;
            dispatch(fsa);
        }
    }).finally(() => {
        placeholderfsa.payload.showplaceholder = false;
        dispatch(placeholderfsa);
    });
};

export const searchFriendList = (groupId, searchStr, pageNumber = 1) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.GET_GROUP_FRIEND_LIST,
    };
    return coreApi.get(`/groups/${groupId}/nonGroupFriends`, {
        params: {
            dispatch,
            'filter[groupMembers]': searchStr,
            'page[number]': pageNumber,
            'page[size]': 10,
            sort: 'first_name',
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result) && !_isEmpty(result.data)) {
            fsa.payload = result;
            dispatch(fsa);
        }
    }).finally();
};
