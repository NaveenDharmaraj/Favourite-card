import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';

import { Router } from '../routes';
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
    SHOW_GROUP_GALLERY_LOADER: 'SHOW_GROUP_GALLERY_LOADER',
    MANAGE_GROUP_MEMBERS_INITIAL: 'MANAGE_GROUP_MEMBERS_INITIAL',
    MANAGE_FRIEND_GROUP_INVITE_INITIAL: 'MANAGE_FRIEND_GROUP_INVITE_INITIAL'
};

const getPaginatedCitiesCalls = (pageNumber = 1, pageSize = 50, value = '', dispatch) => {
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
    const getUniqueCitiesPromise = getPaginatedCitiesCalls(pageNumber, pageSize, value, false, dispatch);
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
                    citiesPromise.push(getPaginatedCitiesCalls(i, 50, value, false, dispatch));
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
                title: attributes.name,
                value: attributes.name,
                id: attributes.charity_id,
            };
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

export const createGivingGroupApiCall = (createGivingGroupObj, isCampaignLocked = false) => (dispatch) => {
    const cloneCreateGivingGroupObject = _cloneDeep(createGivingGroupObj);
    const {
        attributes: {
            fundraisingCreated,
            fundraisingDate,
            fundraisingGoal,
        },
        beneficiaryItems,
        galleryImages,
    } = cloneCreateGivingGroupObject;
    const beneficiaryIds = [];
    if (!_isEmpty(fundraisingGoal)) {
        cloneCreateGivingGroupObject.attributes.fundraisingGoal = parseFloat(fundraisingGoal.replace(/,/g, ''));
    }
    if (!_isEmpty(beneficiaryItems) && !isCampaignLocked) {
        beneficiaryItems.map((beneficiary) => {
            beneficiaryIds.push(beneficiary.id.toString());
        });
    }
    cloneCreateGivingGroupObject.beneficiaryIds = beneficiaryIds;
    delete cloneCreateGivingGroupObject.beneficiaryItems;
    if (!_isEmpty(fundraisingDate)) {
        cloneCreateGivingGroupObject.attributes.fundraisingDate = dateFormatConverter(fundraisingDate, '/');
    }
    if (!_isEmpty(fundraisingCreated)) {
        cloneCreateGivingGroupObject.attributes.fundraisingCreated = dateFormatConverter(fundraisingCreated, '/');
    }
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


export const editGivingGroupApiCall = (editGivingGroupObj, groupId = '', messageText = '') => (dispatch) => {
    const editGroupObject = {
        type: 'groups',
        id: groupId,
        ...editGivingGroupObj,
    };
    let toastMessageProps = {
        message: 'Changes saved.',
        type: 'success',
    };
    const statusMessageProps = {
        heading: 'We’re sorry, something went wrong.',
        message: 'Please try again',
        type: 'error',
    };
    const loaderfsa = {
        payload: {
            showloader: true,
        },
        type: actionTypes.SHOW_GROUP_GALLERY_LOADER,
    };
    dispatch(loaderfsa);
    if (!_isEmpty(messageText)) {
        toastMessageProps.message = messageText;
    }
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
                editGivingGroupObjResponse.attributes.galleryImagesList.map(({
                    assetId,
                    display,
                }) => {
                    const imgObj = {
                        assetId,
                        display,
                    };
                    galleryImages.push(imgObj);
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
            dispatch({
                payload: {
                    errors: [
                        toastMessageProps,
                    ],
                },
                type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
            });
        })
        .catch(() => {
            dispatch({
                payload: {
                    errors: [
                        statusMessageProps,
                    ],
                },
                type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
            });
        }).finally(() => {
            loaderfsa.payload.showloader = false;
            dispatch(loaderfsa);
        });
    return EditGivingGroupApiCallPromise;
};

export const deleteGroupLogo = (editGivingGroupObj, groupId = '') => (dispatch) => {
    let updateImageStatus = false;
    coreApi.delete(`/groups/${groupId}/delete_logo`, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result.data)) {
            updateImageStatus = result.data.attributes.isAvatarUploadedByUser;
        }
        dispatch(upadateEditGivingGroupObj({
            ...editGivingGroupObj,
            attributes: {
                ...editGivingGroupObj.attributes,
                logo: '',
                avatar: '',
                isAvatarUploadedByUser: updateImageStatus,
            },
        }));
    }).catch(() => {
        //handle error
    });
};

export const getGroupMembers = (groupId, pageNumber = 1, isInitial) => (dispatch) => {
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
    let adminCount = 0;
    dispatch(placeholder);
    return coreApi.get(`/groups/${groupId}/groupUsers`, {
        params: {
            dispatch,
            'page[number]': pageNumber,
            'page[size]': 10,
            uxCritical: true,
        },
    }).then(
        (result) => {
            if (!_isEmpty(result)) {
                fsa.payload = result;
                dispatch(fsa);
                if (isInitial) {
                    const initialPayload = {
                        payload: {
                            isInitial: false,
                        },
                        type: actionTypes.MANAGE_GROUP_MEMBERS_INITIAL,
                    };
                    if (!_isEmpty(result.data) && (result.data.length) === 1) {
                        result.data.map((data) => {
                            if (data.attributes.isGroupAdmin) {
                                adminCount += 1;
                            }
                        });
                        initialPayload.payload.isInitial = (adminCount === 1);
                    } else if (_isEmpty(result.data)) {
                        initialPayload.payload.isInitial = true;
                    }
                    dispatch(initialPayload);
                }
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
        if (!_isEmpty(result)) {
            fsa.payload = result;
            dispatch(fsa);
        }
    }).finally(() => {
        placeholder.payload.status = false;
        dispatch(placeholder);
    });
};

export const toggleAdmin = (memberId, groupId, type, displayName, isCurrentUser = false, slug = '') => (dispatch) => {
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
    const removeToastMessage = isCurrentUser ? `You have` : `${displayName} has`;
    if (type === adminActionType.make_admin) {
        toastMessageProps.message = `${displayName} is an admin now.`;
    } else {
        toastMessageProps.message = `${removeToastMessage} been removed as admin.`;
    }
    return coreApi.patch(`/members/${memberId}/toggleAdmin`, queryData, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then(() => {
        if (isCurrentUser && type === adminActionType.remove_admin) {
            Router.pushRoute(`groups/${slug}`);
        } else {
            dispatch(getGroupMembers(groupId));
        }
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
        if (!_isEmpty(result)) {
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
        message: '',
        type: 'success',
    };
    return coreApi.post(`/members`, data).then((result) => {
        if (!_isEmpty(result.data)) {
            toastMessageProps.message = result.data.attributes.created_emails;
            dispatch({
                payload: {
                    errors: [
                        toastMessageProps,
                    ],
                },
                type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
            });
        }
    }).catch((error) => {
        if (!_isEmpty(error.data) && !_isEmpty(error.data.attributes)) {
            if (error.data.attributes.created_emails !== 'none') {
                toastMessageProps.message = error.data.attributes.created_emails;
                dispatch({
                    payload: {
                        errors: [
                            toastMessageProps,
                        ],
                    },
                    type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
                });
            }
            if (error.data.attributes.invalid_emails !== 'none') {
                toastMessageProps.message = error.data.attributes.invalid_emails;
                toastMessageProps.type = 'error';
                dispatch({
                    payload: {
                        errors: [
                            toastMessageProps,
                        ],
                    },
                    type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
                });
            }

            if (error.data.attributes.skipped_emails !== 'none') {
                toastMessageProps.message = error.data.attributes.skipped_emails;
                toastMessageProps.type = 'error';
                dispatch({
                    payload: {
                        errors: [
                            toastMessageProps,
                        ],
                    },
                    type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
                });
            }
        }
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
    return coreApi.get(`/groups/${groupId}/groupUsers`, {
        params: {
            dispatch,
            'filter[groupMembers]': searchStr,
            'page[number]': pageNumber,
            'page[size]': 10,
            sort: 'first_name',
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result)) {
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
            selected_value: 'all',
            uxCritical: true,
        },
    }).then((result) => {
        if (!_isEmpty(result)) {
            const formattedWidgetScript = {};
            formattedWidgetScript.large = result[0].large;
            formattedWidgetScript.medium = result[1].medium;
            formattedWidgetScript.simple = result[2].simple;
            fsa.payload = formattedWidgetScript;
            dispatch(fsa);
        }
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

export const getMyfriendsList = (groupId, pageNumber = 1, isInitial) => (dispatch) => {
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
        if (!_isEmpty(result)) {
            fsa.payload = result;
            dispatch(fsa);
            if (isInitial) {
                const initialPayload = {
                    payload: {},
                    type: actionTypes.MANAGE_FRIEND_GROUP_INVITE_INITIAL,
                };
                let status = true;
                if (!_isEmpty(result.data)) {
                    status = false;
                }
                initialPayload.payload.isInitial = status;
                dispatch(initialPayload);
            }
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
        if (!_isEmpty(result)) {
            fsa.payload = result;
            dispatch(fsa);
        }
    }).finally();
};

export const removeImage = (assetId, editObj) => (dispatch) => {
    const toastMessageProps = {
        message: 'Changes saved.',
        type: 'success',
    };
    const loaderfsa = {
        payload: {
            showloader: true,
        },
        type: actionTypes.SHOW_GROUP_GALLERY_LOADER,
    };
    dispatch(loaderfsa);
    return coreApi.delete(`/groups/${assetId}/delete_gallery_images`, {
        params: {
            dispatch,
            group_id: editObj.id,
            uxCritical: true,
        },
    }).then(() => {
        dispatch(upadateEditGivingGroupObj(editObj));
        dispatch({
            payload: {
                errors: [
                    toastMessageProps,
                ],
            },
            type: actionTypes.TRIGGER_UX_CRITICAL_ERROR,
        });
    }).finally(() => {
        loaderfsa.payload.showloader = false;
        dispatch(loaderfsa);
    });
};
