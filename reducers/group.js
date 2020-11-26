import _uniqBy from 'lodash/uniqBy';
import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';

const group = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_GROUP_DETAILS_FROM_SLUG':
            newState = {
                ...state,
                groupDetails: Object.assign({}, state.groupDetails, action.payload.groupDetails),
            };
            break;
        case 'GET_GROUP_MEMBERS_DETAILS':
            newState = {
                ...state,
                groupMembersDetails: {
                    ...state.groupMembersDetails,
                    data: action.payload.data,
                    pageCount: action.payload.pageCount,
                    totalCount: action.payload.totalCount,
                },
            };
            break;
        case 'GET_GROUP_ADMIN_DETAILS':
            newState = {
                ...state,
                groupAdminsDetails: {
                    ...state.groupAdminsDetails,
                    data: action.payload.data,
                    totalCount: action.payload.totalCount,
                },
            };
            break;
        case 'GET_GROUP_BENEFICIARIES':
            newState = {
                ...state,
                groupBeneficiaries: {
                    ...state.groupBeneficiaries,
                    data: action.payload.data,
                },
            };
            break;
        case 'GET_GROUP_TRANSACTION_DETAILS':
            newState = {
                ...state,
                groupTransactions: Object.assign({}, action.payload.groupTransactions),
            };
            break;
        case 'GET_GROUP_ACTIVITY_DETAILS':
            if (!action.payload.isPostActivity && state.groupActivities && state.groupActivities.data) {
                const data = state.groupActivities.data.concat(action.payload.groupActivities.data);
                newState = {
                    ...state,
                    groupActivities: {
                        ...state.groupActivities,
                        data: _uniqBy(data,
                            (e) => {
                                return e.id;
                            }),
                        nextLink: action.payload.nextLink,
                    },
                    loadComments: false,
                };
            } else if (action.payload.isPostActivity) {
                if (state.groupActivities && state.groupActivities.data) {
                    const data = action.payload.groupActivities.data.concat(state.groupActivities.data);
                    newState = {
                        ...state,
                        groupActivities: {
                            ...state.groupActivities,
                            data: _uniqBy(data,
                                (e) => {
                                    return e.id;
                                }),
                        },
                        loadComments: false,
                    };
                } else {
                    newState = {
                        ...state,
                        groupActivities: {
                            ...state.groupActivities,
                            data: action.payload.groupActivities.data,
                            nextLink: action.payload.nextLink,
                        },
                        loadComments: false,
                    };
                }
            } else {
                newState = {
                    ...state,
                    groupActivities: {
                        ...state.groupActivities,
                        data: action.payload.groupActivities.data,
                        nextLink: action.payload.nextLink,
                    },
                    loadComments: false,
                };
            }
            break;
        case 'POST_NEW_COMMENT':
            const groupActivityIndex = _findIndex(state.groupActivities.data, (data) => data.id === action.payload.activityId);
            const activityArray = state.groupActivities.data;
            activityArray[groupActivityIndex].attributes.commentsCount++;
            if (state.groupComments && state.groupComments[action.payload.activityId]) {
                newState = {
                    ...state,
                    groupActivities: {
                        ...state.groupActivities,
                        data: activityArray,
                    },
                    groupComments: {
                        ...state.groupComments,
                        [action.payload.activityId]: action.payload.groupComments.concat(state.groupComments[action.payload.activityId]),
                        loadComments: true,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupActivities: {
                        ...state.groupActivities,
                        data: activityArray,
                    },
                    groupComments: {
                        ...state.groupComments,
                        [action.payload.activityId]: action.payload.groupComments,
                        loadComments: true,
                    },
                };
            }
            break;
        case 'GET_GROUP_COMMENTS':
            newState = {
                ...state,
                groupComments: {
                    ...state.groupComments,
                    [action.payload.activityId]: action.payload.groupComments,
                    loadComments: true,
                },

            };
            break;
        case 'ACTIVITY_LIKE_STATUS':
            const activityIndex = _findIndex(state.groupActivities.data, (data) => data.id === action.payload.eventId);
            const dataArray = state.groupActivities.data;
            dataArray[activityIndex].attributes.isLiked = action.payload.activityStatus;
            if (action.payload.activityStatus) {
                dataArray[activityIndex].attributes.likesCount++;
            } else {
                dataArray[activityIndex].attributes.likesCount--;
            }
            newState = {
                ...state,
                disableLike: {
                    ...state.disableLike,
                    [action.payload.eventId]: false,
                },
                groupActivities: {
                    ...state.groupActivities,
                    data: dataArray,
                },
            };
            break;

        case 'DISABLE_LIKE_BUTTON':
            newState = {
                ...state,
                disableLike: {
                    ...state.disableLike,
                    [action.payload.id]: true,
                },
            };
            break;

            // TODO after Api changes
            // case 'COMMENT_LIKE_STATUS':
            //     newState = {
            //         ...state,
            //         groupComments: {
            //             ...state.groupComments,
            //         },
            //     };
            //     break;

        case 'SAVE_FOLLOW_STATUS_GROUP':
            newState = {
                ...state,
                // disableFollow: false,
                groupDetails: {
                    ...state.groupDetails,
                    attributes: {
                        ...state.groupDetails.attributes,
                        liked: action.payload.followStatus,
                    },
                },
            };
            break;
        case 'GROUP_REDIRECT_TO_DASHBOARD':
            newState = {
                ...state,
                redirectToDashboard: action.payload.redirectToDashboard,
            };
            break;
        case 'GROUP_PLACEHOLDER_STATUS':
            newState = {
                ...state,
                showPlaceholder: action.payload.showPlaceholder,
            };
            break;
        case 'ADMIN_PLACEHOLDER_STATUS':
            newState = {
                ...state,
                adminsLoader: action.payload.adminPlaceholder,
            };
            break;
        case 'MEMBER_PLACEHOLDER_STATUS':
            newState = {
                ...state,
                membersLoader: action.payload.memberPlaceholder,
            };
            break;
        case 'GET_GROUP_GALLERY_IMAGES':
            newState = {
                ...state,
                galleryImageData: action.payload.galleryImages,
            };
            break;
        case 'GET_BENEFICIARIES_COUNT':
            newState = {
                ...state,
                beneficiariesCount: action.payload.groupBeneficiariesCount,
            };
            break;
        case 'LEAVE_GROUP_MODAL_ERROR_MESSAGE':
            newState = {
                ...state,
                errorMessage: action.payload,
            };
            break;
        case 'LEAVE_GROUP_MODAL_BUTTON_LOADER':
            newState = {
                ...state,
                closeLeaveModal: action.payload.closeModal,
                leaveButtonLoader: action.payload.buttonLoading,
            };
            break;
        case 'RESET_GROUP_STATES':
            newState = {};
            break;
        case 'TOGGLE_TRANSACTION_VISIBILITY':
            const transactionIndex = _findIndex(state.groupTransactions.data, (data) => data.id === action.payload.transactionId);
            const transactionArray = state.groupTransactions.data;
            transactionArray[transactionIndex] = action.payload.data;
            if (state.groupActivities && !_isEmpty(state.groupActivities.data)) {
                const NewActivityIndex = _findIndex(state.groupActivities.data, (data) => data.id === action.payload.transactionId);
                const NewActivityArray = state.groupActivities.data;
                NewActivityArray[NewActivityIndex] = action.payload.data;
                newState = {
                    ...state,
                    groupActivities: {
                        ...state.groupActivities,
                        data: NewActivityArray,
                    },
                    groupTransactions: {
                        ...state.groupTransactions,
                        data: transactionArray,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupTransactions: {
                        ...state.groupTransactions,
                        data: transactionArray,
                    },
                };
            }
            break;
        case 'GROUP_REDIRECT_TO_ERROR_PAGE':
            newState = {
                ...state,
                redirectToPrivateGroupErrorPage: action.payload.redirectToErrorPage,
            };
            break;
        case 'GET_GROUP_TAB_INDEX':
            newState = {
                ...state,
                activeIndex: action.payload.activeIndex,
            };
            break;
        case 'GET_GROUP_TAB_OFFSET':
            newState = {
                ...state,
                scrollOffset: action.payload.scrollOffset,
            };
            break;
        case 'GROUP_MEMBER_UPDATE_FRIEND_STATUS':
            const friendIndex = _findIndex(state.groupMembersDetails.data, (data) => data.id === action.payload.memberUserId);
            const memberArray = state.groupMembersDetails.data;
            memberArray[friendIndex].attributes.friendStatus = action.payload.status;
            newState = {
                ...state,
                groupMembersDetails: {
                    ...state.groupMembersDetails,
                    data: memberArray,
                },
            };
            break;
        case 'CHARITY_SUPPORT_PLACEHOLDER_STATUS':
            newState = {
                ...state,
                charityLoader: action.payload.showPlaceholder,
            };
            break;
        case 'GROUP_MATCHING_HISTORY':
            newState = {
                ...state,
                groupMatchingHistory: {
                    ...state.groupMatchingHistory,
                    data: action.payload.data,
                    pageCount: action.payload.pageCount,
                    totalMatch: action.payload.totalMatch,
                },
            };
            break;
        default:
            break;
    }
    return newState;
};

export default group;
