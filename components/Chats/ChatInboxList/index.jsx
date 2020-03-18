import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, List } from 'semantic-ui-react';

import applozicApi from "../../../services/applozicApi";
import IndividualChatContact from './IndividualChatContact';
import { loadMuteUserList } from '../../../actions/chat';

// eslint-disable-next-line react/prefer-stateless-function
class ChatInboxList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedConversation: null,
        };
    }
    componentDidMount() {
        const {
            dispatch
        } = this.props;
        dispatch(loadMuteUserList());
    }


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
            const muteInfo = muteUserList[msg.contactIds];
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

    onConversationSelect = () => {
        console.log('onConversationSelect');
    }
    renderIndividualContactList = () => {
        const {
            filteredMessages,
            selectedConversation
        } = this.state;
        const {
            compose,
            isSmallerScreen,
            smallerScreenSection,
        } = this.props;
        if (filteredMessages
            && filteredMessages.length > 0
            && (!isSmallerScreen || (smallerScreenSection === 'convList' && !compose))) {
            return filteredMessages.map((msg) => {
                const converstionInfo = conversationHead(msg);
                return (
                <IndividualChatContact
                    onConversationSelect={onConversationSelect}
                    msg={msg}
                    selectedConversation={selectedConversation}
                    converstionInfo = {converstionInfo}
                />
            )});
        }
    }
    render() {
        const {
            compose,
            isSmallerScreen,
            messages,
            smallerScreenSection,
        } = this.props;
        const {
            filteredMessages
        } = this.state;
        return (
            <div className="messageLeftMenu">
                <div className="messageLeftSearch">
                    search....
                    {((messages && messages.length > 0) &&
                        (!isSmallerScreen || (smallerScreenSection === 'convList' && !compose)))
                        && (
                            <Input
                                fluid
                                iconPosition="left"
                                icon="search"
                                placeholder="Search..."
                            //ref="conversationSearchEl"
                            //onChange={this.onConversationSearchChange.bind(this)} 
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
    groupFeeds:state.chat.groupFeeds,
    messages: state.chat.messages,
    muteUserList: state.chat.muteUserList,
    userDetails: state.chat.userDetails,
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
