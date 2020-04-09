import React, { Fragment } from 'react';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { List, Input, Button, Icon, Dropdown, Popup, Divider, Image, Modal, Checkbox, Form } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';

import utilityApi from '../../../services/utilityApi';
import applozicApi from '../../../services/applozicApi';
import { actionTypes, loadConversations, loadMuteUserList, deleteConversation, muteOrUnmuteUserConversation, muteOrUnmuteGroupConversation, removeUserFromGroup, addSelectedUsersToGroup, leaveGroup, createGroup, sendMessageToSelectedConversation, loadConversationMessages } from '../../../actions/chat';
import moreIcon from '../../../static/images/icons/ellipsis.svg';
import { getBase64, groupMessagesByDate, timeString, conversationHead } from '../../../helpers/chat/utils';
import { placeholderGroup } from '../../../static/images/no-data-avatar-group-chat-profile.png';
import { placeholderUser } from '../../../static/images/no-data-avatar-user-profile.png';
import Link from '../../shared/Link';
const { publicRuntimeConfig } = getConfig();
const {
    CHAT_GROUP_DEFAULT_AVATAR
} = publicRuntimeConfig;


// splitting the chat header based on compose flag
class ChatMessages extends React.Component {
  
    render() {
        return (

            <Fragment>
               Chat Message
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        concatMessages: state.chat.concatMessages,
        editGroupName: state.chat.editGroupName,
        editGroupImageUrl: state.chat.editGroupImageUrl,
        endTime: state.chat.endTime,
        groupFeeds: state.chat.groupFeeds,
        messages: state.chat.messages,
        muteUserList: state.chat.muteUserList,
        newGroupName: state.chat.newGroupName,
        newGroupMemberIds: state.chat.newGroupMemberIds,
        newGroupImageUrl: state.chat.newGroupImageUrl,
        smallerScreenSection: state.chat.smallerScreenSection,
        selectedConversation: state.chat.selectedConversation,
        selectedConversationMessages: state.chat.selectedConversationMessages,
        userDetails: state.chat.userDetails,
        userInfo: state.user.info,
    };
}

ChatMessages.defaultProps = {
    newGroupMemberIds: [],
    selectedConversationMessages: [],
    endTime: null
}

export default connect(mapStateToProps)(ChatMessages);