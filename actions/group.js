import _ from 'lodash';

import coreApi from '../services/coreApi';
import graphApi from '../services/graphApi';
import { async } from 'regenerator-runtime';

export const actionTypes = {
    ACTIVITY_LIKE_STATUS: 'ACTIVITY_LIKE_STATUS',
    GET_GROUP_ACTIVITY_DETAILS: 'GET_GROUP_ACTIVITY_DETAILS',
    GET_GROUP_ADMIN_DETAILS: 'GET_GROUP_ADMIN_DETAILS',
    GET_GROUP_BENEFICIARIES: 'GET_GROUP_BENEFICIARIES',
    GET_GROUP_COMMENTS: 'GET_GROUP_COMMENTS',
    GET_GROUP_DETAILS_FROM_SLUG: 'GET_GROUP_DETAILS_FROM_SLUG',
    GET_GROUP_MEMBERS_DETAILS: 'GET_GROUP_MEMBERS_DETAILS',
    GET_GROUP_TRANSACTION_DETAILS: 'GET_GROUP_TRANSACTION_DETAILS',
    POST_NEW_ACTIVITY: 'POST_NEW_ACTIVITY',
    // COMMENT_LIKE_STATUS: 'COMMENT_LIKE_STATUS',
};

export const getGroupFromSlug = async (dispatch, slug) => {
    if (slug !== ':slug') {
        const fsa = {
            payload: {
                groupDetails: {},
            },
            type: actionTypes.GET_GROUP_DETAILS_FROM_SLUG,
        };
        await coreApi.get(`/groups/find_by_slug?load_full_profile=true`, {
            params: {
                dispatch,
                slug: [
                    slug,
                ],
                uxCritical: true,
            },
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
    } else {
        // redirect('/dashboard');
    }
};

export const getGroupMemberDetails = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupMembersDetails: {},
        },
        type: actionTypes.GET_GROUP_MEMBERS_DETAILS,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `/groups/${id}/groupMembers?page[size]=7`;
    }
    coreApi.get(newUrl, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            const memberDetails = {
                data: result.data,
                nextLink: (result.links.next) ? result.links.next : null,
            };
            fsa.payload.groupMembersDetails = memberDetails;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

export const getGroupAdminDetails = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupAdminsDetails: {},
        },
        type: actionTypes.GET_GROUP_ADMIN_DETAILS,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `/groups/${id}/groupAdmins?page[size]=7`;
    }
    coreApi.get(newUrl, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            const adminDetails = {
                data: result.data,
                nextLink: (result.links.next) ? result.links.next : null,
            };
            fsa.payload.groupAdminsDetails = adminDetails;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

export const getGroupBeneficiaries = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupBeneficiaries: {},
        },
        type: actionTypes.GET_GROUP_BENEFICIARIES,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `groups/${id}/groupBeneficiaries?page[size]=3`;
    }
    coreApi.get(newUrl, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            const beneficiariesDetails = {
                data: result.data,
                nextLink: (result.links.next) ? result.links.next : null,
            };
            fsa.payload.groupBeneficiaries = beneficiariesDetails;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

export const getTransactionDetails = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupTransactions: {},
        },
        type: actionTypes.GET_GROUP_TRANSACTION_DETAILS,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `groups/${id}/activities?filter[moneyItems]=all&page[size]=10`;
    }
    await coreApi.get(newUrl, {
        params: {
            dispatch,
            uxCritical: true,
        },
    }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            fsa.payload.groupTransactions = result;
        }
    }).catch().finally(() => {
        dispatch(fsa);
    });
};

export const getGroupActivities = async (dispatch, id, url, isPostActivity) => {
    const fsa = {
        payload: {
            groupActivities: {},
        },
        type: actionTypes.GET_GROUP_ACTIVITY_DETAILS,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `groups/${id}/activities?page[size]=10`;
    }


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
        }
    }).catch().finally(() => {
        dispatch(fsa);
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
                type: 'comments',
                attributes: {
                    comment: msg,
                    groupId: id,
                },
            },
        }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            getGroupActivities(dispatch, id, url, true);
        }
    }).catch().finally();
};

export const postComment = async (dispatch, groupId, eventId, msg) => {
    const url = `events/${eventId}/comments?page[size]=1`;
    coreApi.post(`/comments`,
        {
            data: {
                type: 'comments',
                attributes: {
                    comment: msg,
                    groupId: Number(groupId),
                    eventId: Number(eventId),
                },
            },
        }).then((result) => {
        if (result && !_.isEmpty(result.data)) {
            getCommentFromActivityId(dispatch, eventId, url, true);
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
