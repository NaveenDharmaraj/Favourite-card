import _keyBy from 'lodash/keyBy';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';

import utilityApi from '../services/utilityApi';
import graphApi from '../services/graphApi';
import applozicApi from '../services/applozicApi';
import { conversationHead } from '../helpers/chat/utils';
import { isFalsy } from '../helpers/utils';

const actionTypes = _keyBy([
    'LOAD_MUTE_USER_LIST',
    'LOAD_CONVERSATION_LIST',
    'INBOX_LIST_MESSAGES',
    'FETCH_USER_DETAILS',
    'COMPOSE_SCREEN_SECTION',
    'NEW_GROUP_FEEDS',
    'SELECTED_CONVERSATION_MESSAGES',
    'CURRENT_SELECTED_CONVERSATION',
    'LOAD_CONVERSATION_MESSAGES_ENDTIME',
    'COMPOSE_HEADER_CONTACT_SELECTION',
    'NEW_GROUP_DETAILS',
]);

const loadMuteUserList = () => async (dispatch) => {
    const muteUserList = {};
    await applozicApi.get('/user/chat/mute/list', {}).then((response) => {
        _forEach(response, (muteUser) => {
            muteUserList[muteUser.userId] = muteUser;
        });
        dispatch({
            payload: {
                muteUserList,
            },
            type: actionTypes.LOAD_MUTE_USER_LIST,
        });
    });
};
const loadnewUserGroupInboxMessage = async (queryParam) => {
    const result = await applozicApi.get(`/message/v2/list`, {
        params: queryParam,
    });
    return result;
};

const loadrecentMessage = (resp, msg, messagesRef, index) => (dispatch) => {
    delete resp.message.to;
    delete resp.message.type;
    resp.message.createdAtTime = resp.message.timeStamp;
    messagesRef.splice(index, 1);
    messagesRef.unshift({
        ...msg,
        ...resp.message,
    });
    dispatch({
        payload: {
            messages: messagesRef,
        },
        type: actionTypes.INBOX_LIST_MESSAGES,
    });
};

const loadInboxList = (detail, messages, userDetails, userInfo) => async (dispatch) => {
    const messagesRef = _cloneDeep(messages);
    const {
        resp,
    } = detail;
    const matchFound = (!_isEmpty(messagesRef) && messagesRef.length > 0
        && resp.message && resp.message.metadata && resp.message.metadata.action != 0)
        ? messagesRef.find((msg, index) => {
            if (!isFalsy(detail.sent) && ((msg.groupId == resp.message.to)
                || (isFalsy(msg.groupId) && (msg.contactIds == resp.message.to)))) {
                dispatch(loadrecentMessage(resp, msg, messagesRef, index));
                return true;
            }
            if (detail.received) {
                // checking group
                if (msg.groupId || resp.message.to) {
                    if (msg.groupId == resp.message.to) {
                        dispatch(loadrecentMessage(resp, msg, messagesRef, index));
                        return true;
                    }
                    return false;
                }
                // check for user
                if (msg.contactIds == resp.message.from) {
                    dispatch(loadrecentMessage(resp, msg, messagesRef, index));
                    return true;
                }
                return false;
            }
        }) : false;
    // Adding new User and new Group message
    if (!matchFound) {
        try {
            const id = !isFalsy(resp.message.to) ? resp.message.to : resp.message.from;
            const param = resp.message && resp.message.metadata
                && resp.message.metadata.action == 0 ? { groupId: id } : { userId: id };
            const { response } = await loadnewUserGroupInboxMessage(param);
            const groupFeed = response.groupFeeds && response.groupFeeds.length > 0 ?
                {
                    [id]: response.groupFeeds[0],
                } : {};
            if (!_isEmpty(response.message) && response.message.length > 0) {
                const converstionDetails = {
                    conversationInfo: !_isEmpty(response.message) ? conversationHead(response.message[0], groupFeed, null, userDetails, userInfo) : null,
                };
                const newUserMsg = Object.assign(response.message[0], converstionDetails);
                messagesRef.unshift({
                    ...newUserMsg,
                });
                dispatch({
                    payload: {
                        messages: messagesRef,
                    },
                    type: actionTypes.INBOX_LIST_MESSAGES,
                });
            }
            // eslint-disable-next-line no-empty
        } catch (error) { }
    }
};

const deleteInboxList = (detail, messages) => async (dispatch) => {
    // action 3 indicates conversation delete
    if ((detail.message && detail.message.metadata && detail.message.metadata.action == 3) || detail.type == 'APPLOZIC_27') {
        const messagesRef = _cloneDeep(messages);
        const id = !isFalsy(detail.message.to) ? detail.message.to : detail.message.from;
        const index = messagesRef.indexOf(id);
        messagesRef.splice(index, 1);
        dispatch({
            payload: {
                messages: messagesRef,
            },
            type: actionTypes.INBOX_LIST_MESSAGES,
        });
    }
};

const loadConversationMessages = (selectedConversation, endTime = new Date().getTime() + 2000) => (dispatch) => {
    if (selectedConversation) {
        const params = {
            endTime,
            pageSize: 10,
        };
        if (selectedConversation.groupId) {
            params.groupId = selectedConversation.groupId;
        } else { params.userId = selectedConversation.contactIds; }
        return applozicApi.get('/message/v2/list', { params: params }).then((response) => {
            const selectedConversationMessages = response.response.message;
            dispatch({
                payload: {
                    selectedConversationMessages,
                },
                type: actionTypes.SELECTED_CONVERSATION_MESSAGES,
            });
            const endTime = response.response.message && response.response.message.length >= 10 ?
                response.response.message[response.response.message.length - 1].createdAtTime : null;
            dispatch({
                payload: {
                    endTime
                },
                type: actionTypes.LOAD_CONVERSATION_MESSAGES_ENDTIME,
            });
            // if (concatMessages) {
            //     window.dispatchEvent(new CustomEvent("onChatPageRefreshEvent", { detail: { data: messages } }));
            // }
        })
            .catch((error) => {
                dispatch({
                    payload: {
                        selectedConversation: !_isEmpty(selectedConversation) ? selectedConversation : null,
                    },
                    type: actionTypes.CURRENT_SELECTED_CONVERSATION,
                });
            });
    }
};

const recurrsiveLoadConversation = (endTime = new Date().getTime() + 2000) => {
    return applozicApi.get('/message/v2/list', {
        params: {
            endTime,
            mainPageSize: 60,
            startIndex: 0,
        },
    });
};

/**
 * loadConversationThenBlock - recurssive calling of then block
 * @param {array} newMessgaeArr saves all the new messages from current resposne and old response from before then block
 * @return {void}
 */

// eslint-disable-next-line max-len
const loadConversationThenBlock = (response, msgId, userDetails, groupFeeds, selectedConversation, dispatch, messagesArr = [], muteUserList, userInfo) => {
    let compose = null;
    let newMessgaeArr = [];
    // dispatach the userDetails from response.response.userDetails based on graphApi userdetails
    userDetails = !_isEmpty(userDetails) ? userDetails : {};
    _forEach(response.response.userDetails, (userDetail) => {
        if (!userDetails[userDetail.userId]) {
            userDetails[userDetail.userId] = userDetail;
        }
    });
    // dispatach the groupFeeds from response.response.groupDetails
    groupFeeds = !_isEmpty(groupFeeds) ? groupFeeds : {};
    _forEach(response.response.groupFeeds, (groupFeed) => {
        groupFeeds[groupFeed.id] = groupFeed;
    });
    newMessgaeArr = messagesArr.concat(response.response.message);
    if (newMessgaeArr && newMessgaeArr.length > 0) {
        newMessgaeArr.forEach((msg) => {
            const converstionDetails = {
                conversationInfo: msg ? conversationHead(msg, groupFeeds, muteUserList, userDetails, userInfo) : null,
            };
            Object.assign(msg, converstionDetails);
        });
    }
    // select the conversation based in groupid or contact id
    if (Number(msgId) && newMessgaeArr && newMessgaeArr.length > 0) {
        newMessgaeArr.find((msg) => {
            if (msg.groupId == msgId) {
                selectedConversation = msg;
                return true;
            } if (isFalsy(msg.groupId) && msg.contactIds == msgId) {
                selectedConversation = msg;
                return true;
            }
        });
    }
    // userdetails is thr group details is thr but no message then select the msgId from url and the compose as true.
    if (_isEmpty(selectedConversation) && Number(msgId)) {
        if (userDetails[msgId]) {
            compose = true;
            // newState.newGroupMemberIds = [contactId];
            selectedConversation = userDetails[msgId];
        } else if (groupFeeds[msgId]) {
            selectedConversation = groupFeeds[msgId];
        }
    }
    // if there is no match in userDetails and groupfeeds select the defualt first message
    if (_isEmpty(selectedConversation) && newMessgaeArr && newMessgaeArr.length > 0 && msgId != 'new') {
        selectedConversation = newMessgaeArr[0];
    }
    if ((newMessgaeArr && newMessgaeArr.length <= 0) || msgId == 'new') {
        compose = true;
        selectedConversation = null;
    }
    if (!_isEmpty(response.response.message) && response.response.message.length > 0) {
        const endTime = response.response.message[response.response.message.length - 1].createdAtTime;
        recurrsiveLoadConversation(endTime)
            .then((res) => {
                loadConversationThenBlock(res, msgId, userDetails, groupFeeds, selectedConversation, dispatch, newMessgaeArr, muteUserList, userInfo);
            })
            .catch(() => {
                dispatch({
                    payload: {
                        messages: [],
                    },
                    type: actionTypes.LOAD_CONVERSATION_LIST,
                });
            });
    } else {
        dispatch({
            payload: {
                compose,
                filteredMessages: newMessgaeArr,
                groupFeeds,
                messages: newMessgaeArr,
                selectedConversation,
                userDetails,
            },
            type: actionTypes.LOAD_CONVERSATION_LIST,
        });
        dispatch(loadConversationMessages(selectedConversation, null));
    }
};
// eslint-disable-next-line max-len
const loadConversations = (msgId, userDetails = {}, groupFeeds = {}, selectedConversationParam = {}, muteUserList = {}, userId = {}) => async (dispatch) => {
    recurrsiveLoadConversation()
        .then((response) => {
            loadConversationThenBlock(response, msgId, userDetails, groupFeeds, selectedConversationParam, dispatch, [], muteUserList, userId);
        })
        .catch(() => {
            dispatch({
                payload: {
                    messages: [],
                },
                type: actionTypes.LOAD_CONVERSATION_LIST,
            });
        });
};
const loadFriendsList = (userInfo, msgId, muteUserList) => (dispatch) => {
    const pageSize = 999;
    const pageNumber = 1;
    const email = userInfo.attributes.email;
    graphApi.get(`/user/myfriends`, {
        params: {
            'page[number]': pageNumber,
            'page[size]': pageSize,
            status: 'accepted',
            userid: email,
        },
    })
        .then((result) => {
            const friendsList = result.data;
            const userDetails = {};
            _forEach(friendsList, (userDetailObj) => {
                if (userDetailObj.type == 'users') {
                    const userDetail = userDetailObj.attributes;
                    let displayName = userDetail.display_name;
                    if (!displayName) {
                        if (userDetail.first_name) {
                            displayName = userDetail.first_name + (userDetail.last_name ? userDetail.last_name : '');
                        } else {
                            displayName = 'User';
                        }
                    }
                    userDetails[Number(userDetail.user_id)] = {
                        displayName,
                        email: userDetail.email_hash,
                        imageLink: userDetail.avatar,
                        userId: userDetail.user_id,
                    };
                }
            });
            dispatch({
                payload: {
                    friendListLoaded: true,
                    userDetails,
                },
                type: actionTypes.FETCH_USER_DETAILS,
            });
            dispatch(loadConversations(msgId, userDetails, {}, null, muteUserList, userInfo));
        })
        .catch(() => {
            dispatch({
                payload: {
                    friendListLoaded: false,
                },
                type: actionTypes.FETCH_USER_DETAILS,
            });
        });
};

const setSelectedConversation = (msg) => (dispatch) => {
    dispatch({
        payload: {
            selectedConversation: msg,
        },
        type: actionTypes.CURRENT_SELECTED_CONVERSATION,
    });
};

const deleteConversation = (params) => {
    return applozicApi.get('/message/delete/conversation', {
        headers: {
            Accept: 'text/plain',
        },
        params,
    });
};

const muteOrUnmuteConversation = ({
    selectedConversation, isMute,
}) => {
    const params = {};
    params.notificationAfterTime = new Date().getTime() + (isMute ? (1000 * 60 * 60 * 24 * 365) : -5000);
    if (selectedConversation.groupId) {
        params.clientGroupId = selectedConversation.groupId;
        return applozicApi.post('/group/user/update', params);
    }
    if (selectedConversation.contactIds) {
        params.userId = selectedConversation.contactIds;
        return applozicApi.post('/user/chat/mute', null, {
            params,
        });
    }
};

const removeUserFromGroup = (params) => {
    return applozicApi.post('/group/remove/member', params);
};

const addSelectedUsersToGroup = (params) => {
    return applozicApi.post('/group/add/users', params);
};
const leaveGroup = (params) => {
    return applozicApi.post('/group/left', params);
};
const createGroup = (params) => {
    const additionalParams = {
        ...params,
        metadata: {
            ADD_MEMBER_MESSAGE: ':userName added',
            ALERT: 'false',
            CREATE_GROUP_MESSAGE: ':adminName created group',
            DELETED_GROUP_MESSAGE: ':groupName deleted',
            GROUP_ICON_CHANGE_MESSAGE: ':groupName icon changed',
            GROUP_LEFT_MESSAGE: ':userName left',
            GROUP_NAME_CHANGE_MESSAGE: 'Group renamed to :groupName',
            HIDE: 'true',
            JOIN_MEMBER_MESSAGE: ':userName joined',
            REMOVE_MEMBER_MESSAGE: ':userName removed',

        },
    };

    return applozicApi.post('/group/v2/create', additionalParams);
};
const sendMessageToSelectedConversation = (params) => {
    return applozicApi.post('/message/v2/send', params);
};
const updateGroupDetails = (params) => {
    return applozicApi.post('/group/update', params);
};
const storeGroupImage = (isForNewGroup, conversationInfo, data) => {
    return utilityApi.post(`/image/upload/${isForNewGroup ? new Date().getTime() : conversationInfo.info.id}`, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
};

const handleUserModalAction = (params, modalAction) => {
    switch (modalAction) {
        case 'MUTE':
        case 'UNMUTE':
            return muteOrUnmuteConversation(params);
        case 'DELETE':
            return deleteConversation(params);
        default:
            return null;
    }
};

const handleGroupModalAction = (params, groupAction) => {
    switch (groupAction) {
        case 'MUTE_NOTIFICATIONS':
        case 'UNMUTE_NOTIFICATIONS':
            return muteOrUnmuteConversation(params);
        case 'LEAVE_GROUP':
            return leaveGroup(params);
        case 'DELETE_GROUP':
            return deleteConversation(params);
        case 'UPDATE_GROUP':
        case 'REMOVE_GROUP_IMAGE':
        case 'MAKE_USER_ADMIN':
        case 'REMOVE_ADMIN':
            params.groupId = params.groupId;
            if (params.newName) {
                params.newName = params.newName;
            }
            if (params.imageUrl) {
                params.imageUrl = params.imageUrl;
            }
            if (params.users) {
                params.clientGroupId = params.clientGroupId;
                params.users = params.users;
            }
            return updateGroupDetails(params);
        case 'REMOVE_USER':
            return removeUserFromGroup(params);
        case 'MEMBERS_ADD':
            return addSelectedUsersToGroup(params);
        default:
            break;
    }
};
export {
    actionTypes,
    addSelectedUsersToGroup,
    createGroup,
    deleteConversation,
    deleteInboxList,
    handleGroupModalAction,
    handleUserModalAction,
    leaveGroup,
    loadConversationMessages,
    loadInboxList,
    loadMuteUserList,
    loadFriendsList,
    loadConversations,
    muteOrUnmuteConversation,
    removeUserFromGroup,
    sendMessageToSelectedConversation,
    setSelectedConversation,
    storeGroupImage,
    updateGroupDetails,
};
