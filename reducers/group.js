import _ from 'lodash';
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
            if (state.groupMembersDetails && state.groupMembersDetails.data) {
                newState = {
                    ...state,
                    groupMembersDetails: {
                        ...state.groupMembersDetails,
                        data: state.groupMembersDetails.data.concat(action.payload.data),
                        nextLink: action.payload.nextLink,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupMembersDetails: {
                        ...state.groupMembersDetails,
                        data: action.payload.data,
                        nextLink: action.payload.nextLink,
                    },
                };
            }
            break;
        case 'GET_GROUP_ADMIN_DETAILS':
            if (state.groupAdminsDetails && state.groupAdminsDetails.data) {
                newState = {
                    ...state,
                    groupAdminsDetails: {
                        ...state.groupAdminsDetails,
                        data: state.groupAdminsDetails.data.concat(action.payload.data),
                        nextLink: action.payload.nextLink,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupAdminsDetails: {
                        ...state.groupAdminsDetails,
                        data: action.payload.data,
                        nextLink: action.payload.nextLink,
                    },
                };
            }
            break;
        case 'GET_GROUP_BENEFICIARIES':
            if (state.groupBeneficiaries && state.groupBeneficiaries.data) {
                newState = {
                    ...state,
                    groupBeneficiaries: {
                        ...state.groupBeneficiaries,
                        data: state.groupBeneficiaries.data.concat(action.payload.data),
                        nextLink: action.payload.nextLink,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupBeneficiaries: {
                        ...state.groupBeneficiaries,
                        data: action.payload.data,
                        nextLink: action.payload.nextLink,
                    },
                };
            }
            break;
        case 'GET_GROUP_TRANSACTION_DETAILS':
            newState = {
                ...state,
                groupTransactions: Object.assign({}, state.groupTransactions, action.payload.groupTransactions),
            };
            break;
        case 'GET_GROUP_ACTIVITY_DETAILS':
            if (!action.payload.isPostActivity && state.groupActivities && state.groupActivities.data) {
                const data = state.groupActivities.data.concat(action.payload.groupActivities.data);
                newState = {
                    ...state,
                    groupActivities: {
                        ...state.groupActivities,
                        data: _.uniqBy(data,
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
                            data: _.uniqBy(data,
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
                        // groupActivities: Object.assign({}, state.groupActivities, action.payload.groupActivities),
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
                    // groupActivities: Object.assign({}, state.groupActivities, action.payload.groupActivities),
                    loadComments: false,
                };
            }
            break;
        case 'GET_GROUP_COMMENTS':
            if (action.payload.isReply) {
                if (state.groupComments && state.groupComments[action.payload.activityId]) {
                    newState = {
                        ...state,
                        groupComments : {
                            ...state.groupComments,
                            [action.payload.activityId]: action.payload.groupComments.concat(state.groupComments[action.payload.activityId]),
                            loadComments: true,
    
                        },
                    };
                } else {
                    newState = {
                        ...state,
                        groupComments: {
                            ...state.groupComments,
                            [action.payload.activityId]: action.payload.groupComments,
                            loadComments: true,
                        },
                    };
                }
            } else {
                newState = {
                    ...state,
                    groupComments: {
                        ...state.groupComments,
                        [action.payload.activityId]: action.payload.groupComments,
                        loadComments: true,
                    },
    
                };
            }
            break;
        case 'ACTIVITY_LIKE_STATUS':
            const activityIndex = _.findIndex(state.groupActivities.data, (data) => data.id === action.payload.eventId);
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
        case 'REDIRECT_TO_DASHBOARD':
            newState = {
                ...state,
                redirectToDashboard: action.payload.redirectToDashboard,
            };
            break;
        case 'PLACEHOLDER_STATUS':
            newState = {
                ...state,
                showPlaceholder: action.payload.showPlaceholder,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default group;
