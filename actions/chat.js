import _keyBy from 'lodash/keyBy';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';

import utilityApi from '../services/utilityApi';
import graphApi from '../services/graphApi';
import applozicApi from '../services/applozicApi';

const actionTypes = _keyBy([
    'LOAD_MUTE_USER_LIST',
    'LOAD_CONVERSATION_LIST',
    'EDIT_GROUP_DETAILS',
    'INBOX_FILTERED_MESSAGES',
    'FETCH_USER_DETAILS',
    'NEW_GROUP_DETAILS',
    'COMPOSE_SCREEN_SECTION',
    'NEW_GROUP_FEEDS',
    'SELECTED_CONVERSATION_MESSAGES',
    'COMPOSE_SELECTED_CONVERSATION',
    'LOAD_CONVERSATION_MESSAGES_ENDTIME',
    'COMPOSE_HEADER_CONTACT_SELECTION',
]);

const loadMuteUserList = () => (dispatch) => {
    const muteUserList = {};
    applozicApi.get('/user/chat/mute/list', {}).then((response) => {
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
const loadConversationMessages = (selectedConversation, endTime = new Date().getTime() + 2000, concatMessages = false, messages = []) => dispatch => {
    if (selectedConversation) {
        let params = { endTime: endTime, pageSize: 10 }; //{ startIndex: startIndex, mainPageSize: 100, pageSize: 50 };
        if (selectedConversation.groupId) {
            params.groupId = selectedConversation.groupId;
        } else { params.userId = selectedConversation.contactIds; }
        return applozicApi.get('/message/v2/list', { params: params }).then(response => {
            let selectedConversationMessages = response.response.message;
            dispatch({
                payload: {
                    selectedConversation: !_isEmpty(selectedConversation) ? selectedConversation : null,
                    selectedConversationMessages,
                    concatMessages,
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
            .catch(error => {
                dispatch({
                    payload: {
                        selectedConversation: !_isEmpty(selectedConversation) ? selectedConversation : null,
                        selectedConversationMessages: [],
                        concatMessages,
                    },
                    type: actionTypes.SELECTED_CONVERSATION_MESSAGES,
                });

            });
    }

};
/**
 * loadConversationThenBlock - recurssive calling of then block
 * @param {array} newMessgaeArr saves all the new messages from current resposne and old response from before then block
 * @return {void}
 */

const loadConversationThenBlock = (response, msgId, userDetails, groupFeeds, selectedConversation, dispatch, messagesArr) => {
    let compose = null;
    let newMessgaeArr = [];
    // dispatach the userDetails from response.response.userDetails based on graphApi userdetails
    _forEach(response.response.userDetails, (userDetail) => {
        if (!userDetails[userDetail.userId]) {
            userDetails[userDetail.userId] = userDetail;
        }
    });

    // dispatach the groupFeeds from response.response.groupDetails

    // can we dispatch it straightl
    _forEach(response.response.groupFeeds, (groupFeed) => {
        groupFeeds[groupFeed.id] = groupFeed;
    });
    newMessgaeArr = !_isEmpty(response.response.message) ? response.response.message : [];
    if (!_isEmpty(messagesArr) && messagesArr.length > 0) {
        if (!_isEmpty(response.response.message)) {
            newMessgaeArr = [
                ...messagesArr,
                ...response.response.message,
            ];
        } else {
            newMessgaeArr = [
                ...messagesArr,
            ];
        }
    }
    // select the conversation based in groupid or contact id
    if (msgId && newMessgaeArr && newMessgaeArr.length > 0) {
        newMessgaeArr.find((msg) => {
            if (msg.groupId === Number(msgId)) {
                msg.selected = true;
                selectedConversation = msg;
            } else if (msg.contactIds === Number(msgId)) {
                msg.selected = true;
                selectedConversation = msg;
            }
        });
    }
    // userdetails is thr group details is thr but no message then select the msgId from url and the compose as true.
    if (_isEmpty(selectedConversation) && msgId) {
        if (userDetails[msgId]) {
            compose = true;
            // newState.newGroupMemberIds = [contactId];
            selectedConversation = userDetails[msgId];
        } else if (groupFeeds[msgId]) {
            selectedConversation = groupFeeds[msgId];
        }
    }

    // if there is no match in userDetails and groupfeeds select the defualt first message
    if (_isEmpty(selectedConversation) && newMessgaeArr && newMessgaeArr.length > 0) {
        newMessgaeArr[0].selected = true;
        selectedConversation = newMessgaeArr[0];
    }
    if (newMessgaeArr && newMessgaeArr.length <= 0) {
        compose = true;
    }
    // if defautl or any msgId match are selected and its a group dispatch edit group details
    if (!_isEmpty(selectedConversation) && selectedConversation.groupId) {
        const editGroupName = (groupFeeds && groupFeeds[selectedConversation.groupId]) ? groupFeeds[selectedConversation.groupId].name : '';
        const editGroupImageUrl = (groupFeeds && groupFeeds[selectedConversation.groupId]) ? groupFeeds[selectedConversation.groupId].imageUrl : '';
        dispatch({
            payload: {
                editGroupImageUrl,
                editGroupName,
            },
            type: actionTypes.EDIT_GROUP_DETAILS,
        });
    }
    if (!_isEmpty(response.response.message) && response.response.message.length > 0) {
        const endTime = response.response.message[response.response.message.length - 1].createdAtTime;
        recurrsiveLoadConversation(endTime)
            .then((res) => {
                loadConversationThenBlock(res, msgId, userDetails, groupFeeds, selectedConversation, dispatch, newMessgaeArr);
            })
            .catch(() => (
                dispatch({
                    payload: {
                        messages: [],
                    },
                    type: actionTypes.LOAD_CONVERSATION_LIST,
                })
            ));
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
        dispatch(loadConversationMessages(selectedConversation, null, false, newMessgaeArr));
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

// eslint-disable-next-line max-len
const loadConversations = (msgId, userDetails = {}, groupFeeds = {}, selectedConversationParam = {}) => async (dispatch) => {
    recurrsiveLoadConversation()
        .then((response) => {
            //conditosn
            loadConversationThenBlock(response, msgId, userDetails, groupFeeds, selectedConversationParam, dispatch);
        })
        .catch(() => (
            dispatch({
                payload: {
                    messages: [],
                },
                type: actionTypes.LOAD_CONVERSATION_LIST,
            })
        ));
};
const loadFriendsList = (userInfo, msgId) => (dispatch) => {
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
                        userId: userDetail.user_id,
                        displayName: displayName,
                        email: userDetail.email_hash,
                        imageLink: userDetail.avatar
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
            // if (!friendsList || friendsList.length <= 0) {
            //     newState["loading"] = false;
            // }
            dispatch(loadConversations(msgId, userDetails));
        })
        .catch((error) => {
            dispatch({
                payload: {
                    friendListLoaded: false,
                    userDetails,
                },
                type: actionTypes.FETCH_USER_DETAILS,
            });
            //self.setState({ loading: false, compose: true, smallerScreenSection: 'convMsgs' });
        });
};

const deleteConversation = (params) => {
    return applozicApi.get('/message/delete/conversation', {
        params: params,
        headers: {
            'Accept': 'text/plain'
        }
    });
};

const muteOrUnmuteUserConversation = (params) => {
    return applozicApi.post('/user/chat/mute', null, {
        params,
    });
};

const muteOrUnmuteGroupConversation = (params) => {
    return applozicApi.post('/group/user/update', params);
};
const removeUserFromGroup = (groupId, userId) => {
    const params = { clientGroupId: groupId };
    params.userId = userId;
    return applozicApi.post('/group/remove/member', params);
};

const addSelectedUsersToGroup = (params) => {
    return applozicApi.post('/group/add/users', params);
};
const leaveGroup = (params) => {
    return applozicApi.post('/group/left', params);
};
const createGroup = (params) => {
    return applozicApi.post('/group/v2/create', params);
};
const sendMessageToSelectedConversation = (params) => {
    return applozicApi.post('/message/v2/send', params);
};
const updateGroupDetails = (params) => {
    return applozicApi.post('/group/update', params);
};
const storeGroupImage = (isForNewGroup, conversationInfo, data) => {
    utilityApi.post(`/image/upload/${isForNewGroup ? new Date().getTime() : conversationInfo.info.id}`, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
};
export {
    actionTypes,
    addSelectedUsersToGroup,
    createGroup,
    deleteConversation,
    leaveGroup,
    loadConversationMessages,
    loadMuteUserList,
    loadFriendsList,
    loadConversations,
    muteOrUnmuteUserConversation,
    muteOrUnmuteGroupConversation,
    removeUserFromGroup,
    sendMessageToSelectedConversation,
    storeGroupImage,
    updateGroupDetails,
};
