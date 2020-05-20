import React from 'react';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
import { Form, Button } from 'semantic-ui-react';
import { sendMessageToSelectedConversation, createGroup } from '../../../../actions/chat';
import { connect } from 'react-redux';
import { actionTypes } from '../../../../actions/chat';
const { publicRuntimeConfig } = getConfig();
const {
    CHAT_GROUP_DEFAULT_AVATAR
} = publicRuntimeConfig;
class ChatMessageFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaContent: "",
        }
    }
    handlesendMessageToSelectedConversation = (conversation, message) => {
        //send the message
        const {
            dispatch,
            smallerScreenSection,
        } = this.props;
        if (conversation && message.replace(/(?:\r\n|\r|\n|\s)/g, '').length > 0) {
            let params = { message: message.trim().replace(/(?:\r\n|\r|\n)/g, '<br/>') };
            if (conversation.groupId) {
                params["clientGroupId"] = conversation.groupId;
            } else { params["to"] = conversation.contactIds; }
            sendMessageToSelectedConversation(params).then((resp) => {
                dispatch({
                    payload: {
                        compose: false,
                        smallerScreenSection,
                    },
                    type: actionTypes.COMPOSE_SCREEN_SECTION
                });
                this.setState({
                    textAreaContent: ""
                })
            });
        }
    }
    handlecreateGroup = (messageInfo) => {
        const {
            dispatch,
            newGroupMemberIds,
            newGroupName,
            newGroupImageUrl,
            smallerScreenSection,
        } = this.props;
        let params = {};
        params["groupName"] = newGroupName;
        params["groupMemberList"] = newGroupMemberIds,
            params["imageUrl"] = newGroupImageUrl;
        if (!params["imageUrl"] || params["imageUrl"] == "" || params["imageUrl"] == null) {
            params["imageUrl"] = CHAT_GROUP_DEFAULT_AVATAR;
        }

        createGroup(params).then(response => {
            let groupId = response.response.id;
            dispatch({
                payload: {
                    compose: false,
                    smallerScreenSection,
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION
            });
            if (messageInfo && messageInfo.send) {
                this.handlesendMessageToSelectedConversation({ groupId: groupId }, messageInfo.message);
            }
        }).catch(error => {
            // console.log(error);
            //handle loader here
        });
    }
    handleComposeMessageKeyDown = (e, newGroup = "") => {
        const {
            selectedConversation
        } = this.props;
        if (!e.shiftKey && e.key === 'Enter' && e.target.value.trim() != "") {
            if (newGroup === "newConvMessageTextRef") {
                this.handlecreateGroup({ send: true, message: e.target.value });
                return;
            }
            this.handlesendMessageToSelectedConversation(selectedConversation, e.target.value);
            this.setState({
                textAreaContent: ""
            });
        }
    };

    handleInputchange = (e) => {
        this.setState({
            textAreaContent: e.target.value
        });
    }
    onSendKeyClick = () => {
        const {
            refName,
            selectedConversation
        } = this.props;
        const {
            textAreaContent
        } = this.state;
        if (textAreaContent != "") {
            if (refName == "currentConvMessageTextRef") {
                this.handlesendMessageToSelectedConversation(selectedConversation, textAreaContent, true);
            } else if (refName == "newConvMessageTextRef") {
                this.handlecreateGroup({ send: true, message: textAreaContent });
            }
        }
    }
    render() {
        const {
            refName,
        } = this.props;
        return (
            <div className="chatFooter">
                <Form>
                    <Form.Field>
                        <textarea
                            rows="1"
                            placeholder='Type a message…'
                            onChange={(e) => this.handleInputchange(e)}
                            value={this.state.textAreaContent}
                            onKeyDown={(e) => this.handleComposeMessageKeyDown(e, refName)}>
                        </textarea>
                        <Button
                            circular
                            icon='paper plane outline'
                            className="sendMsgBtn"
                            onClick={this.onSendKeyClick}>
                        </Button>
                    </Form.Field>
                </Form>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        groupFeeds: state.chat.groupFeeds,
        newGroupImageUrl: state.chat.newGroupImageUrl,
        newGroupMemberIds: state.chat.newGroupMemberIds,
        newGroupName: state.chat.newGroupName,
        selectedConversation: state.chat.selectedConversation,
        smallerScreenSection: state.chat.smallerScreenSection,
        userDetails: state.chat.userDetails,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(ChatMessageFooter);