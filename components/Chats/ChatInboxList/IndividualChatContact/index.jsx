import React from 'react';
import {
    List, Image, Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { timeString } from '../../../../helpers/chat/utils';

const IndividualChatContact = ({
    onConversationSelect,
    msg,
    selectedConversation,
}) => {
    const {
        conversationInfo,
    } = msg;
    return (
        <List.Item
            as="a"
            active={selectedConversation && msg.key === selectedConversation.key}
            key={`head_${msg.key}`}
            onClick={() => onConversationSelect(msg)}
        >
            <List.Content floated="right">
                <div className="time">
                    {timeString(msg.createdAtTime, true)}
                </div>
                <div className="iconWraper">
                    {conversationInfo.isMuted && <Icon name="mute" />}
                </div>
            </List.Content>
            <Image avatar src={(conversationInfo && conversationInfo.image) && (conversationInfo.image)} />
            <List.Content>
                <List.Header as="a">
                    <span className={conversationInfo.info.unreadCount > 0 ? 'newMessage' : ''}>
                        {(conversationInfo && conversationInfo.title) && conversationInfo.title}
                    </span>
                </List.Header>
                <List.Description>{msg.message}</List.Description>
            </List.Content>
        </List.Item>
    );
};

IndividualChatContact.defaultProps = {
    msg: {
        conversationInfo: {
            image: '',
            imagePresent: false,
            info: {},
            isMuted: false,
            title: '',
            type: '',
        },
        createdAtTime: null,
        key: '',
        message: '',
    },
    onConversationSelect: () => { },
    selectedConversation: {
 
        key: '',
    },
};

IndividualChatContact.propTypes = {
    msg: PropTypes.shape({
        conversationInfo: PropTypes.shape({
            image: PropTypes.string,
            imagePresent: PropTypes.bool,
            info: PropTypes.shape({
                unreadCount: PropTypes.number,
            }),
            isMuted: PropTypes.bool,
            title: PropTypes.string,
            type: PropTypes.string,
        }),
        createdAtTime: PropTypes.number,
        key: PropTypes.string,
        message: PropTypes.string,
    }),
    onConversationSelect: PropTypes.func,
    selectedConversation: PropTypes.shape({
        key: PropTypes.string,
    }),
};

export default IndividualChatContact;
