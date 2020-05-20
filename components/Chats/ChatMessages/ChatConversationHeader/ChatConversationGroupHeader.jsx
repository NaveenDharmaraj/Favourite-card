import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import { List, Popup, Image, Button, Divider, Icon, Input, Modal, Dropdown, Checkbox } from 'semantic-ui-react';

import Link from '../../../shared/Link';
import { placeholderUser } from '../../../../static/images/no-data-avatar-user-profile.png';
import { placeholderGroup } from '../../../../static/images/no-data-avatar-group-chat-profile.png';
import moreIcon from '../../../../static/images/icons/ellipsis.svg';
import { getCurrentUserRoleInGroup, getBase64 } from '../../../../helpers/chat/utils';
import { storeGroupImage, handleGroupModalAction, updateSelectedConversationMuteUnmute, deleteSelectedConversation } from '../../../../actions/chat';
import ChatModal from '../../../shared/ChatModal';
import { actionTypes } from '../../../../actions/chat';


const newGroup = 'New Group';
class ChatConversationGroupHeader extends React.Component {
    constructor(props) {
        super(props);
        const {
            selectedConversation
        } = props;
        this.state = {
            buttonLoader: false,
            editGroup: false,
            groupAction: "",
            groupActionError: '',
            groupNameState: (!_isEmpty(selectedConversation) && selectedConversation.conversationInfo)
                ? selectedConversation.conversationInfo.title : newGroup,
            groupAddMemberOptions: [],
            groupAddMemberValues: [],
            groupUserName: "",
            memberSearchText: "",
            newGroupImageUrl: (!_isEmpty(selectedConversation) && selectedConversation.conversationInfo)
                && selectedConversation.conversationInfo.image ? selectedConversation.conversationInfo.image : null,
            showMoreOptions: false,
        }
    }
    componentDidUpdate(prevProps) {
        const {
            selectedConversation,
        } = this.props;

        if (!_isEqual(this.props, prevProps)) {
            if (!_isEqual(selectedConversation, prevProps.selectedConversation)) {
                this.setState({
                    groupNameState: selectedConversation && selectedConversation.conversationInfo ?
                        selectedConversation.conversationInfo.title : newGroup,
                    newGroupImageUrl: (!_isEmpty(selectedConversation) && selectedConversation.conversationInfo)
                        && selectedConversation.conversationInfo.image ? selectedConversation.conversationInfo.image : null,
                })
            }
        }
    }

    handleNewGroupEditDone = () => {
        const {
            dispatch,
        } = this.props;
        const {
            groupNameState,
            newGroupImageUrl,
        } = this.state;
        if (groupNameState.trim() != "") {
            this.setState({
                editGroup: false,
                groupNameState,
            });
            dispatch({
                payload:{
                    newGroupName: groupNameState,
                    newGroupImageUrl,
                },
                type: actionTypes.NEW_GROUP_DETAILS,
            });
        }
    }

    handleGroupImageChange = (event, conversationInfo, isForNewGroup) => {
        const {
            groupNameState,
        } = this.state;
        getBase64(event.target.files[0], (result) => {
            const data = { "data": { "type": "users", "attributes": { "file": result }, "id": (isForNewGroup ? new Date().getTime() : conversationInfo.info.id) } };
            storeGroupImage(isForNewGroup, conversationInfo, data).then(response => {
                const newImage = response.data.attributes.location;
                if (isForNewGroup) {
                    this.props.dispatch({
                        payload:{
                            newGroupName: groupNameState,
                            newGroupImageUrl: newImage,
                        },
                        type: actionTypes.NEW_GROUP_DETAILS,
                    });
                    this.setState({ groupAction: null, newGroupImageUrl: newImage });
                } else {
                    handleGroupModalAction({ groupId: this.props.selectedConversation.groupId, imageUrl: newImage }, 'UPDATE_GROUP')
                        .then(() => {
                            this.setState({ groupAction: null });
                        });
                }
            }).catch((err) => {
                if (err && err.statusCode == "413") {
                    this.setState({ groupAction: "GROUP_ACTION_ERROR", groupActionError: err.message || err.error });
                }
            });;
        });
    }
    setGroupAction = (action = null, triggeredFromPopup, additionalStateVars) => {
        let newState = { groupAction: action, memberSearchText: "", groupAddMemberOptions: [], groupAddMemberValues: [] };
        if (triggeredFromPopup) {
            newState["showMoreOptions"] = false;
        }
        if (additionalStateVars && additionalStateVars != "") {
            newState = Object.assign(newState, additionalStateVars);
        }
        this.setState(newState);
    }
    handleModalClick = (param, modalAction) => {
        const {
            dispatch,
            messages,
            selectedConversation,
        } = this.props;
        this.setState({ buttonLoader: true });
        handleGroupModalAction(param, modalAction)
            .then(() => {
                if (modalAction === "MUTE_NOTIFICATIONS" || modalAction === "UNMUTE_NOTIFICATIONS") {
                    dispatch(updateSelectedConversationMuteUnmute(selectedConversation, param.isMute));
                    this.setState({ groupAction: null });
                }
                else if (modalAction === "DELETE_GROUP") {
                    dispatch(deleteSelectedConversation(selectedConversation, messages));
                    this.setState({ groupAction: null });
                }
                else if (modalAction === "MAKE_USER_ADMIN" || modalAction === "REMOVE_ADMIN" || modalAction === "REMOVE_USER") {
                    this.setState({ buttonLoader: false, groupAction: 'MEMBERS_LIST' });
                    return;
                }
                else if (modalAction === 'MEMBER_ADD') {
                    this.setState({ groupAction: null, groupAddMemberValues: [], groupAddMemberOptions: [] });
                } else {
                    this.setState({ groupAction: null });
                }
                this.setState({ buttonLoader: false })
            })
            .catch(() => {
                this.setState({ buttonLoader: false, groupAction: null });
            });
    }
    handleGroupAddMemberChange = (e, { value }) => {
        this.setState({
            groupAddMemberValues: value,
            groupAddMemberOptions: this.state.groupAddMemberOptions.filter(function (obj) {
                return value.indexOf(obj.value) >= 0;
            })
        });
    }
    handleMemberSelectForAddition = (value, text) => {
        if (this.state.groupAddMemberValues.indexOf(value) < 0) {
            this.setState((prevState) => ({
                groupAddMemberOptions: [{ text: text, value }, ...prevState.groupAddMemberOptions],
                groupAddMemberValues: [value, ...prevState.groupAddMemberValues]
            }))
        } else {
            this.setState((prevState) => ({
                groupAddMemberOptions: prevState.groupAddMemberOptions.filter(function (obj) {
                    return obj.value != value;
                }),
                groupAddMemberValues: prevState.groupAddMemberValues.filter(function (obj) {
                    return obj != value;
                })
            }))
        }
    }
    renderGroupModal = (groupFeed, currentUserInfo, conversationInfo) => {
        const {
            groupAction,
            groupActionError,
            groupAddMemberValues,
            groupUserInfo,
            groupUserName,
            memberSearchText,
        } = this.state;
        const {
            groupFeeds,
            selectedConversation,
            userDetails,
            userInfo,
        } = this.props;
        const groupModal = !_isEmpty(selectedConversation) ? {
            "MUTE_NOTIFICATIONS": {
                header: "Mute conversation?",
                description: "You can unmute this conversation anytime.",
                param: { selectedConversation, isMute: true },
                button: 'Mute',
            },
            "UNMUTE_NOTIFICATIONS": {
                header: "Unmute conversation?",
                description: "You can mute this conversation anytime.",
                param: { selectedConversation, isMute: false },
                button: 'Unmute',
            },
            "LEAVE_GROUP": {
                header: "Leave conversation?",
                description: "You won't get messages from this group chat unless another member adds you back into the chat.",
                param: { clientGroupId: selectedConversation.groupId },
                button: 'Leave conversation',
            },
            "DELETE_GROUP": {
                header: "Delete group?",
                description: "Cannot undo this action. All the messages in this group will be deleted permanentaly.",
                param: { groupId: selectedConversation.groupId },
                button: 'Delete',
            },
            "REMOVE_GROUP_IMAGE": {
                header: "Remove group image?",
                description: "Cannot undo this action. The image of the group will be removed for all members.",
                param: { groupId: selectedConversation.groupId, imageUrl: " " },
                button: 'Remove',
            },
            "GROUP_ACTION_ERROR": {
                header: "Error uploading photo",
                description: groupActionError,
            },
            "MAKE_USER_ADMIN": {
                header: `Make ${groupUserName} group chat admin for group name?`,
                description: `As an administrator, ${groupUserName} will be able to manage all the members of this group chat.`,
                param: { clientGroupId: selectedConversation.groupId, users: groupUserInfo },
                button: 'Make group admin',
            },
            'REMOVE_ADMIN': {
                header: 'Remove admin status?',
                description: `${groupUserName} will no longer be able to manage all the members of this group chat.`,
                param: { clientGroupId: selectedConversation.groupId, users: groupUserInfo },
                button: 'Remove admin status',
            },
            'REMOVE_USER': {
                header: `Remove ${groupUserName}?`,
                description: `${groupUserName} will be removed from this conversation.`,
                param: { clientGroupId: selectedConversation.groupId, userId: this.state.userId },
                button: 'Remove',
            }
        } : null;
        switch (groupAction) {
            case 'MEMBERS_LIST': return (
                <Modal open={groupAction == 'MEMBERS_LIST'} onClose={() => this.setGroupAction(null)} size="tiny" dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                    <Modal.Header>Members</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">
                            <div className="messageSearch">
                                <Input
                                    type="text"
                                    fluid iconPosition='left'
                                    onChange={(event) => this.setState({ memberSearchText: event.target.value })}
                                    icon='search' placeholder='Search...'
                                    value={memberSearchText} />
                            </div>
                            <div className="swichAccounts mt-2 mb-2">
                                <List divided verticalAlign='middle'>
                                    {(() => {
                                        {
                                            return groupFeed.groupUsers.filter(function (user) {
                                                return memberSearchText == "" || userDetails[user.userId].displayName.toLowerCase().indexOf(memberSearchText.toLowerCase()) >= 0;
                                            }).map(user => {
                                                return (
                                                    <List.Item key={"member_" + user.userId}>
                                                        <List.Content floated='right'>
                                                            {(() => {
                                                                if (user.userId != userInfo.id) {
                                                                    return <Popup className="moreOptionPopup"
                                                                        trigger={<Button className="moreOption-btn transparent" circular>
                                                                            <Image src={moreIcon} />
                                                                        </Button>} basic position='bottom right' on='click'>
                                                                        <Popup.Content>
                                                                            <List>
                                                                                <List.Item as='a'>
                                                                                    <Link route={"/users/profile/" + user.userId}><a>View profile</a></Link></List.Item>
                                                                                {currentUserInfo.role == "1"
                                                                                    && user.role != "1" ?
                                                                                    <List.Item
                                                                                        as='a'
                                                                                        onClick={() =>
                                                                                            this.setGroupAction("MAKE_USER_ADMIN", false, {
                                                                                                groupUserInfo: [{ "userId": Number(user.userId), "role": "1" }],
                                                                                                groupUserName: userDetails[user.userId].displayName || "User"
                                                                                            })}>
                                                                                        Make group admin
                                                                                         </List.Item> : ""}
                                                                                {currentUserInfo.role == "1"
                                                                                    && user.role == "1" ?
                                                                                    <List.Item
                                                                                        as='a'
                                                                                        onClick={() => this.setGroupAction("REMOVE_ADMIN", false, {
                                                                                            groupUserInfo: [{ "userId": Number(user.userId), "role": "3" }],
                                                                                            groupUserName: userDetails[user.userId].displayName || "User"
                                                                                        })}>Remove admin status</List.Item> : ""}
                                                                                {currentUserInfo.role == "1" && user.role != "1" ? <Divider /> : ""}
                                                                                {currentUserInfo.role == "1" ?
                                                                                    <List.Item
                                                                                        as='a'
                                                                                        className="red"
                                                                                        onClick={() => this.setGroupAction("REMOVE_USER", false, {
                                                                                            userId: user.userId,
                                                                                            groupUserName: userDetails[user.userId].displayName || "User"
                                                                                        })}>
                                                                                        Remove from conversation</List.Item> : ""}
                                                                            </List>
                                                                        </Popup.Content>
                                                                    </Popup>
                                                                }
                                                            })()}
                                                        </List.Content>
                                                        <Image avatar src={(userDetails[user.userId] && userDetails[user.userId].imageLink) ? userDetails[user.userId].imageLink : placeholderUser} />
                                                        <List.Content>
                                                            <List.Header as='a'>{(userDetails[user.userId] && userDetails[user.userId].displayName)? userDetails[user.userId].displayName : "User"} {(Number(user.userId) == Number(userInfo.id) ? "(You)" : "")} {user.role == "1" ? " (Admin)" : ""}</List.Header>
                                                        </List.Content>
                                                    </List.Item>
                                                )
                                            });
                                        }
                                    })()}

                                </List>
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            );
            case 'MUTE_NOTIFICATIONS':
            case 'UNMUTE_NOTIFICATIONS':
            case 'LEAVE_GROUP':
            case 'DELETE_GROUP':
            case 'REMOVE_GROUP_IMAGE':
            case 'GROUP_ACTION_ERROR':
            case 'MAKE_USER_ADMIN':
            case 'REMOVE_ADMIN':
            case 'REMOVE_USER':
                return (
                    <ChatModal
                        buttonLoader={this.state.buttonLoader}
                        modalDetails={groupModal[groupAction]}
                        handleModalClick={this.handleModalClick}
                        modalAction={groupAction}
                        handleHideModal={this.setGroupAction}
                    />
                );
            case 'MEMBERS_ADD': return (
                <Modal size="tiny" open={groupAction == 'MEMBERS_ADD'} onClose={() => this.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                    <Modal.Header>Add members</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">
                            <div className="inputWraper">
                                <Dropdown
                                    fluid
                                    multiple
                                    onChange={this.handleGroupAddMemberChange}
                                    options={this.state.groupAddMemberOptions}
                                    placeholder='Type a name or multiple names'
                                    selection
                                    value={this.state.groupAddMemberValues}
                                />
                            </div>
                            <div className="swichAccounts mt-2 mb-2">
                                <List divided verticalAlign='middle'>
                                    {(() => {
                                        if (selectedConversation && selectedConversation.groupId) {
                                            let groupFeed = groupFeeds[selectedConversation.groupId];
                                            {
                                                return Object.keys(userDetails).map(userId => {
                                                    let user = userDetails[userId];
                                                    if (user.userId != userInfo.id && (user.displayName || user.userName) && groupFeed.membersId.indexOf(user.userId + "") < 0) {
                                                        return (<List.Item key={"member_" + user.userId}>
                                                            <List.Content floated='right' className="ui checkbox">
                                                                <Checkbox
                                                                    className="cp_chkbx"
                                                                    value={user.userId}
                                                                    onClick={(e) => this.handleMemberSelectForAddition(user.userId + "", (user.displayName || user.userName))}
                                                                    checked={groupAddMemberValues.indexOf(user.userId + "") >= 0} />
                                                            </List.Content>
                                                            <Image avatar src={userDetails[user.userId] && userDetails[user.userId].imageLink ? userDetails[user.userId].imageLink : placeholderUser} />
                                                            <List.Content>
                                                                <List.Header as='a'>{user.displayName ? user.displayName : user.userName}</List.Header>
                                                            </List.Content>
                                                        </List.Item>);
                                                    }
                                                }
                                                )
                                            }
                                        }
                                    })()}
                                    <div className="new_members">
                                        <p>New members will see all previous messages from this conversation.</p>
                                    </div>
                                </List>
                            </div>
                        </Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button
                                loading={this.state.buttonLoader}
                                disabled={this.state.buttonLoader || _isEmpty(this.state.groupAddMemberValues)}
                                className="blue-btn-rounded-def c-small"
                                onClick={() => this.handleModalClick({ "userIds": groupAddMemberValues, "clientGroupIds": [selectedConversation.groupId] }, groupAction)}
                            >
                                Add
                            </Button>
                        </div>
                    </Modal.Content>
                </Modal>

            );

            case 'VIEW_GROUP_IMAGE': return (
                <Modal
                    size="tiny"
                    open={groupAction == "VIEW_GROUP_IMAGE"}
                    onClose={() => this.setGroupAction(null)}
                    dimmer="inverted" className="chimp-modal image-modal"
                    style={{ backgroundImage: 'url(' + conversationInfo.image + ')' }}
                    closeIcon
                    centered={false}></Modal>
            );
            default:
                break;
        }
    }
    renderGroupMoreOption = (conversationInfo, currentUserInfo) => {
        if (!conversationInfo.disabled) {
            return (
                <List.Content floated='right'>
                    <Popup
                        open={this.state.showMoreOptions}
                        onClose={() => { this.setState({ showMoreOptions: false }) }}
                        className="moreOptionPopup"
                        trigger={
                            <Button
                                onClick={() => this.setState({ showMoreOptions: true })}
                                className="moreOption-btn transparent"
                                circular
                            >
                                <Image src={moreIcon} />
                            </Button>}
                        basic
                        position='bottom right'
                        on='click'>
                        <Popup.Content>
                            <List>
                                <List.Item
                                    as='a'
                                    onClick={() => this.setGroupAction('MEMBERS_LIST', true)}>
                                    See members
                                    </List.Item>
                                {
                                    currentUserInfo.role == "1" ?
                                        <List.Item
                                            as='a'
                                            onClick={() => this.setGroupAction('MEMBERS_ADD', true)}>
                                            Add members
                                        </List.Item> : ""
                                }
                                {conversationInfo.isMuted ?
                                    <List.Item
                                        as='a'
                                        onClick={() => this.setGroupAction('UNMUTE_NOTIFICATIONS', true)}>
                                        Unmute
                                    </List.Item> :
                                    <List.Item
                                        as='a'
                                        onClick={() => this.setGroupAction('MUTE_NOTIFICATIONS', true)}>
                                        Mute
                                        </List.Item>}
                                <Divider />
                                <List.Item
                                    as='a'
                                    onClick={() => this.setGroupAction('LEAVE_GROUP', true)}
                                    className="red">
                                    Leave conversation
                                    </List.Item>
                            </List>
                        </Popup.Content>
                    </Popup>
                </List.Content>)
        } else {
            return (
                <List.Content floated='right'>
                    <Popup
                        open={this.state.showMoreOptions}
                        onClose={() => { this.setState({ showMoreOptions: false }) }}
                        className="moreOptionPopup"
                        trigger={
                            <Button onClick={() => this.setState({ showMoreOptions: true })} className="moreOption-btn transparent" circular >
                                <Image src={moreIcon} />
                            </Button>
                        }
                        basic
                        position='bottom right'
                        on='click'>
                        <Popup.Content>
                            <List>
                                <List.Item
                                    as='a'
                                    onClick={() => this.setGroupAction('DELETE_GROUP', true)}
                                    className="red">Delete group</List.Item>
                            </List>
                        </Popup.Content>
                    </Popup>
                </List.Content>)
        }
    }
    renderGroupTilte = (conversationInfo) => {
        const {
            compose,
            selectedConversation
        } = this.props;
        const {
            groupNameState
        } = this.state;
        return (
            <List.Content className="grpNameEdit">
                {(() => {
                    if (this.state.editGroup) {
                        return <Fragment>
                            <Input
                                maxLength="25"
                                placeholder={compose ? 'Group Title' : 'Name this group chat'}
                                value={groupNameState}
                                onChange={(e) => { this.setState({ groupNameState: e.target.value }) }} />
                            <span className="charCount">{groupNameState.length}/25</span>
                            <Button
                                className="EditGrpName"
                                onClick={() => {
                                    compose ? this.handleNewGroupEditDone() : handleGroupModalAction({ groupId: selectedConversation.groupId, newName: groupNameState }, 'UPDATE_GROUP');
                                    this.setState({ editGroup: false });
                                }}><Icon name="check circle" /></Button>
                        </Fragment>
                    } else {
                        return (<Fragment>
                            {groupNameState}
                            {conversationInfo.disabled ? "" :
                                <Button
                                    className="EditGrpName"
                                    onClick={() => this.setState({ editGroup: true })}>
                                    <Icon name="pencil" /></Button>}</Fragment>);
                    }
                })()}
            </List.Content>
        )
    }
    renderGroupImage = (conversationInfo) => {
        const {
            compose
        } = this.props;
        const {
            newGroupImageUrl
        } = this.state;
        return (<Popup
            className="moreOptionPopup"
            open={this.state.groupAction == "IMAGE_ACTION"}
            onClose={() => this.setGroupAction(null)}
            trigger={
                <Image
                    avatar
                    src={!_isEmpty(conversationInfo) ? conversationInfo.image :
                        newGroupImageUrl ? newGroupImageUrl : placeholderGroup}
                    onClick={() => this.setGroupAction("IMAGE_ACTION")}
                />}
            basic position='bottom left' on='click'>
            <Popup.Content>
                <List>
                    {(() => {
                        if (!compose && conversationInfo.imagePresent) {
                            return (
                                <List.Item as='a' onClick={(e) => this.setGroupAction("VIEW_GROUP_IMAGE", true)}>
                                    View photo
                                </List.Item>)
                        }
                    })()}

                    {(() => {
                        if (compose || !conversationInfo.disabled) {
                            return (
                                <Fragment>
                                    <input
                                        id="myInput"
                                        accept="images/*"
                                        type="file"
                                        onChange={(event) => { this.handleGroupImageChange(event, conversationInfo, compose) }}
                                        ref={(ref) => this.upload = ref}
                                        style={{ display: 'none' }} />
                                    <List.Item
                                        as='a'
                                        onClick={(e) => this.upload.click()}>Upload photo
                                    </List.Item>
                                    {
                                        !compose && conversationInfo.imagePresent ?
                                            <List.Item
                                                as='a'
                                                onClick={(e) => this.setGroupAction("REMOVE_GROUP_IMAGE", true)}>
                                                Remove photo
                                            </List.Item> : ""}
                                </Fragment>
                            )
                        }
                    })()}
                </List>
            </Popup.Content>
        </Popup>
        );
    }
    render() {
        const {
            compose,
            groupFeeds,
            selectedConversation,
            userInfo,
        } = this.props;
        let conversationInfo;
        if (compose) {
            conversationInfo = {};
        } else if (!compose && selectedConversation) {
            conversationInfo = selectedConversation.conversationInfo;
        };
        const groupFeed = !_isEmpty(selectedConversation) ? groupFeeds[selectedConversation.groupId] : null;
        const currentUserInfo = !_isEmpty(groupFeed) ? getCurrentUserRoleInGroup(groupFeed, userInfo.id) : {};
        return (
            <div className="chatWithGroup">
                {this.state.groupAction && this.renderGroupModal(groupFeed, currentUserInfo, conversationInfo)}
                <List divided verticalAlign='middle'>
                    <List.Item>
                        {!compose && this.renderGroupMoreOption(conversationInfo, currentUserInfo)}
                        {this.renderGroupImage(conversationInfo)}
                        {this.renderGroupTilte(conversationInfo)}
                    </List.Item>
                </List>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        groupFeeds: state.chat.groupFeeds,
        messages: state.chat.messages,
        selectedConversation: state.chat.selectedConversation,
        userDetails: state.chat.userDetails,
        userInfo: state.user.info,
    };
}
export default connect(mapStateToProps)(ChatConversationGroupHeader);