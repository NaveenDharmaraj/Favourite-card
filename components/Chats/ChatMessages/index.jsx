import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Loader } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';

import { placeholderUser } from '../../../static/images/no-data-avatar-group-chat-profile.png';
import { actionTypes, loadConversationMessages, setSelectedConversation } from '../../../actions/chat';
import ChatMessageFooter from './ChatMessageFooter';
import ChatConversationsParent from './ChatConversationsParent';
import ChatConversationHeader from './ChatConversationHeader';

class ChatMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollEffect: false,
            scrollDivCount: 0,
        };
    }

    componentDidMount() {
        const {
            selectedConversationMessages,
        } = this.props;
        if (selectedConversationMessages && this.refs.scrollParentRef) {
            this.refs.scrollParentRef.scrollTop = this.refs.scrollParentRef.scrollHeight;
        }
    }

    componentDidUpdate(prevProps) {
        const {
            conversationMessagesLoader,
            selectedConversationMessages,
        } = this.props;
        const {
            scrollEffect,
            scrollDivCount
        } = this.state;
        if (!_isEqual(this.props, prevProps)) {
            if (!_isEqual(selectedConversationMessages, prevProps.selectedConversationMessages) ||
                !_isEqual(conversationMessagesLoader, prevProps.conversationMessagesLoader)
            ) {
                if (!conversationMessagesLoader && this.refs.scrollParentRef && !scrollEffect) {
                    this.refs.scrollParentRef.scrollTop = this.refs.scrollParentRef.scrollHeight;
                }
                else if (!conversationMessagesLoader && this.refs.scrollParentRef && scrollEffect) {
                    const $messages = this.refs.scrollParentRef;
                    const $outerMessages = $messages.lastElementChild;
                    const $newMessage = $outerMessages.children[selectedConversationMessages.length - (scrollDivCount+1)];
                    const $newMessageMargin = parseInt(getComputedStyle($newMessage).marginTop) + 40;
                    const scrollDownHeight = $newMessage.offsetTop - $newMessageMargin;
                    this.refs.scrollParentRef.scrollTop = scrollDownHeight;
                    this.setState({
                        scrollEffect: false
                    })
                }

            }
        }
    }

    getFriendsListDropDownOptions = () => {
        let options = [];
        const {
            userDetails,
            userInfo,
        } = this.props;
        _forEach(userDetails, function (userDetail, userId) {
            if (userId != userInfo.id && (userDetail.displayName || userDetail.userName)) {
                options.push({
                    key: userDetail.userId,
                    text: userDetail.displayName ? userDetail.displayName : userDetail.userName,
                    value: userDetail.userId,
                    image: {
                        avatar: true,
                        src: userDetail.imageLink ? userDetail.imageLink : placeholderUser
                    }
                });
            }
        });
        return options;
    }
    handleContactSelection = (e, dropdownEl) => {
        const {
            dispatch,
            messages,
        } = this.props;
        if (dropdownEl.value.length == 1) {
            let userId = dropdownEl.value[0];
            let selectedConversation = null;
            messages && messages.length > 0 ? messages.find((msg) => {
                if (userId == msg.contactIds && !msg.groupId) {
                    return selectedConversation = msg;
                }
            }) : null;
            if (!selectedConversation || selectedConversation == null) {
                selectedConversation = { contactIds: userId };
            }
            if (selectedConversation) {
                dispatch(setSelectedConversation(selectedConversation, false));
                dispatch({
                    payload: {
                        newGroupMemberIds: dropdownEl.value
                    },
                    type: actionTypes.COMPOSE_HEADER_CONTACT_SELECTION,
                })
                dispatch(loadConversationMessages(selectedConversation, new Date().getTime()));
            }
        } else {
            //new group conversation
            dispatch(setSelectedConversation(null, false));
            dispatch({
                payload: {
                    newGroupMemberIds: dropdownEl.value
                },
                type: actionTypes.COMPOSE_HEADER_CONTACT_SELECTION,
            })
        }
    }
    handleOnscroll = (scroll) => {
        // scroll variable is used to avoid calling handleOnscroll which gets triggered in componentdidupdate calling scrollTop
        const {
            dispatch,
            endTime,
            selectedConversation,
            selectedConversationMessages,
        } = this.props;
        this.setState({ scrollEffect: true })
        if (this.refs && this.refs.scrollParentRef && this.refs.scrollParentRef.scrollTop === 0 && endTime && scroll === "scrolled") {
            this.setState({scrollDivCount: selectedConversationMessages.length})
            dispatch(loadConversationMessages(selectedConversation, endTime))
        }
    }
    renderComposeChatSection = () => {
        const {
            selectedConversation,
            newGroupMemberIds,
        } = this.props;
        return (
            <div className="mesgs-1" style={selectedConversation ? {} : { height: '60vh' }}>
                <div className="msg_history">
                    <div className="recipients">
                        <div className="lbl">
                            To
                        </div>
                        <div className="inputWraper">
                            <Dropdown
                                clearable
                                fluid
                                multiple
                                search
                                selection
                                value={newGroupMemberIds}
                                options={this.getFriendsListDropDownOptions()}
                                onChange={this.handleContactSelection}
                                placeholder='Type a name or multiple names...'
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderComposeFooter = () => {
        return (
            <Fragment>
                <ChatMessageFooter
                    refName="newConvMessageTextRef"
                />
            </Fragment>
        );
    }

    renderChatMessage = () => {
        const {
            compose,
            newGroupMemberIds,
            selectedConversation,
        } = this.props;
        if (compose) {
            return (
                <Fragment>
                    <div className="chatHeader">
                        <ChatConversationHeader
                            newGroupMemberIds={newGroupMemberIds}
                        />
                    </div>
                    <div className="chatContent">
                        {this.renderComposeChatSection()}
                    </div>
                    {(!selectedConversation && newGroupMemberIds.length > 0) &&
                        this.renderComposeFooter()
                    }
                </Fragment>

            )
        } else {

            if (_isEmpty(selectedConversation)) {
                return;
            }
            // Rendering selectedConversation Group or selectedConversation User header
            else {
                return (
                    <Fragment>
                        <ChatConversationHeader
                            newGroupMemberIds={newGroupMemberIds}
                        />
                    </Fragment>
                )
            }
        }
    }

    renderChatSectionAndFooter = () => {
        const {
            endTime,
            selectedConversation,
            selectedConversationMessages,
            userDetails,
            userInfo,
        } = this.props;
        const conversationInfo = selectedConversation && selectedConversation.conversationInfo ? selectedConversation.conversationInfo : {};
        return <Fragment>
            <div className="chatContent">
                <div
                    className="mesgs"
                    onScroll={() => {
                        if (this.refs && this.refs.scrollParentRef && this.refs.scrollParentRef.scrollTop === 0 && endTime) {
                            this.handleOnscroll("scrolled")
                        }
                    }}
                    ref="scrollParentRef"
                >
                    {this.state.scrollEffect && <div style={{ position: "relative", marginTop: 40, marginBottom: 55 }}>
                        <Loader active />
                    </div>
                    }
                    <div className="msg_history">
                        {
                            !_isEmpty(selectedConversationMessages) && <ChatConversationsParent
                                selectedConversationMessages={selectedConversationMessages}
                                conversationInfo={conversationInfo}
                                userDetails={userDetails}
                            />
                        }
                    </div>
                </div>
            </div>
            <div className="chatFooter">
                {/* if it is group and currentuser have left the group disable it*/}
                {(!(conversationInfo.type == "group"
                    && conversationInfo.info && conversationInfo.info.removedMembersId.indexOf(userInfo.id) >= 0)) &&
                    <ChatMessageFooter
                        refName="currentConvMessageTextRef"
                    />
                }
            </div>
        </Fragment>
    }

    render() {
        const {
            compose,
            conversationMessagesLoader,
            isSmallerScreen,
            messages,
            mesageListLoader,
            selectedConversation,
            smallerScreenSection,
        } = this.props;
        return (

            <Fragment>
                {(!isSmallerScreen || smallerScreenSection != "convList") && this.renderChatMessage()}
                {conversationMessagesLoader && !this.state.scrollEffect ?
                    <div style={{ height: "50vh" }}>
                        <Loader active />
                    </div> :
                    !_isEmpty(selectedConversation) && (!isSmallerScreen || smallerScreenSection != "convList") &&
                    this.renderChatSectionAndFooter()
                }
                {(!mesageListLoader && _isEmpty(messages) && !compose) &&
                  'No conversations to display. Click on compose to start new!'
                }
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        conversationMessagesLoader: state.chat.conversationMessagesLoader,
        endTime: state.chat.endTime,
        messages: state.chat.messages,
        mesageListLoader: state.chat.mesageListLoader,
        newGroupMemberIds: state.chat.newGroupMemberIds,
        smallerScreenSection: state.chat.smallerScreenSection,
        selectedConversation: state.chat.selectedConversation,
        selectedConversationMessages: state.chat.selectedConversationMessages,
        userDetails: state.chat.userDetails,
        userInfo: state.user.info,
    };
}

ChatMessages.defaultProps = {
    conversationMessagesLoader: false,
    mesageListLoader: true,
    newGroupMemberIds: [],
    selectedConversationMessages: [],
    endTime: null
}

export default connect(mapStateToProps)(ChatMessages);