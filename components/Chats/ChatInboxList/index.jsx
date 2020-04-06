import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, List } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';

import { actionTypes, loadConversationMessages } from '../../../actions/chat';
import IndividualChatContact from './IndividualChatContact';
import { debounceFunction, conversationHead } from '../../../helpers/chat/utils';

class ChatInboxList extends React.Component {

    onConversationSelect = (msg) => {
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
                payload: {
                    selectedConversation: msg,
                    selectedConversationMessages: [],
                    concatMessages: false,
                },
                type: actionTypes.SELECTED_CONVERSATION_MESSAGES
            });
            dispatch({
                payload: {
                    compose: false,
                    smallerScreenSection: isSmallerScreen ? 'convMsgs' : 'convList',
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION,
            });
            dispatch(loadConversationMessages(msg, new Date().getTime(), false));
        }
    }

    onConversationSearchChange = (event) => {
        const searchValue = event.target.value;
        const {
            compose,
            groupFeeds,
            messages,
            dispatch,
            smallerScreenSection,
            userDetails,
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
                let convHead;
                if (item && item.groupId) {
                    convHead = (!_isEmpty(groupFeeds) && groupFeeds[item.groupId] && groupFeeds[item.groupId].name) ?
                        groupFeeds[item.groupId].name : "";
                }
                else {
                    if (item && item.contactIds) {
                        convHead = (!_isEmpty(userDetails) && userDetails[item.contactIds] && userDetails[item.contactIds].displayName) ?
                            userDetails[item.contactIds].displayName : "";
                    }
                }
                const lc = convHead ? convHead.toLowerCase() : "";
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
            },
        });
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
        if (compose) {
            dispatch({
                payload: {
                    compose: false,
                    smallerScreenSection,
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION,
            })
        }
        const params = { dispatch, searchValue: newList.length > 0 ? newList[0] : null };
        debounceFunction(params, 300);
    }

    renderIndividualContactList = () => {
        const {
            compose,
            filteredMessages,
            groupFeeds,
            isSmallerScreen,
            muteUserList,
            selectedConversation,
            smallerScreenSection,
            userDetails,
            userInfo,
        } = this.props;
        if (filteredMessages
            && filteredMessages.length > 0
            && (!isSmallerScreen || (smallerScreenSection === 'convList' && !compose))) {
            return filteredMessages.map((msg) => {
                const converstionInfo = conversationHead(msg, groupFeeds, muteUserList, userDetails, userInfo);
                return (
                    <IndividualChatContact
                        onConversationSelect={this.onConversationSelect}
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
