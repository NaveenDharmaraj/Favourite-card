/* eslint-disable import/exports-last */
import _ from 'lodash';

import coreApi from '../services/coreApi';
import graphApi from '../services/graphApi';


export const actionTypes = {
    ACTIVITY_LIKE_STATUS: 'ACTIVITY_LIKE_STATUS',
    ADMIN_PLACEHOLDER_STATUS: 'ADMIN_PLACEHOLDER_STATUS',
    GET_BENEFICIARIES_COUNT: 'GET_BENEFICIARIES_COUNT',
    GET_GROUP_ACTIVITY_DETAILS: 'GET_GROUP_ACTIVITY_DETAILS',
    GET_GROUP_ADMIN_DETAILS: 'GET_GROUP_ADMIN_DETAILS',
    GET_GROUP_BENEFICIARIES: 'GET_GROUP_BENEFICIARIES',
    GET_GROUP_COMMENTS: 'GET_GROUP_COMMENTS',
    GET_GROUP_DETAILS_FROM_SLUG: 'GET_GROUP_DETAILS_FROM_SLUG',
    GET_GROUP_GALLERY_IMAGES: 'GET_GROUP_GALLERY_IMAGES',
    GET_GROUP_MEMBERS_DETAILS: 'GET_GROUP_MEMBERS_DETAILS',
    GET_GROUP_TRANSACTION_DETAILS: 'GET_GROUP_TRANSACTION_DETAILS',
    MEMBER_PLACEHOLDER_STATUS: 'MEMBER_PLACEHOLDER_STATUS',
    PLACEHOLDER_STATUS: 'PLACEHOLDER_STATUS',
    POST_NEW_ACTIVITY: 'POST_NEW_ACTIVITY',
    REDIRECT_TO_DASHBOARD: 'REDIRECT_TO_DASHBOARD',
    // COMMENT_LIKE_STATUS: 'COMMENT_LIKE_STATUS',
    LEAVE_GROUP_MODAL_ERROR_MESSAGE: 'LEAVE_GROUP_MODAL_ERROR_MESSAGE',
    LEAVE_GROUP_MODAL_BUTTON_LOADER: 'LEAVE_GROUP_MODAL_BUTTON_LOADER',
};

export const getGroupFromSlug = async (dispatch, slug, token = null) => {
    if (slug !== ':slug') {
        const fsa = {
            payload: {
                groupDetails: {},
            },
            type: actionTypes.GET_GROUP_DETAILS_FROM_SLUG,
        };
        const galleryfsa = {
            payload: {
                galleryImages: [],
            },
            type: actionTypes.GET_GROUP_GALLERY_IMAGES,
        };
        dispatch({
            payload: {
                redirectToDashboard: false,
            },
            type: actionTypes.REDIRECT_TO_DASHBOARD,
        });
        const params = {
            dispatch,
            slug,
            uxCritical: true,
        };
        if (token !== null) {
            params.headers = {
                Authorization: `Bearer ${token}`,
            };
            console.log(params);
        }
        await coreApi.get(`/groups/find_by_slug?load_full_profile=true`, {
            params: {
                ...params,
            },
        }).then(
            (result) => {
                if (result && !_.isEmpty(result.data)) {
                    fsa.payload.groupDetails = result.data;
                    if (result.data.relationships && result.data.relationships.galleryImages) {
                        coreApi.get(result.data.relationships.galleryImages.links.related)
                            .then((galleryResult) => {
                                if (galleryResult && !_.isEmpty(galleryResult.data)) {
                                    galleryfsa.payload.galleryImages = galleryResult.data;
                                    dispatch(galleryfsa);
                                }
                            }).catch().finally();
                    }
                }
            },
        ).catch(() => {
            dispatch({
                payload: {
                    redirectToDashboard: true,
                },
                type: actionTypes.REDIRECT_TO_DASHBOARD,
            });
            return null;
        }).finally(() => {
            dispatch(fsa);
        });
    } else {
        // redirect('/dashboard');
    }
};

export const getDetails = async (dispatch, id, type, url) => {
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
            newUrl = !_.isEmpty(url) ? url : `/groups/${id}/groupMembers?page[size]=7`;
            placeholderfsa.payload.memberPlaceholder = true;
            placeholderfsa.type = actionTypes.MEMBER_PLACEHOLDER_STATUS;
            break;
        case 'admins':
            fsa.type = actionTypes.GET_GROUP_ADMIN_DETAILS;
            newUrl = !_.isEmpty(url) ? url : `/groups/${id}/groupAdmins?page[size]=7`;
            placeholderfsa.payload.adminPlaceholder = true;
            placeholderfsa.type = actionTypes.ADMIN_PLACEHOLDER_STATUS;
            break;
        case 'charitySupport':
            fsa.type = actionTypes.GET_GROUP_BENEFICIARIES;
            newUrl = !_.isEmpty(url) ? url : `groups/${id}/groupBeneficiaries?page[size]=3`;
            placeholderfsa.payload.showPlaceholder = true;
            placeholderfsa.type = actionTypes.PLACEHOLDER_STATUS;
            break;
        default:
            break;
    }
    dispatch(placeholderfsa);
    coreApi.get(newUrl, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.data = result.data;
            fsa.payload.nextLink = (result.links.next) ? result.links.next : null;
            dispatch(fsa);
        }
    }).catch().finally(() => {
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
                placeholderfsa.type = actionTypes.PLACEHOLDER_STATUS;
                break;
            default:
                break;
        }
        dispatch(placeholderfsa);
    });
};

export const getTransactionDetails = async (dispatch, id, url) => {
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
        type: actionTypes.PLACEHOLDER_STATUS,
    });
    const newUrl = !_.isEmpty(url) ? url : `groups/${id}/activities?filter[moneyItems]=all&page[size]=10`;
    await coreApi.get(newUrl, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.groupTransactions = result;
            dispatch(fsa);
        }
    }).catch().finally(() => {
        dispatch({
            payload: {
                showPlaceholder: false,
            },
            type: actionTypes.PLACEHOLDER_STATUS,
        });
    });
};

export const getGroupActivities = async (dispatch, id, url, isPostActivity) => {
    const fsa = {
        payload: {
            groupActivities: {},
        },
        type: actionTypes.GET_GROUP_ACTIVITY_DETAILS,
    };
    const newUrl = !_.isEmpty(url) ? url : `groups/${id}/activities?page[size]=10`;
    coreApi.get(newUrl, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.groupActivities = result;
            if (!isPostActivity) {
                fsa.payload.nextLink = (result.links.next) ? result.links.next : null;
            }
            fsa.payload.isPostActivity = isPostActivity ? isPostActivity : false;
            dispatch(fsa);
        }
    }).catch().finally(() => {
        dispatch({
            payload: {
                showPlaceholder: false,
            },
            type: actionTypes.PLACEHOLDER_STATUS,
        });
    });
};

export const getCommentFromActivityId = async (dispatch, id, url, isReply) => {
    const fsa = {
        payload: {
            groupComments: {},
        },
        type: actionTypes.GET_GROUP_COMMENTS,
    };

    coreApi.get(url, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.groupComments = result.data;
            fsa.payload.activityId = id;
            fsa.payload.isReply = isReply ? isReply : false;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

export const postActivity = async (dispatch, id, msg) => {
    const url = `groups/${id}/activities?page[size]=1`;
    coreApi.post(`/comments`,
        {
            data: {
                attributes: {
                    comment: msg,
                    groupId: id,
                },
                type: 'comments',
            },
        }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            getGroupActivities(dispatch, id, url, true);
        }
    }).catch().finally();
};

export const postComment = async (dispatch, groupId, eventId, msg, user) => {
    const url = `events/${eventId}/comments?page[size]=1`;
    const fsa = {
        payload: {
            groupComments: [],
        },
        type: actionTypes.GET_GROUP_COMMENTS,
    };
    coreApi.post(`/comments`,
        {
            data: {
                attributes: {
                    comment: msg,
                    eventId: Number(eventId),
                    groupId: Number(groupId),
                },
                type: 'comments',
            },
        }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
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
            fsa.payload.isReply = true;
            dispatch(fsa);
        }
    }).catch().finally();
};

export const likeActivity = async (dispatch, eventId, groupId, userId) => {
    const fsa = {
        payload: {
            activityStatus: false,
        },
        type: actionTypes.ACTIVITY_LIKE_STATUS,
    };
    graphApi.post(`core/create/commentlikes`,
        {
            data: {
                event_id: Number(eventId),
                group_id: Number(groupId),
                target: 'EVENT',
                user_id: Number(userId),
            },
        }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.activityStatus = true;
            fsa.payload.eventId = eventId;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

export const unlikeActivity = async (dispatch, eventId, groupId, userId) => {
    const fsa = {
        payload: {
            activityStatus: true,
        },
        type: actionTypes.ACTIVITY_LIKE_STATUS,
    };
    graphApi.delete(`core/delete/commentlikes/NODE`,
        {
            data: {
                filters: {
                    event_id: Number(eventId),
                    group_id: Number(groupId),
                    target: 'EVENT',
                    user_id: Number(userId),
                },
            },
        }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.activityStatus = false;
            fsa.payload.eventId = eventId;
        }
    }).catch().finally(() => {
        dispatch(fsa);
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
//         if (result && !_.isEmpty(result.data)) {
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
//         if (result && !_.isEmpty(result.data)) {
//             fsa.payload.commentStatus = false;
//         }
//     }).catch().finally(() => {
//         dispatch(fsa);
//     });
// };

export const joinGroup = async (dispatch, groupSlug) => {
    const fsa = {
        payload: {
            groupDetails: {},
        },
        type: actionTypes.GET_GROUP_DETAILS_FROM_SLUG,
    };
    await coreApi.post(`/groups/join?load_full_profile=true`, {
        slug: groupSlug,
    }).then(
        (result) => {
            if (result && !_.isEmpty(result.data)) {
                fsa.payload.groupDetails = result.data;
            }
        },
    ).catch(() => {
        // redirect('/give/error');
    }).finally(() => {
        dispatch(fsa);
    });
};

export const getGroupBeneficiariesCount = async (dispatch, url) => {
    const fsa = {
        payload: {
            groupBeneficiariesCount: {},
        },
        type: actionTypes.GET_BENEFICIARIES_COUNT,
    };
    coreApi.get(url,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.groupBeneficiariesCount = result.data;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

const checkForOnlyOneAdmin = (error) => {
    if (!_.isEmpty(error) && error.length === 1) {
        const checkForAdminError = error[0];
        if (!_.isEmpty(checkForAdminError.meta)
            && !_.isEmpty(checkForAdminError.meta.validationCode)
            && (checkForAdminError.meta.validationCode === '1329'
            || checkForAdminError.meta.validationCode === 1329)) {
            return true;
        }
    }
    return false;
};

export const leaveGroup = async (dispatch, slug, groupId) => {
    dispatch({
        payload: { buttonLoading: true },
        type: actionTypes.LEAVE_GROUP_MODAL_BUTTON_LOADER,
    });
    coreApi.patch(`/groups/leave?slug=${slug}`, {
    }).then((result) => {
        if (result && result.status === 'SUCCESS') {
            getGroupFromSlug(dispatch, slug);
            dispatch({
                payload: {
                    buttonLoading: false,
                    closeModal: true,
                },
                type: actionTypes.LEAVE_GROUP_MODAL_BUTTON_LOADER,
            });
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
