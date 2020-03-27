import _isEmpty from 'lodash/isEmpty';

import { actionTypes } from '../actions/chat';

const chat = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case actionTypes.COMPOSE_SCREEN_SECTION:
            if ((typeof action.payload.compose === 'boolean') && !_isEmpty(action.payload.smallerScreenSection)) {
                return {
                    ...state,
                    compose: action.payload.compose,
                    smallerScreenSection: action.payload.smallerScreenSection,
                };
            } if (action.payload.compose === 'undefined') {
                return {
                    ...state,
                    smallerScreenSection: action.payload.smallerScreenSection,
                };
            } if (_isEmpty(action.payload.smallerScreenSection)) {
                return {
                    ...state,
                    compose: action.payload.compose,
                };
            }
            break;
        case actionTypes.NEW_GROUP_DETAILS:
            if (_isEmpty(action.payload.newGroupImageUrl) && _isEmpty(action.payload.newGroupName)) {
                newState = {
                    ...state,
                    newGroupMemberIds: action.payload.newGroupMemberIds,
                };
            } else if (_isEmpty(action.payload.newGroupMemberIds) && _isEmpty(action.payload.newGroupName)) {
                newState = {
                    ...state,
                    newGroupImageUrl: action.payload.newGroupImageUrl,
                };
            } else {
                newState = {
                    ...state,
                    newGroupImageUrl: action.payload.newGroupImageUrl,
                    newGroupMemberIds: action.payload.newGroupMemberIds,
                    newGroupName: action.payload.newGroupName,
                };
            }
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
        case actionTypes.LOAD_CONVERSATION_LIST:
            newState = {
                ...state,
                compose: action.payload.compose ? action.payload.compose : null,
                filteredMessages: action.payload.filteredMessages,
                groupFeeds: action.payload.groupFeeds,
                messages: action.payload.messages,
                selectedConversation: action.payload.selectedConversation,
                userDetails: action.payload.userDetails,
            };
            break;
        case actionTypes.EDIT_GROUP_DETAILS:
            if (!_isEmpty(action.payload.editGroupName) && !_isEmpty(action.payload.editGroupImageUrl)) {
                return {
                    ...state,
                    editGroupImageUrl: action.payload.editGroupImageUrl,
                    editGroupName: action.payload.editGroupName,
                };
            }
            if (_isEmpty(action.payload.editGroupName)) {
                return {
                    ...state,
                    editGroupImageUrl: action.payload.editGroupImageUrl,
                };
            }
            newState = {
                ...state,
                editGroupName: action.payload.editGroupName,
            };
            break;
        case actionTypes.INBOX_FILTERED_MESSAGES:
            newState = {
                ...state,
                filteredMessages: action.payload.filteredMessages,
                selectedConversation: action.payload.selectedConversation,
            };
            break;
        case actionTypes.CURRENT_SELECTED_CONVERSATION:
            newState = {
                ...state,
                selectedConversation: action.payload.selectedConversation,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default chat;
