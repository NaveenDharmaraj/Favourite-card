import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { List, Input, Button, Icon, Dropdown, Popup, Divider, Image, Modal, Checkbox, Form } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';

import { actionTypes, loadConversations, loadMuteUserList, deleteConversation, muteOrUnmuteUserConversation, muteOrUnmuteGroupConversation, removeUserFromGroup, addSelectedUsersToGroup, leaveGroup, loadConversationMessages, updateGroupDetails, setSelectedConversation, storeGroupImage } from '../../../actions/chat';
import moreIcon from '../../../static/images/icons/ellipsis.svg';
import { getBase64, getCurrentUserRoleInGroup } from '../../../helpers/chat/utils';
import { placeholderGroup } from '../../../static/images/no-data-avatar-group-chat-profile.png';
import { placeholderUser } from '../../../static/images/no-data-avatar-user-profile.png';
import Link from '../../shared/Link';
import ChatMessageFooter from './ChatMessageFooter';
import ChatConversationsParent from './ChatConversationsParent';

const newGroup = 'New Group';
class ChatMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editGroup: false,
            groupNameState: newGroup,
            groupAction: "",
            groupActionError: '',
            groupUserName: "",
            groupUserInfo: [],
            groupAddMemberOptions: [],
            groupAddMemberValues: [],
            memberSearchText: "",
            newGroupImageUrl: null,
            showMoreOptions: false,
            searchQuery: '',
            scrollEffect: false,
        };
    }

    componentDidUpdate(prevProps) {
        const {
            selectedConversation,
            selectedConversationMessages,
        } = this.props;
        const {
            scrollEffect
        } = this.state;
        if (!_isEqual(this.props, prevProps)) {
            if (!_isEqual(selectedConversation, prevProps.selectedConversation)) {
                this.setState({
                    groupNameState: selectedConversation && selectedConversation.conversationInfo ?
                        selectedConversation.conversationInfo.title : newGroup,
                })
            }
            if (!_isEqual(selectedConversationMessages, prevProps.selectedConversationMessages)) {
                if (this.refs.scrollParentRef && !scrollEffect) {
                    this.refs.scrollParentRef.scrollTop = this.refs.scrollParentRef.scrollHeight;
                }
                else if (this.refs.scrollParentRef && scrollEffect) {
                    this.refs.scrollParentRef.scrollTop = 60;
                    this.setState({
                        scrollEffect: false
                    })
                }

            }
        }
    }

    handleNewGroupEditDone = () => {
        const {
            groupNameState,
        } = this.state;
        if (groupNameState.trim() != "") {
            this.setState({
                editGroup: false,
                groupNameState,
            });
        }
    }
   

    setShowMoreOptions = () => {
        this.setState({ showMoreOptions: true });
    }
    getFriendsListDropDownOptions = () => {
        let options = [];
        const {
            userDetails,
            userInfo,
        } = this.props;
        _forEach(userDetails, function (userDetail, userId) {
            if (userId != userInfo.id && (userDetail.displayName || userDetail.userName)) {
                options.push({
                    key: userDetail.userId,
                    text: userDetail.displayName ? userDetail.displayName : userDetail.userName,
                    value: userDetail.userId,
                    image: {
                        avatar: true,
                        src: userDetail.imageLink ? userDetail.imageLink : placeholderUser
                    }
                });
            }
        });
        return options;
    }
    setGroupAction = (action, triggeredFromPopup, additionalStateVars) => {
        let newState = { groupAction: action, memberSearchText: "", groupAddMemberOptions: [], groupAddMemberValues: [] };
        if (triggeredFromPopup) {
            newState["showMoreOptions"] = false;
        }
        if (additionalStateVars && additionalStateVars != "") {
            newState = Object.assign(newState, additionalStateVars);
        }
        this.setState(newState);
    }


    handleUpdateGroupDetails = (groupId, usersInfo, groupInfo, resetActionVar) => {
        const {
            dispatch,
            groupFeeds,
            userDetails,
            selectedConversation,
        } = this.props;
        const {
            groupNameState
        } = this.state;
        let params = { groupId: groupId };
        let currentGroupInfo = groupFeeds[groupId];
        if (!currentGroupInfo || currentGroupInfo.name != groupNameState) {
            params["newName"] = groupNameState;
        }
        //dispatching editimageurl happens in onGroupImageChange function
        if (!currentGroupInfo || (groupInfo && currentGroupInfo.imageUrl != groupInfo['imageLink'])) {
            params["imageUrl"] = groupInfo['imageLink'];
        }
        if (groupInfo && groupInfo['imageLink'] != undefined && groupInfo["imageLink"] != null) {
            params['imageUrl'] = groupInfo['imageLink'];
        }
        //editing userinfo inside groupfeeds 
        if (usersInfo) {
            params = { clientGroupId: groupId };
            params["users"] = usersInfo;
        }
        updateGroupDetails(params).then(() => {
            if (resetActionVar) {
                this.setGroupAction(null);
            }
            dispatch(loadConversations(groupId, userDetails, groupFeeds, selectedConversation));
        });
    }

    onGroupImageChange = (event, conversationInfo, isForNewGroup) => {
        getBase64(event.target.files[0], (result) => {
            const data = { "data": { "type": "users", "attributes": { "file": result }, "id": (isForNewGroup ? new Date().getTime() : conversationInfo.info.id) } };
            storeGroupImage(isForNewGroup, conversationInfo, data).then(response => {
                const newImage = response.data.attributes.location;
                if (isForNewGroup) {
                    this.setState({ groupAction: null, newGroupImageUrl: newImage });
                } else {
                    this.handleUpdateGroupDetails(conversationInfo.info.id, false, { imageLink: newImage });
                    this.setState({ groupAction: null });
                }
            }).catch((err) => {
                if (err && err.statusCode == "413") {
                    this.setState({ groupAction: null, groupActionError: err.message || err.error });
                }
            });;
        });
    }

    muteOrUnmuteConversation = (conversationInfo, isMute) => {
        const params = {};
        const {
            dispatch,
            groupFeeds,
            selectedConversation,
            userDetails
        } = this.props;
        //Mute Set to 365 Days | Unmute sets past time T-5 secs
        params["notificationAfterTime"] = new Date().getTime() + (isMute ? (1000 * 60 * 60 * 24 * 365) : -5000);
        if (conversationInfo.groupId) {
            params["clientGroupId"] = conversationInfo.groupId;
            muteOrUnmuteGroupConversation(params)
                .then(response => {
                    this.setState({ conversationAction: null, groupAction: null });
                    dispatch(loadMuteUserList());
                    dispatch(loadConversations(conversationInfo.groupId, userDetails, groupFeeds, selectedConversation));
                });
        } else if (conversationInfo.contactIds) {
            params["userId"] = conversationInfo.contactIds;
            // applozicApi.post("/user/chat/mute?userId=" + params.userId + "&notificationAfterTime=" + params.notificationAfterTime, params)
            muteOrUnmuteUserConversation(params)
                .then(response => {
                    this.setState({ conversationAction: null, groupAction: null });
                    //this.loadConversations(false, null, conversationInfo.contactIds);
                    dispatch(loadMuteUserList());
                });
        }
    }
    onMemberSelectForAddition = (value, text) => {
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
    handleGroupAddMemberChange = (e, { value }) => {
        this.setState({
            groupAddMemberValues: value,
            groupAddMemberOptions: this.state.groupAddMemberOptions.filter(function (obj) {
                return value.indexOf(obj.value) >= 0;
            })
        });
    }


    handleaddSelectedUsersToGroup = (groupId) => {
        const {
            dispatch,
            userDetails,
            groupFeeds,
            selectedConversation
        } = this.props;
        const {
            groupAddMemberValues
        } = this.state;
        const params = { "userIds": groupAddMemberValues, "clientGroupIds": [groupId] };
        addSelectedUsersToGroup(params)
            .then(() => {
                dispatch(loadConversations(groupId, userDetails, groupFeeds, selectedConversation));
                this.setState({ groupAddMemberValues: [], groupAddMemberOptions: [], groupAction: null });
            });
    }
    handleremoveUserFromGroup = (groupId, userId) => {
        const {
            dispatch,
            userDetails,
            groupFeeds,
        } = this.props;
        removeUserFromGroup(groupId, userId)
            .then(() => {
                this.setGroupAction(null);
                dispatch(loadConversations(groupId, userDetails, groupFeeds));
            });
    }

    handledeleteConversation = (params) => {
        const {
            dispatch,
            userDetails,
            groupFeeds,
        } = this.props;
        deleteConversation(params)
            .then(() => {
                this.setState({ groupAction: null, conversationAction: null });
                dispatch(loadConversations(null, userDetails, groupFeeds, null));
            }).catch(error => {
                this.setState({ groupAction: null, conversationAction: null });
                //??????????his.loadConversations();
            });

    }

    handleleaveGroup = (groupId) => {
        const {
            dispatch,
            groupFeeds,
            selectedConversation,
            userDetails,
        } = this.props;
        let params = { clientGroupId: groupId };
        leaveGroup(params).then(() => {
            this.setGroupAction(null);
            dispatch(loadConversations(groupId, userDetails, groupFeeds, selectedConversation));
        });
    }
    handleContactSelection = (e, dropdownEl) => {
        const {
            dispatch,
            messages,
        } = this.props;
        if (dropdownEl.value.length == 1) {
            //open selected contact's conversation
            let userId = dropdownEl.value[0];
            let selectedConversation = null;
            messages.find((msg) => {
                if (userId == msg.contactIds && !msg.groupId) {
                    return selectedConversation = msg;
                }
            });
            if (!selectedConversation || selectedConversation == null) {
                selectedConversation = { contactIds: userId };
            }
            if (selectedConversation) {
                dispatch(setSelectedConversation(selectedConversation));
                dispatch({
                    payload: {
                        newGroupMemberIds: dropdownEl.value
                    },
                    type: actionTypes.COMPOSE_HEADER_CONTACT_SELECTION,
                })
                dispatch(loadConversationMessages(selectedConversation, new Date().getTime()));
            }
        } else {
            //new group conversation
            dispatch(setSelectedConversation(null));
            this.setState({
                groupNameState: newGroup,
            })
            dispatch({
                payload: {
                    newGroupMemberIds: dropdownEl.value
                },
                type: actionTypes.COMPOSE_HEADER_CONTACT_SELECTION,
            })
        }
    }
    handleOnscroll = (scroll) => {
        // scroll variable is used to avoid calling handleOnscroll which gets triggered in componentdidupdate calling scrollTop
        const {
            dispatch,
            endTime,
            selectedConversation,
        } = this.props;
        this.setState({ scrollEffect: true })
        if (this.refs && this.refs.scrollParentRef && this.refs.scrollParentRef.scrollTop === 0 && endTime && scroll === "scrolled") {
            dispatch(loadConversationMessages(selectedConversation, endTime))
        }
    }
    renderChatSectionCompose = () => {
        const {
            selectedConversation,
            newGroupMemberIds,
        } = this.props;
        return (
            <div className="mesgs-1" style={selectedConversation ? {} : { height: '60vh' }}>
                <div className="msg_history">
                    <div className="recipients">
                        <div className="lbl">
                            To
                        </div>
                        <div className="inputWraper">
                            <Dropdown
                                clearable
                                fluid
                                multiple
                                search
                                selection
                                value={newGroupMemberIds}
                                options={this.getFriendsListDropDownOptions()}
                                onChange={this.handleContactSelection}
                                placeholder='Type a name or multiple names...'
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderComposeFooter = () => {
        const {
            groupNameState,
            newGroupImageUrl,
        } = this.state;
        return (
            <Fragment>
                <ChatMessageFooter
                    refName="newConvMessageTextRef"
                    newGroupImageUrl={newGroupImageUrl}
                    newGroupName={groupNameState}
                />
            </Fragment>
        );
    }
    renderGroupImage = (conversationInfo) => {
        return (<Popup
            className="moreOptionPopup"
            open={this.state.groupAction == "IMAGE_ACTION"}
            onClose={() => this.setGroupAction(null)}
            trigger={<Image avatar src={conversationInfo.image} onClick={() => this.setGroupAction("IMAGE_ACTION")} />}
            basic position='bottom left' on='click'>
            <Popup.Content>
                <List>
                    {(() => {
                        if (conversationInfo.imagePresent) {
                            return (
                                <List.Item as='a' onClick={(e) => this.setGroupAction("VIEW_GROUP_IMAGE", true)}>
                                    View photo
                                </List.Item>)
                        }
                    })()}

                    {(() => {
                        if (!conversationInfo.disabled) {
                            return (
                                <Fragment>
                                    <input
                                        id="myInput"
                                        accept="images/*"
                                        type="file"
                                        onChange={(event) => { this.onGroupImageChange(event, conversationInfo) }}
                                        ref={(ref) => this.upload = ref}
                                        style={{ display: 'none' }} />
                                    <List.Item
                                        as='a'
                                        onClick={(e) => this.upload.click()}>Upload photo
                                    </List.Item>
                                    {
                                        conversationInfo.imagePresent ?
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
                                onClick={this.setShowMoreOptions}
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
                            <Button onClick={this.setShowMoreOptions} className="moreOption-btn transparent" circular >
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
                                placeholder='Name this group chat'
                                value={groupNameState}
                                onChange={(e) => { this.setState({ groupNameState: e.target.value }) }} />
                            <span className="charCount">{groupNameState.length}/25</span>
                            <Button
                                className="EditGrpName"
                                onClick={() => {
                                    this.handleUpdateGroupDetails(selectedConversation.groupId);
                                    this.setState({ editGroup: false });
                                }}><Icon name="check circle" /></Button>
                        </Fragment>
                    } else {
                        return (<Fragment>
                            {conversationInfo.title}
                            {conversationInfo.disabled ? "" :
                                <Button
                                    className="EditGrpName"
                                    onClick={() => { this.setState({ editGroup: true }) }}>
                                    <Icon name="pencil" /></Button>}</Fragment>);
                    }
                })()}
            </List.Content>
        )
    }
    renderGroupModal = (groupFeed, currentUserInfo, conversationInfo) => {
        const {
            groupAction,
            groupActionError,
            groupUserName,
            memberSearchText,
        } = this.state;
        const {
            groupFeeds,
            selectedConversation,
            userDetails,
            userInfo,
        } = this.props;
        switch (groupAction) {
            case 'MEMBERS_LIST': return (
                <Modal
                    open={groupAction == 'MEMBERS_LIST'}
                    onClose={() => this.setGroupAction(null)}
                    size="tiny" dimmer="inverted"
                    className="chimp-modal"
                    closeIcon
                    centered={false}>
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
                                                                                                groupId: groupFeed.clientGroupId,
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
                                                                                            groupId: groupFeed.clientGroupId,
                                                                                            groupUserInfo: [{ "userId": Number(user.userId), "role": "3" }],
                                                                                            groupUserName: userDetails[user.userId].displayName || "User"
                                                                                        })}>Remove admin status</List.Item> : ""}
                                                                                {currentUserInfo.role == "1" && user.role != "1" ? <Divider /> : ""}
                                                                                {currentUserInfo.role == "1" ?
                                                                                    <List.Item
                                                                                        as='a'
                                                                                        className="red"
                                                                                        onClick={() => this.setGroupAction("REMOVE_USER", false, {
                                                                                            groupId: groupFeed.clientGroupId,
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
                                                        <Image avatar src={userDetails[user.userId] && userDetails[user.userId].imageLink ? userDetails[user.userId].imageLink : placeholderUser} />
                                                        <List.Content>
                                                            <List.Header as='a'>{userDetails[user.userId].displayName || "User"} {(Number(user.userId) == Number(userInfo.id) ? "(You)" : "")} {user.role == "1" ? " (Admin)" : ""}</List.Header>
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
            case 'MAKE_USER_ADMIN': return (
                <Modal size="tiny" open={groupAction == 'MAKE_USER_ADMIN'} onClose={() => this.setGroupAction("MEMBERS_LIST")} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                    <Modal.Header>Make {groupUserName} group chat admin for group name?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">As an administrator, {groupUserName} will be able to manage all the members of this group chat.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="blue-btn-rounded-def c-small" onClick={() => { this.handleUpdateGroupDetails(this.state.groupId, this.state.groupUserInfo); this.setGroupAction("MEMBERS_LIST") }}>Make group admin</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction("MEMBERS_LIST")}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>

            );
            case 'REMOVE_ADMIN': return (
                <Modal size="tiny" open={groupAction == 'REMOVE_ADMIN'} onClose={() => this.setGroupAction("MEMBERS_LIST")} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                    <Modal.Header>Remove admin status?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">{groupUserName} will no longer be able to manage all the members of this group chat.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="red-btn-rounded-def red" onClick={() => { this.handleUpdateGroupDetails(this.state.groupId, this.state.groupUserInfo); this.setGroupAction("MEMBERS_LIST") }}>Remove admin status</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction("MEMBERS_LIST")}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>

            );
            case 'REMOVE_USER': return (
                <Modal size="tiny" open={groupAction == 'REMOVE_USER'} onClose={() => this.setGroupAction("MEMBERS_LIST")} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                    <Modal.Header>Remove {groupUserName}?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">{groupUserName} will be removed from this conversation.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="red-btn-rounded-def red" onClick={() => { this.handleremoveUserFromGroup(this.state.groupId, this.state.userId); this.setGroupAction("MEMBERS_LIST"); }}>Remove</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction("MEMBERS_LIST")}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>

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
                                    //onSearchChange={this.handleSearchMembersChange}
                                    options={this.state.groupAddMemberOptions}
                                    placeholder='Type a name or multiple names'
                                    // search
                                    // searchQuery={this.state.searchQuery}
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
                                                                    onClick={(e) => this.onMemberSelectForAddition(user.userId + "", (user.displayName || user.userName))}
                                                                    checked={this.state.groupAddMemberValues.indexOf(user.userId + "") >= 0} />
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
                            <Button className="blue-btn-rounded-def c-small" onClick={() => this.handleaddSelectedUsersToGroup(groupFeed.clientGroupId)}>Add</Button>
                        </div>
                    </Modal.Content>
                </Modal>

            );
            case 'MUTE_NOTIFICATIONS': return (
                <Modal size="tiny" open={groupAction == 'MUTE_NOTIFICATIONS'} onClose={() => this.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                    <Modal.Header>Mute conversation?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="blue-btn-rounded-def c-small" onClick={() => this.muteOrUnmuteConversation(selectedConversation, true)}>Mute</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction(null)}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            );
            case 'UNMUTE_NOTIFICATIONS': return (
                <Modal size="tiny" open={groupAction == 'UNMUTE_NOTIFICATIONS'} onClose={() => this.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                    <Modal.Header>Unmute conversation?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">You can mute this conversation anytime.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="blue-btn-rounded-def c-small" onClick={() => this.muteOrUnmuteConversation(selectedConversation, false)}>Unmute</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction(null)}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            );
            case 'LEAVE_GROUP': return (
                <Modal size="tiny" open={groupAction == 'LEAVE_GROUP'} onClose={() => this.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                    <Modal.Header>Leave conversation?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">You won't get messages from this group chat unless another member adds you back into the chat.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="blue-btn-rounded-def c-small" onClick={() => this.handleleaveGroup(selectedConversation.groupId)}>Leave conversation</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction(null)}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            );
            case 'DELETE_GROUP': return (
                <Modal size="tiny" open={groupAction == 'DELETE_GROUP'} onClose={() => this.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                    <Modal.Header>Delete group?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">Cannot undo this action. All the messages in this group will be deleted permanentaly.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="red-btn-rounded-def red c-small" onClick={() => this.handledeleteConversation({ groupId: selectedConversation.groupId })}>Delete</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction(null)}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            );
            case 'REMOVE_GROUP_IMAGE': return (
                <Modal size="tiny" open={groupAction == 'REMOVE_GROUP_IMAGE'} onClose={() => this.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                    <Modal.Header>Remove group image?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">Cannot undo this action. The image of the group will be removed for all members.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="red-btn-rounded-def red c-small" onClick={() => this.handleUpdateGroupDetails(selectedConversation.groupId, false, { imageLink: " " }, true)}>Remove</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setGroupAction(null)}>Cancel</Button>
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
            case !_isEmpty(groupActionError): return (
                <Modal
                    size="tiny"
                    open={groupActionError != null}
                    onClose={() => this.setState({ groupActionError: null, groupAction: null })}
                    dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                    <Modal.Header>Error uploading photo</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">{groupActionError}</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setState({ groupActionError: null, groupAction: null })}>Close</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            );
            default:
                break;
        }
    }
    renderGroupSelectedHeader = (conversationInfo) => {
        const {
            groupFeeds,
            selectedConversation,
            userInfo,
        } = this.props;
        const groupFeed = groupFeeds[selectedConversation.groupId];
        const currentUserInfo = getCurrentUserRoleInGroup(groupFeed, userInfo.id);
        return (
            <div className="chatHeader">
                <div className="chatWithGroup">
                    {this.state.groupAction && this.renderGroupModal(groupFeed, currentUserInfo, conversationInfo)}
                    <List divided verticalAlign='middle'>
                        <List.Item>
                            {this.renderGroupMoreOption(conversationInfo, currentUserInfo)}
                            {this.renderGroupImage(conversationInfo)}
                            {this.renderGroupTilte(conversationInfo)}
                        </List.Item>
                    </List>
                </div>
            </div>
        );
    }
    renderUserModal = () => {
        const {
            conversationAction
        } = this.state;
        const {
            selectedConversation
        } = this.props;
        switch (conversationAction) {
            case "MUTE": return (
                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => this.setState({ conversationAction: null })} closeIcon open={conversationAction == "MUTE"} centered={true}>
                    <Modal.Header>Mute conversation?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="blue-btn-rounded-def c-small" onClick={() => this.muteOrUnmuteConversation(selectedConversation, true)}>Mute</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setState({ conversationAction: null })}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>

            );
            case 'UNMUTE': return (
                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => this.setState({ conversationAction: null })} closeIcon open={conversationAction == "UNMUTE"} centered={true}>
                    <Modal.Header>Unmute conversation?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">You can mute this conversation anytime.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="blue-btn-rounded-def c-small" onClick={() => this.muteOrUnmuteConversation(selectedConversation, false)}>Unmute</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setState({ conversationAction: null })}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            );
            case "DELETE": return (
                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => this.setState({ conversationAction: null })} closeIcon open={conversationAction == "DELETE"} centered={true}>
                    <Modal.Header>Delete conversation?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">Deleting removes conversations from inbox, but no ones else’s inbox.</Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="red-btn-rounded-def red c-small" onClick={(e) => this.handledeleteConversation({ userId: selectedConversation.contactIds })}>Delete</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => this.setState({ conversationAction: null })}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            );
            default: break;
        }
    }
    renderUserSelectedHeader = (conversationInfo) => {
        const {
            conversationAction,
            showMoreOptions
        } = this.state;
        const {
            selectedConversation,
            userDetails
        } = this.props;
        return (
            <div className="chatHeader">
                <div className="chatWith">
                    Message with {selectedConversation ? userDetails[selectedConversation.contactIds].displayName : ""}
                </div>
                <div className="moreOption">
                    {conversationAction && this.renderUserModal()}
                    <Popup
                        open={showMoreOptions}
                        onClose={() => { this.setState({ showMoreOptions: false }) }}
                        className="moreOptionPopup" basic position='bottom right'
                        trigger={<Button className="moreOption-btn transparent"
                            circular onClick={this.setShowMoreOptions}>
                            <Image src={moreIcon} />
                        </Button>}
                        on="click">
                        <Popup.Content>
                            <List>
                                <List.Item
                                    as='a'
                                    onClick={() => { this.setState({ showMoreOptions: false }) }}>
                                    <Link route={"/users/profile/" + selectedConversation.contactIds}>
                                        <a>View profile</a></Link>
                                </List.Item>
                                {conversationInfo.isMuted ?
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
            </div>
        )

    }
    renderHeaderCompose = () => {
        const {
            newGroupMemberIds,
            selectedConversation,
            userDetails,
        } = this.props;
        const {
            newGroupImageUrl,
        } = this.state;
        if (newGroupMemberIds && newGroupMemberIds.length <= 0) {
            return <div className="chatWith">New Message</div>
        }
        else if (selectedConversation && newGroupMemberIds && newGroupMemberIds.length == 1) {
            return <div className="chatWith">
                Message with
                {selectedConversation ?
                    (userDetails[selectedConversation.contactIds] ?
                        userDetails[selectedConversation.contactIds].displayName : "") : ""
                }
            </div>
        }
        else {
            return <div className="chatWithGroup">
                <List divided verticalAlign='middle'>
                    <List.Item>
                        <List.Content floated='right'>
                            <div className="moreOption"></div>
                        </List.Content>
                        <Popup
                            className="moreOptionPopup"
                            open={this.state.groupAction == "IMAGE_ACTION"}
                            onClose={() => this.setGroupAction(null)}
                            trigger={
                                <Image
                                    avatar
                                    onClick={() => this.setGroupAction("IMAGE_ACTION")}
                                    src={newGroupImageUrl ? newGroupImageUrl : placeholderGroup} />}
                            basic
                            position='bottom left'
                            on='click'
                        >
                            <Popup.Content>
                                <List>
                                    {(() => {
                                        return (
                                            <Fragment>
                                                <input
                                                    id="myInput"
                                                    accept="images/*"
                                                    type="file"
                                                    onChange={(event) => this.onGroupImageChange(event, {}, true)}
                                                    ref={(ref) => this.newUpload = ref} style={{ display: 'none' }}
                                                />
                                                <List.Item as='a' onClick={(e) => this.newUpload.click()}>Upload photo</List.Item>
                                            </Fragment>
                                        )
                                    })()}
                                </List>
                            </Popup.Content>
                        </Popup>
                        <List.Content className="grpNameEdit">
                            {(() => {
                                if (this.state.editGroup) {
                                    //clickinig on edit button when compose is true for editGroup
                                    return <Fragment>
                                        <Input
                                            maxLength="25"
                                            placeholder='Group Title'
                                            value={this.state.groupNameState}
                                            onChange={(e) => { this.setState({ groupNameState: e.target.value }) }}
                                        />
                                        <span className="charCount">
                                            {this.state.groupNameState.length}/25
                                        </span>
                                        <Button
                                            className="EditGrpName"
                                            onClick={this.handleNewGroupEditDone}>
                                            <Icon name="check circle" />
                                        </Button>
                                    </Fragment>
                                } else {
                                    //initiall showing when compose is
                                    return <Fragment>
                                        {this.state.groupNameState}
                                        <Button
                                            className="EditGrpName"
                                            onClick={() => this.setState({ editGroup: true })}>
                                            <Icon name="pencil" />
                                        </Button>
                                    </Fragment>;
                                }
                            })()}
                        </List.Content>
                    </List.Item>
                </List>
            </div>
        }
    }
    renderChatMessage = () => {
        const {
            compose,
            isSmallerScreen,
            newGroupMemberIds,
            smallerScreenSection,
            selectedConversation,
        } = this.props;
        //header if compose is true
        if (compose && (!isSmallerScreen || smallerScreenSection != "convList")) {
            return (
                <Fragment>
                    <div className="chatHeader">
                        {this.renderHeaderCompose()}
                    </div>
                    <div className="chatContent">
                        {this.renderChatSectionCompose()}
                    </div>
                    {(!selectedConversation && newGroupMemberIds.length > 0) &&
                        this.renderComposeFooter()
                    }
                </Fragment>

            )
        } else {

            if (_isEmpty(selectedConversation)) {
                return;
            }
            else if (selectedConversation && (!isSmallerScreen || smallerScreenSection != "convList")) {
                if (selectedConversation.conversationInfo && selectedConversation.conversationInfo.type == "group" &&
                    selectedConversation.groupId) {
                    //selected conversation is group and its header
                    return (
                        <Fragment>
                            {this.renderGroupSelectedHeader(selectedConversation.conversationInfo)}
                        </Fragment>
                    )
                } else {
                    //selected conversation is user and its header
                    return (
                        <Fragment>
                            {this.renderUserSelectedHeader(selectedConversation.conversationInfo)}
                        </Fragment>
                    )
                }
            }
        }
    }

    renderChatSectionAndFooter = () => {
        const {
            endTime,
            selectedConversation,
            selectedConversationMessages,
            userDetails,
            userInfo,
        } = this.props;
        const conversationInfo = selectedConversation && selectedConversation.conversationInfo ? selectedConversation.conversationInfo : {};
        return <Fragment>
            <div className="chatContent">
                <div
                    className="mesgs"
                    onScroll={() => {
                        if (this.refs && this.refs.scrollParentRef && this.refs.scrollParentRef.scrollTop === 0 && endTime) {
                            this.handleOnscroll("scrolled")
                        }
                    }}
                    ref="scrollParentRef"
                >
                    <div className="msg_history">
                        {
                            !_isEmpty(selectedConversationMessages) && <ChatConversationsParent
                            selectedConversationMessages={selectedConversationMessages}
                            conversationInfo={conversationInfo}
                            userDetails={userDetails}
                        />
                        }
                    </div>
                </div>
            </div>
            <div className="chatFooter">
                {/* if it is group and currentuser have left the group disable it*/}
                {(!(conversationInfo.type == "group"
                    && conversationInfo.info && conversationInfo.info.removedMembersId.indexOf(userInfo.id) >= 0)) &&
                    <ChatMessageFooter
                        refName="currentConvMessageTextRef"
                    />
                }
            </div>
        </Fragment>
    }
    render() {
        const {
            isSmallerScreen,
            selectedConversation,
            smallerScreenSection,
        } = this.props;
        return (

            <Fragment>
                {this.renderChatMessage()}
                {
                    !_isEmpty(selectedConversation) && (!isSmallerScreen || smallerScreenSection != "convList") &&
                    this.renderChatSectionAndFooter()
                }
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        concatMessages: state.chat.concatMessages,
        endTime: state.chat.endTime,
        groupFeeds: state.chat.groupFeeds,
        messages: state.chat.messages,
        muteUserList: state.chat.muteUserList,
        newGroupMemberIds: state.chat.newGroupMemberIds,
        smallerScreenSection: state.chat.smallerScreenSection,
        selectedConversation: state.chat.selectedConversation,
        selectedConversationMessages: state.chat.selectedConversationMessages,
        userDetails: state.chat.userDetails,
        userInfo: state.user.info,
    };
}

ChatMessages.defaultProps = {
    newGroupMemberIds: [],
    selectedConversationMessages: [],
    endTime: null
}

export default connect(mapStateToProps)(ChatMessages);