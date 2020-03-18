import React from 'react';
import {
    List, Image, Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { timeString } from '../../../../helpers/chat/utils';

// eslint-disable-next-line react/prefer-stateless-function
class IndividualChatContact extends React.Component {

    render() {
        const {
            converstionInfo,
            onConversationSelect,
            msg,
            selectedConversation,
        } = this.props;
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
                        {converstionInfo.isMuted && <Icon name="mute" />}
                    </div>
                </List.Content>
                <Image avatar src={(converstionInfo && converstionInfo.image) && (converstionInfo.image)} />
                <List.Content>
                    <List.Header as="a">
                        <span className={converstionInfo.info.unreadCount > 0 ? 'newMessage' : ''}>
                            {(converstionInfo && converstionInfo.title) && converstionInfo.title}
                        </span>
                    </List.Header>
                    <List.Description>{msg.message}</List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

IndividualChatContact.defaultProps = {
    converstionInfo: {
        info: {
            unreadCount: null,
        },
    },
    msg: {
        createdAtTime: null,
        key: '',
        message: '',
    },
    onConversationSelect: () => {},
    selectedConversation: {
        key: '',
    },
};

IndividualChatContact.propTypes = {
    converstionInfo: PropTypes.shape({

        image: PropTypes.string,
        info: PropTypes.shape({
            unreadCount: PropTypes.number,
        }),
        isMuted: PropTypes.bool,
        title: PropTypes.string,
    }),
    msg: PropTypes.shape({
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
