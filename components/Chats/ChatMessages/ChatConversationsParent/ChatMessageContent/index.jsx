import React from 'react';

import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { timeString } from '../../../../../helpers/chat/utils';
import { placeholderUser } from '../../../../../static/images/no-data-avatar-user-profile.png';

const ChatMessageContent = ({
    msg, conversationInfo, userDetails,
}) => {
    if (msg.metadata.action && [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '8',
    ].indexOf(msg.metadata.action) >= 0) {
        return (
            <div
                key={`msg_${msg.key}`}
                className="dateTime"
            >
                {msg.message}
                <span
                    style={{
                        color: '#aaa',
                        float: 'right',
                        fontSize: 10,
                        marginBottom: 0,
                        marginRight: 0,
                    }}
                >
                    {timeString(msg.createdAtTime)}
                </span>
            </div>
        );
    } if (msg.type == 5 || msg.type === 'outbox') {
        return (
            <div className="outgoing_msg" key={`msg_${msg.key}`}>
                <div className="sent_msg">
                    <p style={{ margin: 0 }}>{msg.message}</p>
                    <div className="dateTime" style={{ textAlign: 'right' }}>{timeString(msg.createdAtTime)}</div>
                </div>
            </div>
        );
    } if (msg.type == 4 || msg.type === 'inbox') {
        return (
            <div className="incoming_msg" key={`msg_${msg.key}`}>
                <div className="incoming_msg_img">
                    <Image
                        avatar
                        src={userDetails[msg.contactIds] && userDetails[msg.contactIds].imageLink
                            ? userDetails[msg.contactIds].imageLink : placeholderUser}
                        alt=""
                    />
                </div>
                <div className="received_msg">
                    <div className="received_withd_msg">
                        {
                            conversationInfo.type === 'group'
                                ? (
                                    <div className="bold">
                                        {userDetails[msg.contactIds] && userDetails[msg.contactIds].displayName
                                            ? userDetails[msg.contactIds].displayName : 'User'
                                        }
                                    </div>
                                ) : ''
                        }
                        <p style={{ margin: 0 }}>{msg.message}</p>
                        <div className="dateTime" style={{ textAlign: 'right' }}>{timeString(msg.createdAtTime)}</div>
                    </div>
                </div>
            </div>
        );
    }
};

ChatMessageContent.defaultProps = {
    conversationInfo: {
        type: '',
    },
};

ChatMessageContent.propTypes = {
    conversationInfo: PropTypes.shape({
        type: PropTypes.string,

    }),
};

export default ChatMessageContent;
