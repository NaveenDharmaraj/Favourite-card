import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, List } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import { actionTypes } from '../../../actions/chat';
import { placeholderGroup } from '../../../static/images/no-data-avatar-group-chat-profile.png';
import { placeholderUser } from '../../../static/images/no-data-avatar-user-profile.png';
import IndividualChatContact from './IndividualChatContact';
const { publicRuntimeConfig } = getConfig();
const {
    CHAT_GROUP_DEFAULT_AVATAR
} = publicRuntimeConfig;
class ChatInboxList extends React.Component {


    conversationHead = (msg) => {
        const {
            groupFeeds,
            muteUserList,
            userDetails,
            userInfo,
        } = this.props;
        let currentUserId = userInfo.id;
        if (msg.groupId) {
            let info = groupFeeds[msg.groupId];
            let groupHead = {
                type: "group",
                title: info.name,
                image: (info.imageUrl ? info.imageUrl : placeholderGroup),
                imagePresent: (info.imageUrl && info.imageUrl != "" && info.imageUrl != null && info.imageUrl != CHAT_GROUP_DEFAULT_AVATAR ? true : false),
                isMuted: (info.notificationAfterTime && info.notificationAfterTime > new Date().getTime()), info: info
            };
            groupHead["disabled"] = (info.removedMembersId && info.removedMembersId.indexOf(currentUserId) >= 0);
            return groupHead;
        } else {
            let info = userDetails[msg.contactIds];
            const muteInfo = !_isEmpty(muteUserList) ? muteUserList[msg.contactIds] : {};
            let convHead = info ? {
                type: 'user',
                title: info['displayName'],
                image: (info.imageLink ? info.imageLink : placeholderUser),
                imagePresent: (info.imageLink && info.imageLink != "" && info.imageLink != null ? true : false),
                info: info,
                isMuted: (muteInfo && muteInfo.notificationAfterTime && muteInfo.notificationAfterTime > new Date().getTime())
            } : {};
            return convHead;
        }
    }

    onConversationSelect = (msg) => {
        // console.log(msg);
        const {
            dispatch,
            isSmallerScreen,
            groupFeeds,
            selectedConversation,
        } = this.props;
        //if already conversation selected and new one clicked is different then enter into this condition
        if (!selectedConversation || selectedConversation.key != msg.key) {
            if (msg.groupId) {
                dispatch({
                    payload: {
                        editGroupName: groupFeeds[msg.groupId]["name"],
                        editGroupImageUrl: groupFeeds[msg.groupId]["imageUrl"],
                    },
                    type: actionTypes.EDIT_GROUP_DETAILS,
                })
            }
            dispatch({
                payload:{
                    selectedConversation: msg, 
                    selectedConversationMessages: [], 
                },
                type: actionTypes.CURRENT_SELECTED_CONVERSATION
            })
            dispatch({
                payload:{
                    compose: false,
                    smallerScreenSection: 'convMsgs',
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION,
            })
            //////????????this.loadConversationMessages(msg, new Date().getTime(), true);
        } else if (isSmallerScreen && !this.loading) {
            dispatch({
                payload:{
                    smallerScreenSection: 'convMsgs',
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION,
            })
            //????????this.loadConversationMessages(msg, new Date().getTime(), true);
        }
    }

    onConversationSearchChange = (event) => {
        const searchValue = event.target.value;
        const {
            groupFeeds,
            messages,
            dispatch,
        } = this.props;
        // Variable to hold the original version of the list
        let currentList = [];
        // Variable to hold the filtered list before putting into state
        let newList = [];

        // If the search bar isn't empty
        if (!_isEmpty(searchValue)) {
            // Assign the original list to currentList
            currentList = [...messages];

            // Use .filter() to determine which items should be displayed
            // based on the search terms
            newList = currentList.filter(item => {
                // change current item to lowercase
                const convHead = this.conversationHead(item);
                const lc = convHead && convHead.title ? convHead.title.toLowerCase() : "";
                // change search term to lowercase
                const filter = searchValue.toLowerCase();
                // check to see if the current list item includes the search term
                // If it does, it will be added to newList. Using lowercase eliminates
                // issues with capitalization in search terms and search content
                return lc.includes(filter);
            });
        } else {
            // If the search bar is empty, set newList to original task list
            newList = [...messages];
        }
        dispatch({
            type: actionTypes.INBOX_FILTERED_MESSAGES,
            payload: {
                filteredMessages: newList,
                selectedConversation: newList.length > 0 ? newList[0] : null
            },
        });
        // let selectedConversationMessages = [];
        // Set the filtered state based on what our rules added to newList
        let tempSelectedConversation = newList.length > 0 ? newList[0] : null
        if (tempSelectedConversation && tempSelectedConversation.groupId) {
            dispatch({
                type: actionTypes.EDIT_GROUP_DETAILS,
                payload: {
                    editGroupName: groupFeeds[tempSelectedConversation.groupId]["name"],
                    editGroupImageUrl: groupFeeds[tempSelectedConversation.groupId]["imageUrl"],
                }
            })
        }
        this.loadConversationMessages(newList.length > 0 ? newList[0] : null, new Date().getTime(), true);
    }

    loadConversationMessages = () => {
        console.log('loadConversationMessages')
    }

    renderIndividualContactList = () => {

        const {
            compose,
            filteredMessages,
            isSmallerScreen,
            selectedConversation,
            smallerScreenSection,
        } = this.props;
        if (filteredMessages
            && filteredMessages.length > 0
            && (!isSmallerScreen || (smallerScreenSection === 'convList' && !compose))) {
            return filteredMessages.map((msg) => {
                const converstionInfo = this.conversationHead(msg);
                return (
                    <IndividualChatContact
                        onConversationSelect={() => this.onConversationSelect(msg)}
                        msg={msg}
                        selectedConversation={selectedConversation}
                        converstionInfo={converstionInfo}
                    />
                )
            });
        }
    }
    render() {
        const {
            compose,
            isSmallerScreen,
            messages,
            smallerScreenSection,
        } = this.props;
        return (
            <div className="messageLeftMenu">
                <div className="messageLeftSearch">
                    {((messages && messages.length > 0) &&
                        (!isSmallerScreen || (smallerScreenSection === 'convList' && !compose)))
                        && (
                            <Input
                                fluid
                                iconPosition="left"
                                icon="search"
                                placeholder="Search..."
                                onChange={(e) => this.onConversationSearchChange(e)}
                            />
                        )
                    }
                </div>
                <div className="chatList">
                    <List divided verticalAlign="middle">
                        {
                            this.renderIndividualContactList()
                        }
                    </List>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    compose: state.chat.compose,
    smallerScreenSection: state.chat.smallerScreenSection,
    userDetails: state.chat.userDetails,
    groupFeeds: state.chat.groupFeeds,
    messages: state.chat.messages,
    selectedConversation: state.chat.selectedConversation,
    filteredMessages: state.chat.filteredMessages,
    muteUserList: state.chat.muteUserList,
});

ChatInboxList.defaultProps = {
    messages: [],
};

ChatInboxList.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            message: PropTypes.string,
        }),
    ),
};

export default connect(mapStateToProps)(ChatInboxList);
