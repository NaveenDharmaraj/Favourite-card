import React, { Fragment } from 'react';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { List, Input, Button, Icon, Dropdown, Popup, Divider, Image, Modal, Checkbox } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';

import utilityApi from '../../../services/utilityApi';
import applozicApi from '../../../services/applozicApi';
import { actionTypes, loadConversations, loadMuteUserList, deleteConversation, muteOrUnmuteUserConversation, muteOrUnmuteGroupConversation, removeUserFromGroup, addSelectedUsersToGroup, leaveGroup } from '../../../actions/chat';
import moreIcon from '../../../static/images/icons/ellipsis.svg';
import { getBase64 } from '../../../helpers/chat/utils';
import { placeholderGroup } from '../../../static/images/no-data-avatar-group-chat-profile.png';
import { placeholderUser } from '../../../static/images/no-data-avatar-user-profile.png';
import Link from '../../shared/Link';
const { publicRuntimeConfig } = getConfig();
const {
    CHAT_GROUP_DEFAULT_AVATAR
} = publicRuntimeConfig;


// splitting the chat header based on compose flag

class ChatMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editGroup: false,
            editGroupNameState: props.editGroupName ? props.editGroupName : '',
            groupAction: "",
            groupActionError: '',
            groupUserName: "",
            groupUserInfo: [],
            groupAddMemberOptions: [],
            groupAddMemberValues: [],
            memberSearchText: "",
            newGroupNameState: props.newGroupName ? props.newGroupName : 'New Group',
            showMoreOptions: false,
            searchQuery: '',
        }
    }

    componentDidUpdate(prevProps) {
        const {
            editGroupName
        } = this.props;
        if (!_isEqual(this.props, prevProps)) {
            if (!_isEqual(editGroupName, prevProps.editGroupName)) {
                this.setState({
                    editGroupNameState: editGroupName
                })
            }
        }
    }
    handleNewGroupEditDone = (event) => {
        //??????is it required to dispatch newGroupName
        if (event && event.target && event.target.value && event.target.value.trim() != "") {
            this.setState({
                editGroup: false,
                newGroupNameState: event.target.value
            });
        }
    }
    renderHeaderCompose = () => {
        const {
            newGroupMemberIds,
            newGroupImageUrl,
            selectedConversation,
            userDetails,
        } = this.props;
        if (newGroupMemberIds && newGroupMemberIds.length <= 0) {
            return <div className="chatWith">New Message</div>
        }
        else if (selectedConversation) {
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
                                            value={this.state.newGroupNameState}
                                            onChange={(e) => { this.setState({ newGroupNameState: e.target.value }) }}
                                        />
                                        <span className="charCount" ref="groupNameCharCount">
                                            {this.state.newGroupNameState.length}/25
                                        </span>
                                        <Button
                                            className="EditGrpName"
                                            onClick={(e) => this.handleNewGroupEditDone(e)}>
                                            <Icon name="check circle" />
                                        </Button>
                                    </Fragment>
                                } else {
                                    //initiall showing when compose is
                                    return <Fragment>
                                        {this.state.newGroupNameState}
                                        <Button
                                            className="EditGrpName"
                                            onClick={this.setState({ editGroup: true })}>
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

    conversationHead = (msg) => {
        const {
            groupFeeds,
            muteUserList,
            userDetails,
            userInfo,
        } = this.props;
        let currentUserId = userInfo.id;
        if (msg && msg.groupId) {
            let info = !_isEmpty(groupFeeds) ? groupFeeds[msg.groupId] : {};
            let groupHead = {
                type: "group",
                title: info.name,
                image: (info.imageUrl ? info.imageUrl : placeholderGroup),
                imagePresent: (info.imageUrl && info.imageUrl != "" && info.imageUrl != null && info.imageUrl != CHAT_GROUP_DEFAULT_AVATAR ? true : false),
                isMuted: (info.notificationAfterTime && info.notificationAfterTime > new Date().getTime()),
                info: info
            };
            groupHead["disabled"] = (info.removedMembersId && info.removedMembersId.indexOf(currentUserId) >= 0);
            return groupHead;
        } else if (msg && msg.contactIds) {
            let info = !_isEmpty(userDetails) ? userDetails[msg.contactIds] : {};
            const muteInfo = !_isEmpty(muteUserList) ? muteUserList[msg.contactIds] : {};
            let convHead = info ? {
                type: 'user',
                title: info['displayName'],
                image: (info.imageLink ? info.imageLink : placeholderUser),
                imagePresent: (info.imageLink && info.imageLink != "" && info.imageLink != null ? true : false),
                info: info,
                isMuted: (muteInfo && muteInfo.notificationAfterTime && muteInfo.notificationAfterTime > new Date().getTime())
            } : {};
            return convHead;
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


    updateGroupDetails = (groupId, usersInfo, groupInfo, resetActionVar) => {
        const {
            dispatch,
            editGroupImageUrl,
            groupFeeds,
            userDetails,
            selectedConversation,
        } = this.props;
        const {
            editGroupNameState
        } = this.state;
        let params = { groupId: groupId };
        let currentGroupInfo = groupFeeds[groupId];
        if (!currentGroupInfo || currentGroupInfo.name != editGroupNameState) {
            params["newName"] = editGroupNameState;
            dispatch({
                payload: {
                    editGroupName: editGroupNameState,
                },
                type: actionTypes.EDIT_GROUP_DETAILS
            })
        }

        //dispatching editimageurl happens in onGroupImageChange function
        if (!currentGroupInfo || currentGroupInfo.imageUrl != groupInfo['imageLink']) {
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
        applozicApi.post("/group/update", params).then(response => {
            if (resetActionVar) {
                this.setGroupAction(null);
            }
            if (!_isEmpty(params["newName"]) || !_isEmpty(params["imageUrl"])) {
                dispatch({
                    payload: {
                        editGroupName: editGroupNameState,
                        editGroupImageUrl: params["imageUrl"],
                    },
                    type: actionTypes.EDIT_GROUP_DETAILS
                })
            }
            dispatch(loadConversations(groupId, userDetails, groupFeeds, selectedConversation));
        });
    }

    onGroupImageChange = (event, conversationInfo, isForNewGroup) => {
        const {
            dispatch
        } = this.props;
        getBase64(event.target.files[0], (result) => {
            const data = { "data": { "type": "users", "attributes": { "file": result }, "id": (isForNewGroup ? new Date().getTime() : conversationInfo.info.id) } };
            utilityApi.post("/image/upload/" + (isForNewGroup ? new Date().getTime() : conversationInfo.info.id), data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const newImage = response.data.attributes.location;
                if (isForNewGroup) {
                    dispatch({
                        payload: {
                            newGroupImageUrl: newImage
                        },
                        type: actionTypes.NEW_GROUP_DETAILS
                    })
                    this.setState({ groupAction: null });
                } else {
                    this.updateGroupDetails(conversationInfo.info.id, false, { imageLink: newImage });
                    this.setState({ groupAction: null });
                }
            }).catch((err) => {
                if (err && err.statusCode == "413") {
                    this.setState({ groupAction: null, groupActionError: err.message || err.error });
                }
            });;
        });
    }
    /*
    
    
    */
    getCurrentUserRoleInGroup = (groupFeed) => {
        let groupUsers = groupFeed.groupUsers;
        let userId = this.props.userInfo.id;
        let userInfo = {};
        _.forEach(groupUsers, function (user) {
            if (user.userId == userId) {
                // console.log(user);
                userInfo = user;
            }
        });
        return userInfo;
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
                dispatch({
                    payload: {
                        selectedConversation: selectedConversation,
                        selectedConversationMessages: [],
                    },
                    type: actionTypes.CURRENT_SELECTED_CONVERSATION
                });
                dispatch({
                    payload: {
                        newGroupMemberIds: dropdownEl.value
                    },
                    type: actionTypes.NEW_GROUP_DETAILS,
                })
                //this.loadConversationMessages(selectedConversation, new Date().getTime(), true);
            }
        } else {
            //new group conversation
            dispatch({
                payload: {
                    selectedConversation: null,
                },
                type: actionTypes.CURRENT_SELECTED_CONVERSATION
            });
            dispatch({
                payload: {
                    newGroupMemberIds: dropdownEl.value
                },
                type: actionTypes.NEW_GROUP_DETAILS,
            })
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
                                //ref="groupContactIds"
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
            editGroupNameState
        } = this.state;
        return (
            <List.Content className="grpNameEdit">
                {(() => {
                    if (this.state.editGroup) {
                        return <Fragment>
                            <Input
                                maxLength="25"
                                placeholder='Name this group chat'
                                ref="groupName"
                                value={editGroupNameState}
                                onChange={(e) => { this.setState({ editGroupNameState: e.target.value }) }} />
                            <span className="charCount" ref="groupNameCharCount">{editGroupNameState.length}/25</span>
                            <Button
                                className="EditGrpName"
                                onClick={() => {
                                    this.updateGroupDetails(selectedConversation.groupId);
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
                            <Button className="blue-btn-rounded-def c-small" onClick={() => { this.updateGroupDetails(this.state.groupId, this.state.groupUserInfo); this.setGroupAction("MEMBERS_LIST") }}>Make group admin</Button>
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
                            <Button className="red-btn-rounded-def red" onClick={() => { this.updateGroupDetails(this.state.groupId, this.state.groupUserInfo); this.setGroupAction("MEMBERS_LIST") }}>Remove admin status</Button>
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
                            <Button className="red-btn-rounded-def red c-small" onClick={() => this.updateGroupDetails(selectedConversation.groupId, false, { imageLink: " " }, true)}>Remove</Button>
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
    renderGroupSelected = (conversationInfo) => {
        const {
            groupFeeds,
            selectedConversation,
        } = this.props;
        const groupFeed = groupFeeds[selectedConversation.groupId];
        const currentUserInfo = this.getCurrentUserRoleInGroup(groupFeed);
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
    renderUserSelected = (conversationInfo) => {
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

    renderChatMessage = () => {
        const {
            compose,
            groupFeeds,
            isSmallerScreen,
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
                </Fragment>

            )
        } else {
            const conversationInfo = this.conversationHead(selectedConversation);

            if (_isEmpty(selectedConversation)) {
                return;
            }
            //selected conversation is group and its header
            else if (selectedConversation && conversationInfo && conversationInfo.type == "group" && selectedConversation.groupId && (!isSmallerScreen || smallerScreenSection != "convList")) {
                return (
                    <Fragment>
                        {this.renderGroupSelected(conversationInfo)}
                    </Fragment>
                )
            }
            else if (selectedConversation && conversationInfo && conversationInfo.type == "user"
                && (!isSmallerScreen || smallerScreenSection != "convList")) {
                return (
                    <Fragment>
                        {this.renderUserSelected(conversationInfo)}
                    </Fragment>
                )
            }
        }
    }

    render() {
        return (

            <Fragment>
                {this.renderChatMessage()}
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        compose: state.chat.compose,
        editGroupName: state.chat.editGroupName,
        editGroupImageUrl: state.chat.editGroupImageUrl,
        groupFeeds: state.chat.groupFeeds,
        messages: state.chat.messages,
        muteUserList: state.chat.muteUserList,
        newGroupName: state.chat.newGroupName,
        newGroupMemberIds: state.chat.newGroupMemberIds,
        smallerScreenSection: state.chat.smallerScreenSection,
        selectedConversation: state.chat.selectedConversation,
        userDetails: state.chat.userDetails,
        userInfo: state.user.info,
    };
}

ChatMessages.defaultProps = {
    newGroupMemberIds: [],
}

export default connect(mapStateToProps)(ChatMessages);