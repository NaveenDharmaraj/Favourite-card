import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, List } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';

import { actionTypes, loadConversationMessages, setSelectedConversation, loadInboxList, loadnewUserGroupInboxMessage, addNewChatMessage } from '../../../actions/chat';
import IndividualChatContact from './IndividualChatContact';
import { debounceFunction } from '../../../helpers/chat/utils';
import { isFalsy } from '../../../helpers/utils';

class ChatInboxList extends React.Component {
    constructor(props) {
        super(props);
        this.onMessageEvent = this.onMessageEvent.bind(this);
        this.state = {
            searchValue: "",
            filteredMessagesState: (!_isEmpty(props.messages) && props.messages.length > 0) && props.messages,
        }
    }
    componentDidMount() {
        window.addEventListener('onMessageSent', this.onMessageEvent, false);
        window.addEventListener('onMessageReceived', this.onMessageEvent, false);
    }
    componentDidUpdate(prevProps) {
        if (!_isEqual(this.props, prevProps)) {
            if (!_isEqual(this.props.messages, prevProps.messages)) {
                this.onFilterListUpdate(this.state.searchValue);
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('onMessageSent', this.onMessageEvent, false);
        window.removeEventListener('onMessageReceived', this.onMessageEvent, false);
    }
    async onMessageEvent({ detail }) {
        const {
            dispatch,
            messages,
            selectedConversation,
            userDetails,
            userInfo,
        } = this.props;
        if (detail.resp && detail.resp.message) {
            if (detail.resp.message.metadata && detail.resp.message.metadata.action && [
                //'0',
                '1',
                '2',
                '3',
                //'4',
                '5',
                '6',
                '8',
            ].indexOf(detail.resp.message.metadata.action) >= 0) {
                const param = { groupId: detail.resp.message.to };
                loadnewUserGroupInboxMessage(param)
                    .then(({ response }) => {
                        const groupId = param.groupId;
                        if (response.groupFeeds && response.groupFeeds.length > 0) {
                            const groupFeed = response.groupFeeds && response.groupFeeds.length > 0 ?
                                {
                                    [groupId]: response.groupFeeds[0],
                                } : {};
                            // 3- leave conversation
                            // 5 and 6 change title and change image
                            // these 3 action requires change in slected conversation conversation info value
                            ['3', '5', '6'].indexOf(detail.resp.message.metadata.action) >= 0 ? dispatch({
                                payload: {
                                    groupId,
                                    groupFeed,
                                    userInfo,
                                },
                                type: actionTypes.UPDATE_MESSAGES_SELECTED_CONVERSATION,
                            }) : null;
                            dispatch({
                                payload: {

                                    groupFeeds: {
                                        [groupId]: response.groupFeeds[0],
                                    }
                                },
                                type: actionTypes.NEW_GROUP_FEEDS,
                            })
                        }
                    });
            };
            // newMsg varibale find whether the incoming event is for the current select conversation
            let newMsg = false;
            if (selectedConversation) {
                if (!isFalsy(detail.sent) && ((selectedConversation.groupId == detail.resp.message.to)
                    || (isFalsy(selectedConversation.groupId) && (selectedConversation.contactIds == detail.resp.message.to)))) {
                    newMsg = true;
                }
                else {
                    // checking group
                    if (selectedConversation.groupId || detail.resp.message.to) {
                        if (selectedConversation.groupId == detail.resp.message.to) {
                            newMsg = true;
                        }
                    }
                    // check for user
                    else if(selectedConversation.contactIds == detail.resp.message.from) {
                        newMsg = true;
                    }
                }
            }
            newMsg && dispatch(addNewChatMessage(detail.resp.message));
            await dispatch(loadInboxList(detail, messages, userDetails, userInfo));
        }
    }

    onConversationSelect = (msg) => {
        const {
            dispatch,
            isSmallerScreen,
            groupFeeds,
            selectedConversation,
        } = this.props;
        //if already conversation selected and new one clicked is different then enter into this condition
        if (!selectedConversation || selectedConversation.key != msg.key) {
            dispatch(setSelectedConversation(msg));
            dispatch({
                payload: {
                    compose: false,
                    smallerScreenSection: isSmallerScreen ? 'convMsgs' : 'convList',
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION,
            });
            dispatch(loadConversationMessages(msg, new Date().getTime()));
        }
    }
    onFilterListUpdate = (searchValue) => {
        const {
            groupFeeds,
            messages,
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
        this.setState({
            filteredMessagesState: newList,
            searchValue,
        });
        return newList;
    }
    onConversationSearchChange = (event) => {
        const searchValue = event.target.value;
        const {
            compose,
            dispatch,
            smallerScreenSection,
        } = this.props;

        const newList = this.onFilterListUpdate(searchValue);
        const msg = newList.length > 0 ? newList[0] : null;
        dispatch(setSelectedConversation(msg));
        if (compose) {
            dispatch({
                payload: {
                    compose: false,
                    smallerScreenSection,
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION,
            })
        }
        const params = { dispatch, selecetedConversation: msg };
        debounceFunction(params, 300);
    }

    renderIndividualContactList = () => {
        const {
            compose,
            isSmallerScreen,
            selectedConversation,
            smallerScreenSection,
        } = this.props;
        const {
            filteredMessagesState
        } = this.state;
        if (filteredMessagesState
            && filteredMessagesState.length > 0
            && (!isSmallerScreen || (smallerScreenSection === 'convList' && !compose))) {
            return filteredMessagesState.map((msg) => {
                return (
                    <IndividualChatContact
                        onConversationSelect={this.onConversationSelect}
                        msg={msg}
                        selectedConversation={selectedConversation}
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
    userInfo: state.user.info,
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
