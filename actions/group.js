/* eslint-disable import/exports-last */
import _isEmpty from 'lodash/isEmpty';

import coreApi from '../services/coreApi';
import graphApi from '../services/graphApi';
import eventApi from '../services/eventApi';
import { upadateEditGivingGroupObj } from './createGivingGroup';
import { intializeCreateGivingGroup } from '../helpers/createGrouputils';

export const actionTypes = {
    ACTIVITY_LIKE_STATUS: 'ACTIVITY_LIKE_STATUS',
    ADMIN_PLACEHOLDER_STATUS: 'ADMIN_PLACEHOLDER_STATUS',
    CHARITY_SUPPORT_PLACEHOLDER_STATUS: 'CHARITY_SUPPORT_PLACEHOLDER_STATUS',
    GET_BENEFICIARIES_COUNT: 'GET_BENEFICIARIES_COUNT',
    GET_CAMPAIGN_SUPPORTING_GROUP: 'GET_CAMPAIGN_SUPPORTING_GROUP',
    GET_GROUP_ACTIVITY_DETAILS: 'GET_GROUP_ACTIVITY_DETAILS',
    GET_GROUP_ADMIN_DETAILS: 'GET_GROUP_ADMIN_DETAILS',
    GET_GROUP_BENEFICIARIES: 'GET_GROUP_BENEFICIARIES',
    GET_GROUP_COMMENTS: 'GET_GROUP_COMMENTS',
    GET_GROUP_DETAILS_FROM_SLUG: 'GET_GROUP_DETAILS_FROM_SLUG',
    GET_GROUP_GALLERY_IMAGES: 'GET_GROUP_GALLERY_IMAGES',
    GET_GROUP_MEMBERS_DETAILS: 'GET_GROUP_MEMBERS_DETAILS',
    GET_GROUP_TRANSACTION_DETAILS: 'GET_GROUP_TRANSACTION_DETAILS',
    GROUP_MATCHING_HISTORY: 'GROUP_MATCHING_HISTORY',
    GROUP_MEMBER_UPDATE_FRIEND_STATUS: 'GROUP_MEMBER_UPDATE_FRIEND_STATUS',
    GROUP_PLACEHOLDER_STATUS: 'GROUP_PLACEHOLDER_STATUS',
    GROUP_REDIRECT_TO_DASHBOARD: 'GROUP_REDIRECT_TO_DASHBOARD',
    GROUP_REDIRECT_TO_ERROR_PAGE: 'GROUP_REDIRECT_TO_ERROR_PAGE',
    LEAVE_GROUP_MODAL_BUTTON_LOADER: 'LEAVE_GROUP_MODAL_BUTTON_LOADER',
    LEAVE_GROUP_MODAL_ERROR_MESSAGE: 'LEAVE_GROUP_MODAL_ERROR_MESSAGE',
    MEMBER_PLACEHOLDER_STATUS: 'MEMBER_PLACEHOLDER_STATUS',
    POST_NEW_ACTIVITY: 'POST_NEW_ACTIVITY',
    POST_NEW_COMMENT: 'POST_NEW_COMMENT',
    RESET_GROUP_STATES: 'RESET_GROUP_STATES',
    TOGGLE_TRANSACTION_VISIBILITY: 'TOGGLE_TRANSACTION_VISIBILITY',
    // COMMENT_LIKE_STATUS: 'COMMENT_LIKE_STATUS',
};

export const getGroupFromSlug = (slug, token = null, fromEdit = false) => async (dispatch) => {
    if (slug !== ':slug') {
        const fsa = {
            payload: {
                groupDetails: {},
            },
            type: actionTypes.GET_GROUP_DETAILS_FROM_SLUG,
        };
        dispatch({
            payload: {
                redirectToDashboard: false,
            },
            type: actionTypes.GROUP_REDIRECT_TO_DASHBOARD,
        });
        dispatch({
            payload: {
                redirectToErrorPage: false,
            },
            type: actionTypes.GROUP_REDIRECT_TO_ERROR_PAGE,
        });
        const fullParams = {
            params: {
                dispatch,
                findBySlug: true,
                load_full_profile: true,
                slug,
                uxCritical: true,
            },
        };
        if (!_isEmpty(token)) {
            fullParams.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
        await coreApi.get('/groups/find_by_slug', {
            ...fullParams,
        }).then(
            async (result) => {
                if (result && !_isEmpty(result.data)) {
                    fsa.payload.groupDetails = result.data;
                    dispatch(fsa);
                    if (fromEdit) {
                        await dispatch(upadateEditGivingGroupObj({
                            ...intializeCreateGivingGroup,
                            attributes: {
                                ...intializeCreateGivingGroup.attributes,
                                avatar: result.data.attributes.avatar,
                                logo: result.data.attributes.avatar,
                                causes: result.data.attributes.causes,
                                city: result.data.attributes.city,
                                fundraisingDaysRemaining: result.data.attributes.fundraisingDaysRemaining,
                                fundraisingDate: result.data.attributes.fundraisingEndDate,
                                fundraisingPercentage: result.data.attributes.fundraisingPercentage,
                                fundraisingCreated: result.data.attributes.fundraisingStartDate,
                                fundraisingGoal: result.data.attributes.goal,
                                goalAmountRaised: result.data.attributes.goalAmountRaised,
                                name: result.data.attributes.name,
                                prefersInviteOnly: result.data.attributes.isPrivate ? "1" : "0",
                                prefersRecurringEnabled: result.data.attributes.recurringEnabled ? "1" : "0",
                                province: result.data.attributes.province,
                                short: result.data.attributes.description,
                                slug: result.data.attributes.slug,
                                videoUrl: result.data.attributes.videoPlayerLink,
                            },
                            beneficiaryIds: result.data.attributes.beneficiaryIds,
                            groupPurposeDescriptions: result.data.attributes.groupDescriptionsValues,
                            galleryImages: result.data.attributes.gallerySlides[0],
                            id: result.data.id,
                        }))
                    }
                }
            },
        ).catch((error) => {
            if (error[0] && error[0].status === 403) {
                dispatch({
                    payload: {
                        redirectToErrorPage: true,
                    },
                    type: actionTypes.GROUP_REDIRECT_TO_ERROR_PAGE,
                });
            } else {
                dispatch({
                    payload: {
                        redirectToDashboard: true,
                    },
                    type: actionTypes.GROUP_REDIRECT_TO_DASHBOARD,
                });
            }
        });
    } else {
        // redirect('/dashboard');
    }
};

export const getImageGallery = (url) => (dispatch) => {
    const galleryfsa = {
        payload: {
            galleryImages: [],
        },
        type: actionTypes.GET_GROUP_GALLERY_IMAGES,
    };
    return coreApi.get(url, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then((galleryResult) => {
        if (galleryResult && !_isEmpty(galleryResult.data)) {
            galleryfsa.payload.galleryImages = galleryResult.data;
            dispatch(galleryfsa);
        }
    }).catch().finally();
};

export const getDetails = (id, type, pageNumber = 1) => (dispatch) => {
    const fsa = {
        payload: {},
    };
    let newUrl = '';
    const placeholderfsa = {
        payload: {},
    };
    switch (type) {
        case 'members':
            fsa.type = actionTypes.GET_GROUP_MEMBERS_DETAILS;
            newUrl = `/groups/${id}/groupUsers`;
            placeholderfsa.payload.memberPlaceholder = true;
            placeholderfsa.type = actionTypes.MEMBER_PLACEHOLDER_STATUS;
            break;
        case 'admins':
            fsa.type = actionTypes.GET_GROUP_ADMIN_DETAILS;
            newUrl = `/groups/${id}/groupAdmins`;
            placeholderfsa.payload.adminPlaceholder = true;
            placeholderfsa.type = actionTypes.ADMIN_PLACEHOLDER_STATUS;
            break;
        case 'charitySupport':
            fsa.type = actionTypes.GET_GROUP_BENEFICIARIES;
            newUrl = `groups/${id}/groupBeneficiaries`;
            placeholderfsa.payload.showPlaceholder = true;
            placeholderfsa.type = actionTypes.CHARITY_SUPPORT_PLACEHOLDER_STATUS;
            break;
        default:
            break;
    }
    dispatch(placeholderfsa);
    const GetDetailsPromise = coreApi.get(newUrl, {
        params: {
            dispatch,
            ignore401: true,
            'page[number]': pageNumber,
            'page[size]': 10,
            uxCritical: true,
        },
    })
    GetDetailsPromise.then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.data = result.data;
            fsa.payload.totalCount = result.meta.recordCount;
            fsa.payload.pageCount = result.meta.pageCount;
            dispatch(fsa);
        }
    }).catch().finally(() => {
        dispatch(fsa);
        switch (type) {
            case 'members':
                placeholderfsa.payload.memberPlaceholder = false;
                placeholderfsa.type = actionTypes.MEMBER_PLACEHOLDER_STATUS;
                break;
            case 'admins':
                placeholderfsa.payload.adminPlaceholder = false;
                placeholderfsa.type = actionTypes.ADMIN_PLACEHOLDER_STATUS;
                break;
            case 'charitySupport':
                placeholderfsa.payload.showPlaceholder = false;
                placeholderfsa.type = actionTypes.CHARITY_SUPPORT_PLACEHOLDER_STATUS;
                break;
            default:
                break;
        }
        dispatch(placeholderfsa);
    });
    return GetDetailsPromise;
};

export const getTransactionDetails = (id, type, pageNumber = 1) => async (dispatch) => {
    const fsa = {
        payload: {
            groupTransactions: {},
        },
        type: actionTypes.GET_GROUP_TRANSACTION_DETAILS,
    };
    dispatch({
        payload: {
            showPlaceholder: true,
        },
        type: actionTypes.GROUP_PLACEHOLDER_STATUS,
    });
    await coreApi.get(`groups/${id}/activities`, {
        params: {
            dispatch,
            'filter[moneyItems]': type,
            ignore401: true,
            'page[number]': pageNumber,
            'page[size]': 10,
            uxCritical: true,
        },
    }).then((result) => {
        if (result) {
            fsa.payload.groupTransactions = result;
            dispatch(fsa);
        }
    }).catch().finally(() => {
        dispatch({
            payload: {
                showPlaceholder: false,
            },
            type: actionTypes.GROUP_PLACEHOLDER_STATUS,
        });
    });
};

export const getGroupActivities = (id, url, isPostActivity = false) => (dispatch) => {
    const fsa = {
        payload: {
            groupActivities: {},
        },
        type: actionTypes.GET_GROUP_ACTIVITY_DETAILS,
    };
    const newUrl = !_isEmpty(url) ? url : `groups/${id}/activities`;
    return coreApi.get(newUrl, {
        params: {
            dispatch,
            ignore401: true,
            'page[size]': isPostActivity ? 1 : 10,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.groupActivities = result;
            if (!isPostActivity) {
                fsa.payload.nextLink = (result.links.next) ? result.links.next : null;
            }
            fsa.payload.isPostActivity = isPostActivity;
            dispatch(fsa);
        }
    }).catch().finally(() => {
        if (typeof url === 'undefined') {
            dispatch({
                payload: {
                    showPlaceholder: false,
                },
                type: actionTypes.GROUP_PLACEHOLDER_STATUS,
            });
        }
    });
};

export const getCommentFromActivityId = (id, commentsCount) => (dispatch) => {
    const fsa = {
        payload: {
            groupComments: {},
        },
        type: actionTypes.GET_GROUP_COMMENTS,
    };
    return coreApi.get(`events/${id}/comments`, {
        params: {
            dispatch,
            ignore401: true,
            'page[size]': commentsCount,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.groupComments = result.data;
            fsa.payload.activityId = id;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

export const postActivity = (id, msg) => (dispatch) => {
    const url = '';
    return coreApi.post(`/comments`,
        {
            data: {
                attributes: {
                    comment: msg,
                    groupId: id,
                },
                type: 'comments',
            },
        }, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            dispatch(getGroupActivities(id, url, true));
        }
    }).catch().finally();
};

export const postComment = (groupId, eventId, msg, user) => (dispatch) => {
    const fsa = {
        payload: {
            groupComments: [],
        },
        type: actionTypes.POST_NEW_COMMENT,
    };
    return coreApi.post(`/comments`,
        {
            data: {
                attributes: {
                    comment: msg,
                    eventId: Number(eventId),
                    groupId: Number(groupId),
                },
                type: 'comments',
            },
        }, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.groupComments = [
                {
                    attributes: {
                        avatar: user.avatar,
                        comment: result.data.body,
                        createdAt: result.data.created_at,
                        creator: user.displayName,
                        groupId,
                        isLiked: false,
                        likesCount: 0,
                    },
                    id: result.data.id,
                    type: 'comments',
                },
            ];
            fsa.payload.activityId = eventId;
            dispatch(fsa);
        }
    }).catch().finally();
};

export const likeActivity = (eventId, groupId, userId) => (dispatch) => {
    const fsa = {
        payload: {
            activityStatus: false,
        },
        type: actionTypes.ACTIVITY_LIKE_STATUS,
    };
    return graphApi.post(`core/create/commentlikes`,
        {
            data: {
                event_id: Number(eventId),
                group_id: Number(groupId),
                target: 'EVENT',
                user_id: Number(userId),
            },
        }, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.activityStatus = true;
            fsa.payload.eventId = eventId;
        }
        dispatch(fsa);
    }).catch(() => {
        // console.log('like activity catch block');
    }).finally(() => {
    });
};

export const unlikeActivity = (eventId, groupId, userId) => (dispatch) => {
    const fsa = {
        payload: {
            activityStatus: true,
        },
        type: actionTypes.ACTIVITY_LIKE_STATUS,
    };
    return graphApi.delete(`core/delete/commentlikes/NODE`,
        {
            data: {
                filters: {
                    event_id: Number(eventId),
                    group_id: Number(groupId),
                    target: 'EVENT',
                    user_id: Number(userId),
                },
            },
        }, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.activityStatus = false;
            fsa.payload.eventId = eventId;
        }
        dispatch(fsa);
    }).catch().finally(() => {
    });
};

// export const likeComment = async (dispatch, eventId, groupId, userId, commentId) => {
//     const fsa = {
//         payload: {
//             commentStatus: false,
//         },
//         type: actionTypes.COMMENT_LIKE_STATUS,
//     };
//     graphApi.post(`core/create/commentlikes`,
//         {
//             data: {
//                 comment_id: Number(commentId),
//                 event_id: Number(eventId),
//                 group_id: Number(groupId),
//                 target: 'COMMENT',
//                 user_id: Number(userId),
//             },
//         }).then((result) => {
//         if (result && !_isEmpty(result.data)) {
//             fsa.payload.commentStatus = true;
//         }
//     }).catch().finally(() => {
//         dispatch(fsa);
//     });
// };

// export const unlikeComment = async (dispatch, eventId, groupId, userId, commentId) => {
//     const fsa = {
//         payload: {
//             commentStatus: true,
//         },
//         type: actionTypes.COMMENT_LIKE_STATUS,
//     };
//     graphApi.delete(`core/delete/commentlikes/NODE`,
//         {
//             data: {
//                 filters: {
//                     comment_id: Number(commentId),
//                     event_id: Number(eventId),
//                     group_id: Number(groupId),
//                     target: 'COMMENT',
//                     user_id: Number(userId),
//                 },
//             },
//         }).then((result) => {
//         if (result && !_isEmpty(result.data)) {
//             fsa.payload.commentStatus = false;
//         }
//     }).catch().finally(() => {
//         dispatch(fsa);
//     });
// };

export const joinGroup = (groupSlug, groupId, loadMembers) => (dispatch) => {
    const fsa = {
        payload: {
            groupDetails: {},
        },
        type: actionTypes.GET_GROUP_DETAILS_FROM_SLUG,
    };
    return coreApi.post(`/groups/join`, {
        slug: groupSlug,
    }, {
        params: {
            dispatch,
            ignore401: true,
            load_full_profile: true,
        },
    }).then(
        (result) => {
            if (result && !_isEmpty(result.data)) {
                fsa.payload.groupDetails = result.data;
                dispatch(getGroupActivities(groupId, null, true));
                if (loadMembers) {
                    dispatch(getDetails(groupId, 'members'));
                }
            }
        },
    ).catch(() => {
        // redirect('/give/error');
    }).finally(() => {
        dispatch(fsa);
    });
};

export const getGroupBeneficiariesCount = (url) => (dispatch) => {
    const fsa = {
        payload: {
            groupBeneficiariesCount: {},
        },
        type: actionTypes.GET_BENEFICIARIES_COUNT,
    };
    return coreApi.get(url,
        {
            params: {
                dispatch,
                ignore401: true,
                uxCritical: true,
            },
        }).then((result) => {
            if (result && !_isEmpty(result.data)) {
                fsa.payload.groupBeneficiariesCount = result.data;
            }
        }).catch().finally(() => {
            dispatch(fsa);
        });
};

const checkForOnlyOneAdmin = (error) => {
    if (!_isEmpty(error) && error.length === 1) {
        const checkForAdminError = error[0];
        if (!_isEmpty(checkForAdminError.meta)
            && !_isEmpty(checkForAdminError.meta.validationCode)
            && (checkForAdminError.meta.validationCode === '1329'
                || checkForAdminError.meta.validationCode === 1329)) {
            return true;
        }
    }
    return false;
};

export const leaveGroup = (slug, groupId, loadMembers) => (dispatch) => {
    dispatch({
        payload: { buttonLoading: true },
        type: actionTypes.LEAVE_GROUP_MODAL_BUTTON_LOADER,
    });
    const params = {
        dispatch,
        ignore401: true,
        slug,
    };
    return coreApi.patch(`/groups/leave`, params).then((result) => {
        if (result && result.status === 'SUCCESS') {
            dispatch(getGroupFromSlug(slug));
            dispatch({
                payload: {
                    buttonLoading: false,
                    closeModal: true,
                },
                type: actionTypes.LEAVE_GROUP_MODAL_BUTTON_LOADER,
            });
            if (loadMembers) {
                dispatch(getDetails(groupId, 'members'));
            }
        }
    }).catch((error) => {
        dispatch({
            payload: {
                buttonLoading: false,
            },
            type: actionTypes.LEAVE_GROUP_MODAL_BUTTON_LOADER,
        });
        const errorFsa = {
            payload: {
                adminError: 0,
                id: groupId,
                message: error.errors[0].detail,
            },
            type: actionTypes.LEAVE_GROUP_MODAL_ERROR_MESSAGE,
        };
        if (checkForOnlyOneAdmin(error.errors)) {
            errorFsa.payload.message = 'You are the only admin in this Group. In order to leave, please appoint another Group member as admin.';
            errorFsa.payload.adminError = 1;
        }
        dispatch(errorFsa);
    });
};

export const toggleTransactionVisibility = (transactionId, type) => (dispatch) => {
    const fsa = {
        payload: {},
        type: actionTypes.TOGGLE_TRANSACTION_VISIBILITY,
    };
    let url = '';
    switch (type) {
        case 'name':
            url = `events/${transactionId}/toggleNameVisibility`;
            break;
        case 'amount':
            url = `events/${transactionId}/toggleMoneyVisibility`;
            break;
        default:
            break;
    }
    return coreApi.patch(url,
        {
            params: {
                dispatch,
                ignore401: true,
                uxCritical: true,
            },
        }).then(
            (result) => {
                if (result && !_isEmpty(result.data)) {
                    fsa.payload.data = result.data;
                    fsa.payload.transactionId = transactionId;
                    dispatch(fsa);
                }
            },
        ).catch().finally();
};

export const addFriendRequest = (user) => (dispatch) => {
    const bodyData = {
        data: {
            attributes: {
                recipient_email_id: user.friendEmail,
                recipient_user_id: Number(user.memberUserId),
                requester_avatar_link: user.currentUserAvatar,
                requester_display_name: user.currentUserDisplayName,
                requester_email_id: user.currentUserEmail,
                requester_first_name: user.currentUserFirstName,
                requester_user_id: Number(user.currentUserId),
                source: 'web',
            },
        },
    };
    const fsa = {
        payload: {
        },
        type: actionTypes.GROUP_MEMBER_UPDATE_FRIEND_STATUS,
    };
    return eventApi.post(`/friend/request`, bodyData, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then((result) => {
        if (result && !_isEmpty(result.data)) {
            fsa.payload.memberUserId = user.memberUserId;
            fsa.payload.status = 'PENDING_OUT';
            dispatch(fsa);
        }
    });
};

export const getMatchingHistory = (groupId) => (dispatch) => {
    const fsa = {
        payload: {
            groupMatchingHistory: [],
        },
        type: actionTypes.GROUP_MATCHING_HISTORY,
    };
    return coreApi.get(`/groups/${groupId}/matching_histories`, {
        params: {
            dispatch,
            ignore401: true,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && result.data) {
            fsa.payload.data = result.data;
            fsa.payload.totalMatch = result.recordCount;
            fsa.payload.pageCount = result.pageCount;
            dispatch(fsa);
        }
    }).catch().finally();
};
