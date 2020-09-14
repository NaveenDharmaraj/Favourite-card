import React from 'react';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
import { Form, Button } from 'semantic-ui-react';
import { sendMessageToSelectedConversation, createGroup } from '../../../../actions/chat';
import { connect } from 'react-redux';
import { actionTypes } from '../../../../actions/chat';
import FormValidationErrorMessage from '../../../shared/FormValidationErrorMessage';
const { publicRuntimeConfig } = getConfig();
const {
    CHAT_GROUP_DEFAULT_AVATAR
} = publicRuntimeConfig;
class ChatMessageFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaContent: "",
            disableButton: false,
            profaineObj: {},
            profaineErrorCheck: false
        }
    }

    componentDidMount() {
        fetch('../../../../static/profanity/restrictWords.txt')
            .then(res => {
                res.text().then(response => {
                    const profaineArr = response.split(",");
                    const profaine = {};
                    profaineArr.forEach((arr, i) => {
                        const key = arr.trim();
                        profaine[key] = i;
                    })
                    this.setState({
                        profaineObj: profaine,
                    })
                });
            });
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
                    textAreaContent: "",
                    disableButton: false,
                })
            })
            .catch(()=>{
                this.setState({
                    disableButton: false,
                }) 
            })
            this.setState({
                disableButton: true,
            })
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
        const {
            profaineObj,
        } = this.state;
        if (!e.shiftKey && e.key === 'Enter' && e.target.value.trim() != "") {
            e.preventDefault();
            const strArr = e.target.value.split(" ");
            let profaineCheck = strArr.find(str => {
                if (!_isEmpty(str) && profaineObj[str.toLowerCase()]) {
                    return true;
                }
            });
            if (!profaineCheck) {
                if (newGroup === "newConvMessageTextRef") {
                    this.handlecreateGroup({ send: true, message: e.target.value });
                    return;
                }
                this.handlesendMessageToSelectedConversation(selectedConversation, e.target.value);
                this.setState({
                    textAreaContent: ""
                });
            } else {
                this.setState({
                    disableButton: true,
                    profaineErrorCheck: true

                })
            }

        }
    };

    handleInputchange = (e) => {
        this.setState({
            disableButton: false,
            profaineErrorCheck: false,
            textAreaContent: e.target.value,
        });
    }
    onSendKeyClick = () => {
        const {
            refName,
            selectedConversation
        } = this.props;
        const {
            textAreaContent,
            profaineObj
        } = this.state;

        if (textAreaContent != "") {
            const strArr = textAreaContent.split(" ");
            let profaineCheck = strArr.find(str => {
                if (profaineObj[str]) {
                    return true;
                }
            });
            if (!profaineCheck) {
                if (refName == "currentConvMessageTextRef") {
                    this.handlesendMessageToSelectedConversation(selectedConversation, textAreaContent, true);
                } else if (refName == "newConvMessageTextRef") {
                    this.handlecreateGroup({ send: true, message: textAreaContent });
                }
            } else {
                this.setState({
                    disableButton: true,
                    profaineErrorCheck: true,
                })
            }
        }

    }
    render() {
        const {
            refName,
        } = this.props;
        const {
            profaineErrorCheck,
        } = this.state;
        return (
            <div className="chatFooter">
                <Form>
                    <Form.Field  error={profaineErrorCheck}>
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
                            onClick={this.onSendKeyClick}
                            disabled={this.state.disableButton}
                        >
                        </Button>
                    </Form.Field>
                    <FormValidationErrorMessage
                        condition={profaineErrorCheck}
                        errorMessage={"Please avoid using profane words"}
                    />
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