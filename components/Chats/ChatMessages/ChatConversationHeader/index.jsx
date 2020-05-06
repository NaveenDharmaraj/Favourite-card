import React from 'react';
import { connect } from 'react-redux';

import { isFalsy } from '../../../../helpers/utils';
import ChatConversationUserHeader from './ChatConversationUserHeader';
import ChatConversationGroupHeader from './ChatConversationGroupHeader';

class ChatConversationHeader extends React.Component {

    renderHeader = () => {
        const {
            compose,
            newGroupMemberIds,
            selectedConversation,
        } = this.props;
        if (compose && newGroupMemberIds && newGroupMemberIds.length <= 0) {
            return <div className="chatWith">New Message</div>
        }
        else if ((selectedConversation  && isFalsy(selectedConversation.groupId)) || newGroupMemberIds && newGroupMemberIds.length == 1) {
            return <ChatConversationUserHeader />
        }
        else {
            return <ChatConversationGroupHeader />
        }
    }
    render() {
        return (
            <div className="chatHeader">
                {this.renderHeader()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        newGroupMemberIds: state.chat.newGroupMemberIds,
        selectedConversation: state.chat.selectedConversation,
    };
}
export default connect(mapStateToProps)(ChatConversationHeader);
