import _isEmpty from 'lodash/isEmpty';
import _uniqBy from 'lodash/uniqBy';
import _cloneDeep from 'lodash/cloneDeep';

import { actionTypes } from '../actions/chat';
import { conversationHead } from '../helpers/chat/utils';
import { isFalsy } from '../helpers/utils';

const chat = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case actionTypes.COMPOSE_SCREEN_SECTION:
            newState = {
                ...state,
                compose: action.payload.compose,
                ...(action.payload.smallerScreenSection && { smallerScreenSection: action.payload.smallerScreenSection }),
            };
            break;
        case actionTypes.COMPOSE_HEADER_CONTACT_SELECTION:
            newState = {
                ...state,
                newGroupMemberIds: action.payload.newGroupMemberIds,
            };
            break;
        case actionTypes.NEW_GROUP_DETAILS:
            newState = {
                ...state,
                newGroupImageUrl: action.payload.newGroupImageUrl,
                newGroupName: action.payload.newGroupName,
            };
            break;
        case actionTypes.LOAD_MUTE_USER_LIST:
            newState = {
                ...state,
                muteUserList: action.payload.muteUserList,
            };
            break;
        case actionTypes.FETCH_USER_DETAILS:
            newState = {
                ...state,
                friendListLoaded: action.payload.friendListLoaded,
                userDetails: action.payload.userDetails,
            };
            break;
        case actionTypes.CONVERSATION_MESSAGE_LOADER:
            newState = {
                ...state,
                conversationMessagesLoader: action.payload.conversationMessagesLoader,
            };
            break;
        case actionTypes.LOAD_CONVERSATION_LIST:
            newState = {
                ...state,
                compose: action.payload.compose ? action.payload.compose : null,
                groupFeeds: action.payload.groupFeeds,
                mesageListLoader: action.payload.mesageListLoader,
                messages: action.payload.messages,
                selectedConversation: action.payload.selectedConversation,
                userDetails: action.payload.userDetails,
            };
            break;
        case actionTypes.NEW_GROUP_FEEDS:
            const groupFeedsClone = _cloneDeep(state.groupFeeds);
            const groupdetail = action.payload.groupFeeds;
            newState = {
                ...state,
                groupFeeds: (!_isEmpty(groupFeedsClone)
                    && Object.keys(groupFeedsClone).length > 0) ? {
                        ...groupFeedsClone,
                        ...groupdetail,
                    } : action.payload.groupFeeds,
            };
            break;
        case actionTypes.INBOX_LIST_MESSAGES:
            newState = {
                ...state,
                messages: action.payload.messages,
            };
            break;
        case actionTypes.SELECTED_CONVERSATION_MESSAGES:
            let paginatedSelectedConversationMessages = action.payload.selectedConversationMessages;
            if (!_isEmpty(state.selectedConversationMessages) && state.selectedConversationMessages.length > 0) {
                paginatedSelectedConversationMessages = action.payload.selectedConversationMessages.concat(state.selectedConversationMessages);
            }
            newState = {
                ...state,
                selectedConversationMessages: _uniqBy(paginatedSelectedConversationMessages, 'key'),
            };
            break;
        case actionTypes.CURRENT_SELECTED_CONVERSATION:
            const msgUpdate = _cloneDeep(state.messages);
            const {
                selectedConversation,
            } = action.payload;
            if (!isFalsy(selectedConversation) && selectedConversation.conversationInfo && selectedConversation.conversationInfo.info.unreadCount != 0) {
                msgUpdate.find((msg) => {
                    if ((selectedConversation.groupId || msg.groupId)) {
                        if (selectedConversation.groupId == msg.groupId) {
                            msg.conversationInfo.info.unreadCount = 0;
                            return true;
                        }
                        return false;
                    } if (selectedConversation.contactIds == msg.contactIds) {
                        msg.conversationInfo.info.unreadCount = 0;
                        return true;
                    }
                });
            }

            return {
                ...state,
                messages: [...msgUpdate],
                selectedConversation: action.payload.selectedConversation,
                selectedConversationMessages: [],
            };
        case actionTypes.UPDATE_MESSAGES_SELECTED_CONVERSATION:
            const messagesUpdate = _cloneDeep(state.messages);
            const selectedConversationUpdate = _cloneDeep(state.selectedConversation);
            messagesUpdate.find((msg) => {
                if (msg.groupId) {
                    if (msg.groupId == action.payload.groupId) {
                        const conversationInfo = {
                            conversationInfo: conversationHead(msg, action.payload.groupFeed, null, null, action.payload.userInfo),
                        };
                        Object.assign(msg, conversationInfo);
                        if (selectedConversationUpdate.groupId == action.payload.groupId) {
                            Object.assign(selectedConversationUpdate, conversationInfo);
                        }
                        return true;
                    }
                }
            });
            return {
                ...state,
                messages: [
                    ...messagesUpdate,
                ],
                selectedConversation: selectedConversationUpdate,
            };
        case actionTypes.UPDATE_MESSAGES_SELECTED_CONVERSATION_MUTE_UNMUTE:
            const messagesMuteUnmuteUpdate = _cloneDeep(state.messages);
            messagesMuteUnmuteUpdate.find((msg) => {
                if (msg.groupId || action.payload.selectedConversation.groupId) {
                    if (msg.groupId == action.payload.selectedConversation.groupId) {
                        Object.assign(msg, action.payload.selectedConversation);
                        return true;
                    }
                    return false;
                }
                if (msg.contactIds == action.payload.selectedConversation.contactIds) {
                    Object.assign(msg, action.payload.selectedConversation);
                    return true;
                }
            });
            return {
                ...state,
                messages: [
                    ...messagesMuteUnmuteUpdate,
                ],
                selectedConversation: action.payload.selectedConversation,
            };
        case actionTypes.DELETE_SELECTED_CONVERSATION:
            return {
                ...state,
                messages: [
                    ...action.payload.messagesDelete,
                ],
            };
        case actionTypes.NEW_CHAT_MESSAGE:
            const selectedConversationMessagesArray = _cloneDeep(state.selectedConversationMessages) || [];
            const selectedConversationClone = _cloneDeep(state.selectedConversation) || {};
            const {
                msgDetail,
            } = action.payload;
            if (selectedConversationClone) {
                if ((selectedConversationClone.groupId && (selectedConversationClone.groupId == msgDetail.to))
                    || (isFalsy(selectedConversationClone.groupId) && (selectedConversationClone.contactIds == msgDetail.to || selectedConversationClone.contactIds == msgDetail.from))
                ) {
                    selectedConversationClone.createdAtTime = msgDetail.timeStamp;
                    if (selectedConversationClone.groupId == msgDetail.to) {
                        msgDetail.contactIds = msgDetail.from;
                    }
                    const msgAdded = Object.assign(selectedConversationClone, msgDetail);
                    selectedConversationMessagesArray.unshift(msgAdded);
                    return {
                        ...state,
                        selectedConversationMessages: [...selectedConversationMessagesArray],
                    };
                }
            }
            return {
                ...state,
            };
        case actionTypes.LOAD_CONVERSATION_MESSAGES_ENDTIME:
            return {
                ...state,
                endTime: action.payload.endTime,
            };
        case 'CHAT_MESSAGE_ID':
            newState = {
                ...state,
                currentMsgId: action.payload.msgId,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default chat;
