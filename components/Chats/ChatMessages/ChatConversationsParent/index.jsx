import React, { Fragment } from 'react';

import { groupMessagesByDate } from '../../../../helpers/chat/utils';

import ChatMessageContent from './ChatMessageContent';

function ChatConversationsFooter({
    conversationInfo,
    selectedConversationMessages,
    userDetails,
}) {
    const msgsByDate = groupMessagesByDate(selectedConversationMessages);

    function renderChatConversation() {
        const conversationArr = [];
        Object.keys(msgsByDate).map((dateString) => {
            const msgs = msgsByDate[dateString];
            conversationArr.push(
                <Fragment key={`date_${dateString}`}>
                    <div className="dateTime">{dateString}</div>
                    {msgs.map((msg) => (
                        <ChatMessageContent
                            msg={msg}
                            conversationInfo={conversationInfo}
                            userDetails={userDetails}
                        />
                    ))}
                </Fragment>,
            );
        });
        return conversationArr;
    }
    return (
        renderChatConversation()
    );
}
export default React.memo(ChatConversationsFooter);
