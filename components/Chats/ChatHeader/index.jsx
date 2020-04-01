import React from 'react';
import {
    Grid, Header, Button, Icon,
} from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import { actionTypes } from '../../../actions/chat';
// eslint-disable-next-line react/prefer-stateless-function
class ChatHeader extends React.Component {

    handleChatHeaderBackButton = () => {
        const {
            dispatch
        } = this.props;
        dispatch({
            payload: {
                smallerScreenSection: 'convList',
            },
            type: actionTypes.COMPOSE_SCREEN_SECTION
        });
    }

    composeNew = () => {
        const {
            compose,
            dispatch,
            filteredMessages,
            selectedConversation,
        } = this.props;
        dispatch({
            payload: {
                newGroupName: "New Group",
                newGroupImageUrl: null,
            },
            type: actionTypes.NEW_GROUP_DETAILS
        });
        dispatch({
            payload: {
                compose: !compose,
                smallerScreenSection: compose ? "convList" : "convMsgs",
            },
            type: actionTypes.COMPOSE_SCREEN_SECTION
        });
        const selectCurrentConversation =
            (!compose ? null :
                (selectedConversation && selectedConversation.key ?
                    selectedConversation :
                    (filteredMessages ? filteredMessages[0] : null)));

        // COMPOSE_SELECTED_CONVERSATION is created to avoid overriding of selectedConversationMessages 
        // inside SELECTED_CONVERSATION_MESSAGES actionType
        dispatch({
            payload: {
                selectedConversation: selectCurrentConversation,
            },
            type: actionTypes.COMPOSE_SELECTED_CONVERSATION
        })
    }

    render() {
        const {
            compose,
            isSmallerScreen,
            smallerScreenSection,
        } = this.props;
        return (
            <div className="messageHeader">
                <Grid verticalAlign="middle">
                    <Grid.Row>
                        <Grid.Column mobile={8} tablet={12} computer={13}>
                            <div className="pt-1 pb-1">
                                <Header as="h2">
                                    {(isSmallerScreen && !compose && smallerScreenSection === 'convList') && (
                                        <Button
                                            className="back-btn-messages"
                                            onClick={this.handleChatHeaderBackButton}
                                            style={{ float: 'left' }}
                                        >
                                            <Icon name="chevron left" />
                                        </Button>
                                    )}
                                    Messages
                                </Header>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={8} tablet={4} computer={3} className="text-right">
                            <div className="pb-1 compose-btn-wrapper">
                                <Button
                                    className={`${compose ? ' red-btn-rounded-def red' : 'success-btn-rounded-def'}`}
                                    onClick={this.composeNew}
                                >
                                    <Icon name={compose ? 'close icon' : 'edit icon'} />
                                    {isSmallerScreen ? '' : (compose ? 'Cancel' : 'Compose')}
                                </Button>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        smallerScreenSection: state.chat.smallerScreenSection,
        selectedConversation: state.chat.selectedConversation,
        filteredMessages: state.chat.filteredMessages,
    };
}

export default connect(mapStateToProps)(ChatHeader);