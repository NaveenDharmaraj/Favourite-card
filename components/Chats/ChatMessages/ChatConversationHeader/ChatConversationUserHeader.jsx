import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Link from '../../../shared/Link';
import moreIcon from '../../../../static/images/icons/ellipsis.svg';
import { handleUserModalAction, updateSelectedConversationMuteUnmute, deleteSelectedConversation } from '../../../../actions/chat';
import ChatModal from '../../../shared/ChatModal';
import { Popup, Button, Image, List } from 'semantic-ui-react';
class ChatConversationUserHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonLoader: false,
            conversationAction: "",
            showMoreOptions: false,
        }
    }

    handleModalClick = (param, modalAction) => {
        const {
            conversationAction
        } = this.state;
        const {
            dispatch,
            messages,
            selectedConversation
        } = this.props;
        this.setState({ buttonLoader: true });
        handleUserModalAction(param, modalAction)
            .then(() => {
                this.setState({ conversationAction: null });
                conversationAction !== "DELETE" ? dispatch(updateSelectedConversationMuteUnmute(selectedConversation, param.isMute))
                    : dispatch(deleteSelectedConversation(selectedConversation, messages));
                this.setState({ buttonLoader: false });
            })
            .catch(() => {
                this.setState({ buttonLoader: false, conversationAction: null });
            });
    }

    handleHideModal = () => {
        this.setState({ showMoreOptions: false, conversationAction: null });
    }
    renderUserModal = () => {
        const {
            conversationAction
        } = this.state;
        const {
            selectedConversation
        } = this.props;
        const header = conversationAction === "DELETE" ? "Delete conversation?" :
            `${conversationAction === "MUTE" ? "Mute" : "Unmute"} conversation?`;
        const description = conversationAction === "DELETE" ? "Deleting removes conversations from inbox, but no ones else’s inbox."
            : `You can  ${conversationAction === "MUTE" ? "unmute" : "mute"} this conversation anytime. `;
        const param = conversationAction === "DELETE" ? { userActionType: "DELETE", userId: selectedConversation.contactIds }
            : { selectedConversation, isMute: conversationAction === "MUTE" ? true : false };
        const button = conversationAction === "DELETE" ? "Delete" : `${conversationAction === "MUTE" ? 'Mute' : 'Unmute'}`;
        const userModalDetails = { header, description, button, param }
        return (
            <ChatModal
                buttonLoader={this.state.buttonLoader}
                modalDetails={userModalDetails}
                handleModalClick={this.handleModalClick}
                modalAction={conversationAction}
                handleHideModal={this.handleHideModal}
            />
        )
    }

    render() {
        const {
            compose,
            selectedConversation,
            userDetails
        } = this.props;
        const {
            showMoreOptions,
            conversationAction,
        } = this.state;
        const name = selectedConversation && selectedConversation.contactIds && userDetails[selectedConversation.contactIds].displayName
            ? userDetails[selectedConversation.contactIds].displayName :
            selectedConversation && selectedConversation.contactIds && userDetails[selectedConversation.contactIds].userName ?
                userDetails[selectedConversation.contactIds].userName : '';
        return (
            <Fragment>
                <div className="chatWith">
                    Message with {name}
                </div>
                {!compose && <div className="moreOption">
                    {conversationAction && this.renderUserModal()}
                    <Popup
                        open={showMoreOptions}
                        onClose={() => { this.setState({ showMoreOptions: false }) }}
                        className="moreOptionPopup" basic position='bottom right'
                        trigger={
                            <Button className="moreOption-btn transparent"
                                circular onClick={() => { this.setState({ showMoreOptions: true }) }}>
                                <Image src={moreIcon} />
                            </Button>
                        }
                        on="click"
                    >
                        <Popup.Content>
                            <List>
                                <List.Item
                                    as='a'
                                    onClick={() => { this.setState({ showMoreOptions: false }) }}>
                                    <Link route={"/users/profile/" + selectedConversation.contactIds}>
                                        <a>View profile</a></Link>
                                </List.Item>
                                {selectedConversation.conversationInfo && selectedConversation.conversationInfo.isMuted ?
                                    <List.Item
                                        as='a'
                                        onClick={() => { this.setState({ showMoreOptions: false, conversationAction: "UNMUTE" }) }}>
                                        Unmute
                                    </List.Item> :
                                    <List.Item
                                        as='a'
                                        onClick={() => { this.setState({ showMoreOptions: false, conversationAction: "MUTE" }) }}>
                                        Mute</List.Item>
                                }
                                <List.Item
                                    as='a'
                                    onClick={() => { this.setState({ showMoreOptions: false, conversationAction: "DELETE" }) }}>
                                    Delete conversation
                                </List.Item>
                            </List>
                        </Popup.Content>
                    </Popup>
                </div>
                }
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        messages: state.chat.messages,
        selectedConversation: state.chat.selectedConversation,
        userDetails: state.chat.userDetails,
    };
}
export default connect(mapStateToProps)(ChatConversationUserHeader);