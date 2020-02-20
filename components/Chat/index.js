import _ from 'lodash';
import React, { Fragment } from 'react';
//import dynamic from 'next/dynamic';
// import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import { Button, Checkbox, Container, Dimmer, Loader, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, List, Modal, Popup, Table, Placeholder } from 'semantic-ui-react';
import { Link } from '../../routes';
import applozicApi from "../../services/applozicApi";
import graphApi from "../../services/graphApi";
import PlaceHolderGrid from '../shared/PlaceHolder';
import utilityApi from "../../services/utilityApi";
import moreIcon from '../../static/images/icons/ellipsis.svg';
import { default as placeholderGroup } from '../../static/images/no-data-avatar-group-chat-profile.png';
import { default as placeholderUser } from '../../static/images/no-data-avatar-user-profile.png';
import '../../static/less/message.less';
const { publicRuntimeConfig } = getConfig();
const {
    CHAT_GROUP_DEFAULT_AVATAR
} = publicRuntimeConfig;

class ChatWrapper extends React.Component {
    items = [];
    loading = false;
    scrollParentRef = React.createRef();
    // ref = React.createRef();
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    constructor(props) {
        super(props)
        // const messageCount = props.messageCount;
        //  const messages = props.messages;
        const userInfo = props.userInfo;
        const dispatch = props.dispatch;
        this.state = {
            msgId: props.msgId == "all" || props.msgId == "new" ? null : Number(props.msgId),
            groupAction: "",
            compose: props.msgId == "new",
            groupAddMemberOptions: [],
            groupAddMemberValues: [],
            newGroupMemberIds: [],
            memberSearchText: "",
            messages: [],
            userDetails: {},
            groupFeeds: {},
            selectedConversation: null,
            selectedConversationMessages: [],
            editGroup: false,
            newGroupName: "New Group",
            newGroupImageUrl: "",
            editGroupName: "",
            editGroupImageUrl: "",
            isSmallerScreen: window.innerWidth <= 767,
            smallerScreenSection: "convList",
            userInfo: userInfo,
            showMoreOptions: false,
            groupUserName: "",
            groupUserInfo: [],
            muteUserList: {},
            loading: true,
            dispatch: dispatch
        };
        this.composeNew = this.composeNew.bind(this);
        this.setGroupAction = this.setGroupAction.bind(this);
        this.groupMessagesByDate = this.groupMessagesByDate.bind(this);
        this.getDateString = this.getDateString.bind(this);
        this.loadFriendsList = this.loadFriendsList.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.deleteConversation = this.deleteConversation.bind(this);
        this.getFriendsListDropDownOptions = this.getFriendsListDropDownOptions.bind(this);
        this.leaveGroup = this.leaveGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.addUserToGroup = this.addUserToGroup.bind(this);
        this.removeUserFromGroup = this.removeUserFromGroup.bind(this);
        this.updateGroupDetails = this.updateGroupDetails.bind(this);
        this.loadConversationMessages = this.loadConversationMessages.bind(this);
        this.sendMessageToSelectedConversation = this.sendMessageToSelectedConversation.bind(this);
        this.conversationHead = this.conversationHead.bind(this);
        this.loadConversations = this.loadConversations.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.applozicAppInitialized = this.applozicAppInitialized.bind(this);
        this.onMessageEvent = this.onMessageEvent.bind(this);
        this.refreshForNewMessages = this.refreshForNewMessages.bind(this);
        this.onConversationSelect = this.onConversationSelect.bind(this);
        this.handleContactSelection = this.handleContactSelection.bind(this);
        this.handleComposeMessageKeyDown = this.handleComposeMessageKeyDown.bind(this);
        this.handleMessageKeyDown = this.handleMessageKeyDown.bind(this);
        this.onConversationSearchChange = this.onConversationSearchChange.bind(this);
        this.timeString = this.timeString.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleNewGroupEdit = this.handleNewGroupEdit.bind(this);
        this.handleNewGroupEditDone = this.handleNewGroupEditDone.bind(this);
        this.getCurrentUserRoleInGroup = this.getCurrentUserRoleInGroup.bind(this);
        this.handleGroupAddMemberSelected = this.handleGroupAddMemberSelected.bind(this);
        this.handleGroupAddMemberChange = this.handleGroupAddMemberChange.bind(this);
        this.onMemberSelectForAddition = this.onMemberSelectForAddition.bind(this);
        this.addSelectedUsersToGroup = this.addSelectedUsersToGroup.bind(this);
        this.onGroupImageChange = this.onGroupImageChange.bind(this);
        this.setShowMoreOptions = this.setShowMoreOptions.bind(this);
        this.muteOrUnmuteConversation = this.muteOrUnmuteConversation.bind(this);
        this.memberSearchTextChange = this.memberSearchTextChange.bind(this);
        this.resize = this.resize.bind(this);
        this.onSendKeyClick = this.onSendKeyClick.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.loadMuteUserList = this.loadMuteUserList.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            // console.log('Error: ', error);
        };
    }

    memberSearchTextChange(event) {
        this.setState({ memberSearchText: event.target.value });
    }
    muteOrUnmuteConversation = (conversationInfo, isMute) => {
        const self = this;
        const params = {};
        //Mute Set to 365 Days | Unmute sets past time T-5 secs
        params["notificationAfterTime"] = new Date().getTime() + (isMute ? (1000 * 60 * 60 * 24 * 365) : -5000);
        if (conversationInfo.groupId) {
            params["clientGroupId"] = conversationInfo.groupId;
            applozicApi.post("/group/user/update", params).then(function (response) {
                self.setState({ conversationAction: null, groupAction: null });
                self.loadConversations(false, conversationInfo.groupId);
            });
        } else if (conversationInfo.contactIds) {
            params["userId"] = conversationInfo.contactIds;
            applozicApi.post("/user/chat/mute?userId=" + params.userId + "&notificationAfterTime=" + params.notificationAfterTime, params).then(function (response) {
                self.setState({ conversationAction: null, groupAction: null });
                self.loadConversations(false, null, conversationInfo.contactIds);
                self.loadMuteUserList();
            });
        }
    }
    setShowMoreOptions = () => {
        this.setState({ showMoreOptions: true });
    }
    onGroupImageChange = (e, conversationInfo, isForNewGroup) => {
        const self = this;
        self.getBase64(event.target.files[0], (result) => {
            const data = { "data": { "type": "users", "attributes": { "file": result }, "id": (isForNewGroup ? new Date().getTime() : conversationInfo.info.id) } };
        utilityApi.post("/image/upload/" + (isForNewGroup ? new Date().getTime() : conversationInfo.info.id), data, {
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            }
        }).then(function (response) {
            const newImage = response.data.attributes.location;
            if (isForNewGroup) {
                    self.setState({ newGroupImageUrl: newImage, groupAction: null });
            } else {
                self.updateGroupDetails(conversationInfo.info.id, false, { imageLink: newImage });
                    self.setState({ editGroupImageUrl: newImage, groupAction: null });
            }
            }).catch((err) => {
                // console.log(err);
                if (err && err.statusCode == "413") {
                    self.setState({ groupAction: null, groupActionError: err.message || err.error });
                }
            });;
        });
    }

    handleGroupAddMemberSelected = (e, { value }) => {
        this.setState((prevState) => ({
            groupAddMemberOptions: [{ text: value, value }, ...prevState.groupAddMemberOptions],
        }))
    }

    handleGroupAddMemberChange = (e, { value }) => {
        this.setState({
            groupAddMemberValues: value, groupAddMemberOptions: this.state.groupAddMemberOptions.filter(function (obj) {
                return value.indexOf(obj.value) >= 0;
            })
        });
    }

    onMemberSelectForAddition = (value, text) => {
        // const value = target.value;
        // const value = target;
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
    addSelectedUsersToGroup = (groupId) => {
        const self = this;
        const params = { "userIds": this.state.groupAddMemberValues, "clientGroupIds": [groupId] };
        applozicApi.post("/group/add/users", params).then(function (response) {
            self.loadConversations(false, groupId);
            self.setState({ groupAddMemberValues: [], groupAddMemberOptions: [], groupAction: null });
        });
    }

    composeNew() {
        this.setState({ compose: !this.state.compose, smallerScreenSection: this.state.compose ? "convList" : "convMsgs", newGroupMemberIds: [], newGroupName: "New Group", newGroupImageUrl: null, selectedConversation: (!this.state.compose ? null : (this.state.selectedConversation && this.state.selectedConversation.key ? this.state.selectedConversation : (this.state.filteredMessages ? this.state.filteredMessages[0] : null))) });
    }
    setGroupAction(action, triggeredFromPopup, additionalStateVars) {
        let newState = { groupAction: action, memberSearchText: "", groupAddMemberOptions: [], groupAddMemberValues: [] };
        if (triggeredFromPopup) {
            newState["showMoreOptions"] = false;
        }
        if (additionalStateVars && additionalStateVars != "") {
            newState = Object.assign(newState, additionalStateVars);
        }
        this.setState(newState);
    }

    groupMessagesByDate(msgs, msgsByDate) {
        let self = this;
        msgs = msgs.sort((a, b) => (a.createdAtTime - b.createdAtTime));
        // let  = self.state.selectedConversationMessages;
        // let msgsByDate = {};
        let today = new Date();
        let todayStr = today.getDate() + " " + self.months[today.getMonth()] + " " + today.getFullYear();
        _.forEach(msgs, function (msg) {
            // let date = new Date(msg.createdAtTime);
            let dateStr = self.getDateString(msg.createdAtTime);//date.getDate() + " " + self.months[date.getMonth()] + " " + date.getFullYear();
            // if (dateStr == todayStr) {
            //     dateStr = "Today";
            // }
            if (!msgsByDate[dateStr]) {
                msgsByDate[dateStr] = [];
            }
            msgsByDate[dateStr].push(msg);
        });
        return msgsByDate;
        // self.setState({ selectedConversationMessagesByDate: msgsByDate });
    }

    getDateString(timeInMs, todayStr) {
        let self = this;
        if (!todayStr) {
            let today = new Date();
            todayStr = today.getDate() + " " + self.months[today.getMonth()] + " " + today.getFullYear();
        }
        let date = new Date(timeInMs);
        let dateStr = date.getDate() + " " + self.months[date.getMonth()] + " " + date.getFullYear();
        if (dateStr == todayStr) {
            dateStr = "Today";
        }
        return dateStr;
    }

    componentWillUpdate(nextProps, nextState) {

    }
    async loadMuteUserList() {
        const self = this;
        const muteUserList = {};
        applozicApi.get("/user/chat/mute/list", {}).then(function (response) {
            _.forEach(response, function (muteUser) {
                muteUserList[muteUser["userId"]] = muteUser;
            })
        });
        self.setState({ muteUserList: muteUserList });
    }

    loadFriendsList = () => {
        let self = this;
        const pageSize = 999;
        const pageNumber = 1;
        const email = this.state.userInfo.attributes.email;
        graphApi.get(`/user/myfriends`, { params: {
            'page[number]': pageNumber,
            'page[size]': pageSize,
            status: 'accepted',
            userid: email,
        } }).then(
            (result) => {
                let userDetails = self.state.userDetails;
                let friendsList = result.data;
                _.forEach(friendsList, function (userDetailObj) {
                    if (userDetailObj.type == "users") {
                        const userDetail = userDetailObj.attributes;
                        let displayName = userDetail.display_name;
                        if (!displayName) {
                            if (userDetail.first_name) {
                                displayName = userDetail.first_name + (userDetail.last_name ? userDetail.last_name : "");
                            } else {
                                displayName = "User";
                            }
                        }
                        userDetails[Number(userDetail.user_id)] = { userId: userDetail.user_id, displayName: displayName, email: userDetail.email_hash, imageLink: userDetail.avatar };
                    }
                });
                const newState = { userDetails: userDetails };
                if (!friendsList || friendsList.length <= 0) {
                    newState["loading"] = false;
                }
                self.setState(newState);
                self.loadConversations(false, self.state.msgId, self.state.msgId);
            }
        ).catch(function (error) {
            self.setState({ loading: false, compose: true, smallerScreenSection: 'convMsgs' });
        });;

        /*
        let self = this;
        let params = {};
        params["role"] = "USER";
        applozicApi.get("/user/filter", { params: params }).then(function (response) {
            let userDetails = {};
            let friendsList = response.users;
            _.forEach(friendsList, function (userDetail) {
                userDetails[userDetail.userId] = userDetail;
            });
            // self.setState({ userDetails: userDetails });
        }).catch(function (error) {
            console.log(error);
        });*/
    }

    createGroup(messageInfo) {
        let self = this;
        let params = {};// { _userId: self.state.userInfo.id, _deviceKey: self.state.userInfo.applogicClientRegistration.deviceKey };
        params["groupName"] = self.state.newGroupName;
        params["groupMemberList"] = self.state.newGroupMemberIds,
            params["imageUrl"] = self.state.newGroupImageUrl;
        if (!params["imageUrl"] || params["imageUrl"] == "" || params["imageUrl"] == null) {
            params["imageUrl"] = CHAT_GROUP_DEFAULT_AVATAR;
        }
        params["metadata"] = {
            "CREATE_GROUP_MESSAGE": "",
            "REMOVE_MEMBER_MESSAGE": "",
            "ADD_MEMBER_MESSAGE": "",
            "JOIN_MEMBER_MESSAGE": "",
            "GROUP_NAME_CHANGE_MESSAGE": "",
            "GROUP_ICON_CHANGE_MESSAGE": "",
            "GROUP_LEFT_MESSAGE": "",
            "DELETED_GROUP_MESSAGE": "",
            "HIDE": "true"
        };
        self.setLoading(true);
        applozicApi.post("/group/v2/create", params).then(function (response) {
            let groupId = response.response.id;
            let groupFeeds = self.state.groupFeeds;
            groupFeeds[groupId] = response.response;
            self.setState({ groupFeeds: groupFeeds, compose: false });
            if (messageInfo && messageInfo.send) {
                self.sendMessageToSelectedConversation({ groupId: groupId }, messageInfo.message, false);
            }
        }).catch(function (error) {
            self.setLoading(false);
            // console.log(error);
        });
    }

    deleteConversation(params) {
        // console.log(params);
        let self = this;
        applozicApi.get("/message/delete/conversation", {
            params: params, headers: {
                'Accept': 'text/plain'
            }
        }).then(function (response) {
            self.setState({ groupAction: null, conversationAction: null });
            self.loadConversations();
        }).catch(function (error) {
            // console.log(error);
            self.setState({ groupAction: null, conversationAction: null });
            self.loadConversations();
        });

    }

    getFriendsListDropDownOptions() {
        let options = [];
        let self = this;
        let list = this.state.userDetails;
        _.forEach(list, function (userDetail, userId) {
            if (userId != self.state.userInfo.id && (userDetail.displayName || userDetail.userName)) {
                options.push({ key: userDetail.userId, text: userDetail.displayName ? userDetail.displayName : userDetail.userName, value: userDetail.userId, image: { avatar: true, src: userDetail.imageLink ? userDetail.imageLink : placeholderUser } });
            }
        });
        return options;
    }

    leaveGroup(groupId) {
        let self = this;
        let params = { clientGroupId: groupId };
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.post("/group/left", params).then(function (response) {
            self.setGroupAction(null);
            self.loadConversations(false, groupId);
        });
    }

    deleteGroup(groupId) {

        this.deleteConversation({ groupId: groupId });
        /*
        let self = this;
        let params = { clientGroupId: groupId };
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.get("/group/delete", { params: params }).then(function (response) {
            self.setGroupAction(null);
            self.loadConversations();
        });*/
    }

    addUserToGroup(groupId, userId, role) {
        let self = this;
        let params = { clientGroupId: groupId };
        params["userId"] = userId;
        params["role"] = role;
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.post("/group/add/member", params).then(function (response) {
            self.loadConversations(false, groupId);
        });
    }

    removeUserFromGroup(groupId, userId) {
        let self = this;
        let params = { clientGroupId: groupId };
        params["userId"] = userId;
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.post("/group/remove/member", params).then(function (response) {
            // self.setGroupAction(null);
            // self.loadConversations();
            self.loadConversations(false, groupId);
        });
    }

    updateGroupDetails(groupId, usersInfo, groupInfo, resetActionVar) {
        let self = this;
        let params = { groupId: groupId };
        let currentGroupInfo = self.state.groupFeeds[groupId];
        if (!currentGroupInfo || currentGroupInfo.name != self.state.editGroupName) {
            params["newName"] = self.state.editGroupName;
        }
        if (!currentGroupInfo || currentGroupInfo.imageUrl != self.state.editGroupImageUrl) {
            params["imageUrl"] = self.state.editGroupImageUrl;
        }
        if (groupInfo && groupInfo['imageLink'] != undefined && groupInfo["imageLink"] != null) {
            params['imageUrl'] = groupInfo['imageLink'];
        }
        if (usersInfo) {
            params = { clientGroupId: groupId };
            params["users"] = usersInfo;
        }
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.post("/group/update", params).then(function (response) {
            if (resetActionVar) {
                self.setGroupAction(null);
            }
            self.loadConversations(false, groupId);
        });
    }
    setLoading(isLoading) {
        this.setState({ loading: isLoading });
    }
    isLoading() {
        return this.state.loading;
    }
    loadConversationMessages(selectedConversation, endTime, resetMessages) {
        self = this;
        if (selectedConversation && !self.isLoading()) {
            // console.log("loadConversationMessages");
            // self.setLoading(true);
            let params = { endTime: endTime, pageSize: 10 }; //{ startIndex: startIndex, mainPageSize: 100, pageSize: 50 };
            if (selectedConversation.groupId) {
                params["groupId"] = selectedConversation.groupId;
            } else { params["userId"] = selectedConversation.contactIds; }
            applozicApi.get("/message/v2/list", { params: params }).then(function (response) {
                self.setLoading(false);
                // handle success
                // console.log(response);
                let oldMsgs = [];
                if (!resetMessages) {
                    oldMsgs = self.state.selectedConversationMessages;
                }
                let selectedConversationMessages = oldMsgs.concat(response.response.message);
                let newState = { selectedConversationMessages: selectedConversationMessages, selectedConversation: self.state.selectedConversation != null ? selectedConversation : null };
                if (selectedConversation.groupId) {
                    let grpInfo = self.state.groupFeeds[selectedConversation.groupId];
                    newState["editGroupName"] = grpInfo["name"];
                    newState["editGroupImageUrl"] = grpInfo["imageUrl"];
                }
                // console.log("loadConversationMessages Done");
                // console.log(newState);
                self.setState(newState);
                if (resetMessages && self.scrollParentRef) {
                    self.scrollParentRef.scrollTop = self.scrollParentRef.scrollHeight;
                } else if (self.scrollParentRef && response.response.message.length > 0) {
                    self.scrollParentRef.scrollTop = 60;
                }

            })
                .catch(function (error) {
                    self.loading = false;
                    // handle error
                    // console.log(error);
                    self.setState({ selectedConversationMessages: [], loading: false });

                })
                .finally(function () {
                    self.loading = false;
                    self.setLoading(false);
                    if (resetMessages) {
                        window.dispatchEvent(new CustomEvent("onChatPageRefreshEvent", { detail: { data: self.state.messages } }));
                    }
                    // always executed 
                    // console.log("Chat Load Done!");
                    // self.loading = false;
                });
            // } else {
            // console.log("Skipped Loading" + self.loading);
        }

    }

    createConversation(userIds, message) {

    }

    sendMessageToSelectedConversation(conversation, message, ignoreLoadingChatMsgs) {
        //send the message
        if (conversation && message.replace(/(?:\r\n|\r|\n|\s)/g, '').length > 0) {
            let params = { message: message.trim().replace(/(?:\r\n|\r|\n)/g, '<br/>') };
            if (conversation.groupId) {
                params["clientGroupId"] = conversation.groupId;
            } else { params["to"] = conversation.contactIds; }
            // commenting this for mobile app team for testing purpose
            // params['contentType'] = 3;
            // params['_userId'] = this.state.userInfo.id;
            // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
            // self.setLoading(true);
            applozicApi.post("/message/v2/send", params).then(function (response) {
                // handle success
                self.loadConversations(ignoreLoadingChatMsgs);
                self.setLoading(false);
                if (ignoreLoadingChatMsgs) {
                //load messages again
                self.loadConversationMessages(conversation, new Date().getTime() + 2000, true);
                }
                self.setState({ compose: false });
            });
        }
    }

    loadConversations = (ignoreLoadingChatMsgs, groupId, contactId) => {
        let self = this;
        applozicApi.get("/message/v2/list", { params: { startIndex: 0, mainPageSize: 100, pageSize: 50 } }).then(function (response) {
            // handle success
            // console.log(response);
            let userDetails = self.state.userDetails;
            _.forEach(response.response.userDetails, function (userDetail) {
                if (!userDetails[userDetail.userId]) {
                    userDetails[userDetail.userId] = userDetail;
                }
            });
            let groupFeeds = self.state.groupFeeds;
            _.forEach(response.response.groupFeeds, function (groupFeed) {
                groupFeeds[groupFeed.id] = groupFeed;
            });
            let selectedConversation = null;
            if (groupId && groupFeeds[groupId] && response.response.message.length > 0) {
                _.forEach(response.response.message, function (msg) {
                    if (msg.groupId == groupId) {
                        msg.selected = true;
                        selectedConversation = msg;
                    }
                });
            }
            if (selectedConversation == null && contactId && userDetails[contactId] && response.response.message.length > 0) {
                _.forEach(response.response.message, function (msg) {
                    if (!msg.groupId && msg.contactIds == contactId) {
                        msg.selected = true;
                        selectedConversation = msg;
                    }
                });
            }

            let newState = { messages: response.response.message, filteredMessages: response.response.message, userDetails: userDetails, groupFeeds: groupFeeds };
            if (groupId || contactId) {
                newState["smallerScreenSection"] = "convMsgs";
            }
            if (contactId && userDetails[contactId] && selectedConversation == null) {
                newState["compose"] = true;
                newState["newGroupMemberIds"] = [contactId];
                selectedConversation = { contactIds: contactId };
                // self.refs.groupContactIds.state.value = [contactId];
            }
            if (selectedConversation == null && !self.state.compose && response.response.message.length > 0) {
                response.response.message[0].selected = true;
                selectedConversation = response.response.message[0];
            }
            if (response.response.message.length <= 0) {
                newState["compose"] = true;
            }
            newState['loading'] = false;
            self.setState(newState);
            if (self.refs.conversationSearchEl && self.refs.conversationSearchEl.inputRef && self.refs.conversationSearchEl.inputRef.current) {
                self.refs.conversationSearchEl.inputRef.current.value = "";
            }

            if (!ignoreLoadingChatMsgs || (self.state.selectedConversation && response.response.message.length > 0 && self.state.selectedConversation.contactIds == response.response.message[0]['contactIds'] && self.state.selectedConversation.groupId == response.response.message[0]['groupId'])) {
                // console.log("Loading Conv msgs");
                let newState = { selectedConversation: selectedConversation };
                if (selectedConversation.groupId) {
                    let groupInfo = groupFeeds[selectedConversation.groupId];
                    newState["editGroupName"] = groupInfo["name"];
                    newState["editGroupImageUrl"] = groupInfo["imageUrl"];
                }

                // newState["compose"] = false;
                self.setState(newState);
                self.loadConversationMessages(selectedConversation, new Date().getTime() + 2000, true);//(self.state.selectedConversation.contactIds != response.response.message[0]['contactIds'] || self.state.selectedConversation.groupId != response.response.message[0]['groupId'])
                // } else {
                // console.log("Skipped Loading Conv msgs"); console.log(self.conversationHead(response.response.message[0])['info']);
            }
        })
            .catch(function (error) {
                // handle error
                self.setState({ messages: [], loading: false, compose: true, smallerScreenSection: 'convMsgs' });
            })
            .finally(function () {
                // always executed 
            });
    }

    componentDidMount() {
        let self = this;
        self.loadFriendsList();
        self.loadMuteUserList();
        window.addEventListener('applozicAppInitialized', this.applozicAppInitialized, false);
        window.addEventListener('onMessageEvent', this.onMessageEvent, false);
        window.addEventListener('onMessageReceived', this.onMessageReceived, false);
        window.addEventListener("resize", this.resize.bind(this));
    }
    resize() {
        this.setState({ isSmallerScreen: window.innerWidth <= 767 });
    }
    applozicAppInitialized = (e) => {
        this.loadConversations(false, this.state.msgId, this.state.msgId);
    }
    onMessageReceived = (e) => {
        this.loadConversations(true, e.detail.message.to);
    }
    onMessageEvent(e) {
    }
    refreshForNewMessages = () => {
        this.loadConversations(true);
    }
    componentDidUpdate() {
    }
    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps");
        const msgId = nextProps.msgId == "all" || nextProps.msgId == "new" ? null : Number(nextProps.msgId);
        let nextState = {
            msgId: msgId,
            compose: nextProps.msgId == "new"
        };
        if (msgId == null) {
            nextState['selectedConversation'] = null;
        }
        this.setState(nextState);
        this.loadConversations(false, msgId, msgId);
    }
    componentWillUnmount() {
        // clearInterval(this.state.intervalId);
        window.removeEventListener('applozicAppInitialized', this.onMessageEvent, false);
        window.removeEventListener('onMessageEvent', this.onMessageEvent, false);
        window.removeEventListener('onMessageReceived', this.onMessageReceived, false);
    }

    onConversationSelect(msg) {
        // console.log(msg);
        if (!this.loading && (!this.state.selectedConversation || this.state.selectedConversation.key != msg.key)) {
            let newState = { selectedConversation: msg, selectedConversationMessages: [], compose: false };
            if (msg.groupId) {
                newState["editGroupName"] = this.state.groupFeeds[msg.groupId]["name"];
                newState["editGroupImageUrl"] = this.state.groupFeeds[msg.groupId]["imageUrl"];
            }
            newState["loading"] = true;
            newState["smallerScreenSection"] = "convMsgs";
            this.setState(newState);
            // this.loading = true;
            this.loadConversationMessages(msg, new Date().getTime(), true);
        } else if (this.state.isSmallerScreen && !this.loading) {
            this.setState({ smallerScreenSection: "convMsgs" });
            this.loadConversationMessages(msg, new Date().getTime(), true);
        }
    }

    conversationHead(msg) {
        let currentUserId = this.state.userInfo.id;
        if (msg.groupId) {
            let info = this.state.groupFeeds[msg.groupId];
            let groupHead = { type: "group", title: info.name, image: (info.imageUrl ? info.imageUrl : placeholderGroup), imagePresent: (info.imageUrl && info.imageUrl != "" && info.imageUrl != null && info.imageUrl != CHAT_GROUP_DEFAULT_AVATAR ? true : false), isMuted: (info.notificationAfterTime && info.notificationAfterTime > new Date().getTime()), info: info };
            groupHead["disabled"] = (info.removedMembersId && info.removedMembersId.indexOf(currentUserId) >= 0);
            return groupHead;
        } else {
            let info = this.state.userDetails[msg.contactIds];
            const muteInfo = this.state.muteUserList[msg.contactIds];
            let convHead = info ? { type: 'user', title: info['displayName'], image: (info.imageLink ? info.imageLink : placeholderUser), imagePresent: (info.imageLink && info.imageLink != "" && info.imageLink != null ? true : false), info: info, isMuted: (muteInfo && muteInfo.notificationAfterTime && muteInfo.notificationAfterTime > new Date().getTime()) } : {};
            return convHead;
        }
    }

    handleContactSelection(e, dropdownEl) {
        // console.log(e);
        let self = this;
        // console.log(dropdownEl.value);
        if (dropdownEl.value.length == 1) {
            //open selected contact's conversation
            let userId = dropdownEl.value[0];
            let selectedConversation = null;
            _.forEach(this.state.messages, function (msg) {
                if (userId == msg.contactIds && !msg.groupId) {
                    selectedConversation = msg;
                }
            });
            if (!selectedConversation || selectedConversation == null) {
                selectedConversation = { contactIds: userId };
            }
            if (selectedConversation) {
                self.setState({ selectedConversation: selectedConversation, selectedConversationMessages: [], newGroupMemberIds: dropdownEl.value });
                self.loadConversationMessages(selectedConversation, new Date().getTime(), true);
            }
        } else {
            this.setState({ selectedConversation: null, newGroupMemberIds: dropdownEl.value });
            //new group conversation
        }
    }

    onSendKeyClick(refName) {
        const self = this;
        if (self.refs[refName] && self.refs[refName].value.trim() != "") {
            if (refName == "currentConvMessageTextRef") {
                self.sendMessageToSelectedConversation(self.state.selectedConversation, self.refs[refName].value, true);
            } else if (refName == "newConvMessageTextRef") {
                let groupId = self.createGroup({ send: true, message: self.refs[refName].value });
            }
            self.refs[refName].value = "";
        }
    }

    handleComposeMessageKeyDown(e) {
        // console.log(this);
        // console.log(this.refs.groupContactIds);
        // console.log(this.refs.groupContactIds.state.value);
        if (!e.shiftKey && e.key === 'Enter' && e.target.value.trim() != "") {
            let groupId = this.createGroup({ send: true, message: e.target.value });
            // console.log("Group Create with ID " + groupId);
            e.target.value = "";
            e.preventDefault();
        }
    }

    handleMessageKeyDown(e) {
        const self = this;
        if (!e.shiftKey && e.key === 'Enter') {
            // console.log(e.target.value);
            self.sendMessageToSelectedConversation(this.state.selectedConversation, e.target.value, true);
            e.target.value = "";
            e.preventDefault();
        }
    }

    onConversationSearchChange(e) {
        let self = this;
        // Variable to hold the original version of the list
        let currentList = [];
        // Variable to hold the filtered list before putting into state
        let newList = [];

        // If the search bar isn't empty
        if (self.refs.conversationSearchEl && self.refs.conversationSearchEl.inputRef && self.refs.conversationSearchEl.inputRef.current && self.refs.conversationSearchEl.inputRef.current.value) {
            // Assign the original list to currentList
            currentList = self.state.messages;

            // Use .filter() to determine which items should be displayed
            // based on the search terms
            newList = currentList.filter(item => {
                // change current item to lowercase
                const convHead = self.conversationHead(item);
                const lc = convHead && convHead.title ? convHead.title.toLowerCase() : "";
                // change search term to lowercase
                const filter = self.refs.conversationSearchEl.inputRef.current.value.toLowerCase();
                // check to see if the current list item includes the search term
                // If it does, it will be added to newList. Using lowercase eliminates
                // issues with capitalization in search terms and search content
                return lc.includes(filter);
            });
        } else {
            // If the search bar is empty, set newList to original task list
            newList = self.state.messages;
        }

        // let selectedConversationMessages = [];
        // Set the filtered state based on what our rules added to newList
        let newState = {
            filteredMessages: newList,
            selectedConversation: newList.length > 0 ? newList[0] : null
            // selectedConversationMessages: selectedConversationMessages
        };
        if (newState.selectedConversation && newState.selectedConversation.groupId) {
            newState["editGroupName"] = self.state.groupFeeds[newState.selectedConversation.groupId]["name"];
            newState["editGroupImageUrl"] = self.state.groupFeeds[newState.selectedConversation.groupId]["imageUrl"];
        }
        this.setState(newState);
        self.loadConversationMessages(newList.length > 0 ? newList[0] : null, new Date().getTime(), true);
    }
    timeString(timestamp, isForLeftConvList) {
        let d = new Date(timestamp);
        let dateStr = this.getDateString(timestamp);
        let timeStr = ((d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes());
        if (!isForLeftConvList || dateStr == "Today") {
            return timeStr;
        } else {
            return dateStr;
        }
    }
    handleScroll(e) {
        // console.log(e.target.scrollTop);
        if (e.target && e.target.scrollTop <= 50 && self.state.selectedConversationMessages && self.state.selectedConversationMessages.length > 0) {
            self.loadConversationMessages(self.state.selectedConversation, self.state.selectedConversationMessages[0].createdAtTime);
        }
    }
    handleNewGroupEdit(e) {
        this.setState({ editGroup: true });
    }

    handleNewGroupEditDone(e) {
        if (this.refs.groupName.inputRef.current.value.trim() != "") {
        this.setState({ editGroup: false });
            this.setState({ newGroupName: this.refs.groupName.inputRef.current.value });
    }
    }

    getCurrentUserRoleInGroup(groupFeed) {
        let groupUsers = groupFeed.groupUsers;
        let userId = this.state.userInfo.id;
        let userInfo = {};
        _.forEach(groupUsers, function (user) {
            if (user.userId == userId) {
                // console.log(user);
                userInfo = user;
            }
        });
        return userInfo;
    }
    render() {
        let self = this;
        return (
            <Fragment>
                {(() => {
                    if (self.isLoading()) {
                        return <Dimmer active inverted>
                            <Loader size='large'>Loading</Loader>
                        </Dimmer>
                    }
                })()}
                <div className="messageMainWraper">
                    <Container>
                        <div className="messageHeader">
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column mobile={8} tablet={12} computer={13}>
                                        <div className="pt-1 pb-1">
                                            <Header as='h2'>
                                                {self.state.isSmallerScreen && !self.state.compose && self.state.smallerScreenSection != "convList" ? <Button className={"back-btn-messages"} onClick={() => { self.setState({ smallerScreenSection: "convList", filteredMessages: self.state.messages }) }} style={{ float: "left" }}><Icon name="chevron left" /></Button> : ""}
                                                Messages
                                            </Header>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column mobile={8} tablet={4} computer={3} className="text-right">
                                        <div className="pb-1 compose-btn-wrapper">
                                            <Button className={"" + (self.state.compose ? " red-btn-rounded-def red" : "success-btn-rounded-def")} onClick={() => { self.composeNew() }}><Icon name={self.state.compose ? "close icon" : "edit icon"} />{self.state.isSmallerScreen ? "" : (self.state.compose ? "Cancel" : "Compose")}</Button>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                        <div className="messageWraper">
                            <Grid stretched>
                                <Grid.Row>
                                    <Grid.Column className="remove-pad-right" mobile={16} tablet={6} computer={5}>
                                        {/* <InboxPeople /> */}
                                        <div className="messageLeftMenu">
                                            <div className="messageLeftSearch">
                                                {self.state.messages && self.state.messages.length > 0 && (!self.state.isSmallerScreen || (self.state.smallerScreenSection == "convList" && !self.state.compose)) ? <Input fluid iconPosition='left' icon='search' placeholder='Search...' ref="conversationSearchEl" onChange={this.onConversationSearchChange.bind(this)} /> : ""}
                                            </div>
                                            <div className="chatList">
                                                <List divided verticalAlign='middle'>
                                                    {(() => {
                                                        // if (self.isLoading()) {
                                                        // return <Dimmer active inverted>
                                                        //     <Loader size='large'>Loading</Loader>
                                                        // </Dimmer>
                                                        //   <Placeholder>
                                                        //         <Placeholder.Header>
                                                        //             <Placeholder.Line length="medium" />
                                                        //         </Placeholder.Header>
                                                        //         <Placeholder.Paragraph>
                                                        //             <Placeholder.Line />
                                                        //             <Placeholder.Line />

                                                        //         </Placeholder.Paragraph>
                                                        //     </Placeholder>
                                                        // }
                                                        if (self.state.filteredMessages && self.state.filteredMessages.length > 0 && (!self.state.isSmallerScreen || (self.state.smallerScreenSection == "convList" && !self.state.compose))) {
                                                            return self.state.filteredMessages.map((msg) => (
                                                                <List.Item as="a" active={self.state.selectedConversation && msg.key == self.state.selectedConversation.key} key={"head_" + msg.key} onClick={() => self.onConversationSelect(msg)}>
                                                                    <List.Content floated='right'>
                                                                        <div className="time">
                                                                            {self.timeString(msg.createdAtTime, true)}
                                                                        </div>
                                                                        <div className="iconWraper">
                                                                            {self.conversationHead(msg).isMuted ? <Icon name="mute" /> : ""}
                                                                        </div>
                                                                    </List.Content>
                                                                    <Image avatar src={(self.conversationHead(msg).image)} />
                                                                    <List.Content>
                                                                        <List.Header as='a'><span className={self.conversationHead(msg)["info"]["unreadCount"] > 0 ? "newMessage" : ""}>{self.conversationHead(msg).title}</span></List.Header>
                                                                        <List.Description dangerouslySetInnerHTML={{ __html: msg.message.replace(/<br\s*\/?>/gi, ' ') }}></List.Description>
                                                                    </List.Content>
                                                                </List.Item>
                                                            ));
                                                        }
                                                    })()}
                                                </List>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column className="remove-pad-left" mobile={16} tablet={10} computer={11}>
                                        <div className="chatSection">
                                            {(() => {
                                                if (self.state.compose && (!self.state.isSmallerScreen || self.state.smallerScreenSection != "convList")) {
                                                    return <Fragment>
                                                        <div className="chatHeader">
                                                            {(() => {
                                                                if (self.state.newGroupMemberIds.length <= 0) {
                                                                    return <div className="chatWith">New Message</div>
                                                                }
                                                                else if (self.state.selectedConversation) {
                                                                    return <div className="chatWith">
                                                                        Message with {this.state.selectedConversation ? (this.state.userDetails[this.state.selectedConversation.contactIds] ? this.state.userDetails[this.state.selectedConversation.contactIds].displayName : "") : ""}
                                                                    </div>
                                                                } else {
                                                                    return <div className="chatWithGroup">
                                                                        <List divided verticalAlign='middle'>
                                                                            <List.Item>
                                                                                <List.Content floated='right'>
                                                                                    <div className="moreOption"></div>
                                                                                </List.Content>
                                                                                <Popup className="moreOptionPopup" open={self.state.groupAction == "IMAGE_ACTION"} onClose={() => self.setGroupAction(null)}
                                                                                    trigger={<Image avatar onClick={() => self.setGroupAction("IMAGE_ACTION")} src={self.state.newGroupImageUrl ? self.state.newGroupImageUrl : placeholderGroup} />} basic position='bottom left' on='click'>
                                                                                    <Popup.Content>
                                                                                        <List>
                                                                                            {(() => {
                                                                                                return (
                                                                                                    <Fragment>
                                                                                                        <input id="myInput" accept="images/*" type="file" onChange={(event) => self.onGroupImageChange(event, {}, true)} ref={(ref) => this.newUpload = ref} style={{ display: 'none' }} />
                                                                                                        <List.Item as='a' onClick={(e) => this.newUpload.click()}>Upload photo</List.Item>
                                                                                                    </Fragment>
                                                                                                )
                                                                                            })()}
                                                                                        </List>
                                                                                    </Popup.Content>
                                                                                </Popup>
                                                                                <List.Content className="grpNameEdit">
                                                                                    {(() => {
                                                                                        if (self.state.editGroup) {
                                                                                            return <Fragment><Input maxLength="25" placeholder='Group Title' ref="groupName" onKeyDown={(e) => { }} value={self.state.newGroupName} onChange={(e) => { self.setState({ newGroupName: e.target.value }) }} /><span className="charCount" ref="groupNameCharCount">{self.state.newGroupName.length}/25</span><Button className="EditGrpName" onClick={self.handleNewGroupEditDone.bind(this)}><Icon name="check circle" /></Button></Fragment>
                                                                                        } else {
                                                                                            return <Fragment>{self.state.newGroupName}<Button className="EditGrpName" onClick={self.handleNewGroupEdit.bind(this)}><Icon name="pencil" /></Button></Fragment>;
                                                                                        }
                                                                                    })()}
                                                                                </List.Content>
                                                                            </List.Item>
                                                                        </List>
                                                                    </div>
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="chatContent">
                                                            <div className="mesgs-1" style={self.state.selectedConversation ? {} : { height: '60vh' }}>
                                                                <div className="msg_history">
                                                                    <div className="recipients">
                                                                        <div className="lbl">
                                                                            To
                                                                    </div>
                                                                        <div className="inputWraper">
                                                                            <Dropdown
                                                                                ref="groupContactIds"
                                                                                clearable
                                                                                fluid
                                                                                multiple
                                                                                search
                                                                                selection
                                                                                value={self.state.newGroupMemberIds}
                                                                                options={self.getFriendsListDropDownOptions()}
                                                                                onChange={self.handleContactSelection.bind(self)}
                                                                                placeholder='Type a name or multiple names...'
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {(() => {
                                                            if (!self.state.selectedConversation && self.state.newGroupMemberIds.length > 0) {
                                                                return <div className="chatFooter">
                                                                    <Form>
                                                                        <Form.Field>
                                                                            <textarea rows="1" placeholder='Type a message…' ref="newConvMessageTextRef" onKeyDown={self.handleComposeMessageKeyDown.bind(this)}></textarea>
                                                                            <Button circular icon='paper plane outline' className="sendMsgBtn" onClick={() => { self.onSendKeyClick("newConvMessageTextRef") }}></Button>
                                                                        </Form.Field>
                                                                    </Form>
                                                                </div>
                                                            }
                                                        })()}

                                                    </Fragment>
                                                } else {
                                                    if (this.state.selectedConversation && self.conversationHead(this.state.selectedConversation).type == "group" && self.state.selectedConversation.groupId && (!self.state.isSmallerScreen || self.state.smallerScreenSection != "convList")) {
                                                        const groupFeed = self.state.groupFeeds[self.state.selectedConversation.groupId];
                                                        const currentUserInfo = self.getCurrentUserRoleInGroup(groupFeed);
                                                        const conversationInfo = self.conversationHead(self.state.selectedConversation);
                                                        // return <ChatNameHeadGroup selectedConversation={this.state.selectedConversation} userDetails={this.state.userDetails} groupFeeds={this.state.groupFeeds} />
                                                        return (<div className="chatHeader">
                                                            <div className="chatWithGroup">
                                                                <Modal size="tiny" open={self.state.groupActionError != null} onClose={() => self.setState({ groupActionError: null, groupAction: null })} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Error uploading photo</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">{self.state.groupActionError}</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setState({ groupActionError: null, groupAction: null })}>Close</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>

                                                                <Modal size="tiny" open={self.state.groupAction == 'REMOVE_USER'} onClose={() => self.setGroupAction("MEMBERS_LIST")} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Remove {self.state.groupUserName}?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">{self.state.groupUserName} will be removed from this conversation.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="red-btn-rounded-def red" onClick={() => { self.removeUserFromGroup(self.state.groupId, self.state.userId); self.setGroupAction("MEMBERS_LIST"); }}>Remove</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction("MEMBERS_LIST")}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" open={self.state.groupAction == 'REMOVE_ADMIN'} onClose={() => self.setGroupAction("MEMBERS_LIST")} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Remove admin status?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">{self.state.groupUserName} will no longer be able to manage all the members of this group chat.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="red-btn-rounded-def red" onClick={() => { self.updateGroupDetails(self.state.groupId, self.state.groupUserInfo); self.setGroupAction("MEMBERS_LIST") }}>Remove admin status</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction("MEMBERS_LIST")}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" open={self.state.groupAction == 'MAKE_USER_ADMIN'} onClose={() => self.setGroupAction("MEMBERS_LIST")} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Make {self.state.groupUserName} group chat admin for group name?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">As an administrator, {self.state.groupUserName} will be able to manage all the members of this group chat.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => { self.updateGroupDetails(self.state.groupId, self.state.groupUserInfo); self.setGroupAction("MEMBERS_LIST") }}>Make group admin</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction("MEMBERS_LIST")}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal open={self.state.groupAction == 'MEMBERS_LIST'} onClose={() => self.setGroupAction(null)} size="tiny" dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Members</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">
                                                                            <div className="messageSearch">
                                                                                <Input type="text" fluid iconPosition='left' onChange={self.memberSearchTextChange} icon='search' placeholder='Search...' value={self.state.memberSearchText} />
                                                                            </div>
                                                                            <div className="swichAccounts mt-2 mb-2">
                                                                            <List divided verticalAlign='middle'>
                                                                                {(() => {
                                                                                    // if (self.state.selectedConversation && self.state.selectedConversation.groupId) {
                                                                                    {
                                                                                        return groupFeed.groupUsers.filter(function (user) {
                                                                                            return self.state.memberSearchText == "" || self.state.userDetails[user.userId].displayName.toLowerCase().indexOf(self.state.memberSearchText.toLowerCase()) >= 0;
                                                                                        }).map(function (user) {
                                                                                            return (
                                                                                                <List.Item key={"member_" + user.userId}>
                                                                                                    <List.Content floated='right'>
                                                                                                        {(() => {
                                                                                                                if (user.userId != self.state.userInfo.id) {
                                                                                                                return <Popup className="moreOptionPopup"
                                                                                                                    trigger={<Button className="moreOption-btn transparent" circular>
                                                                                                                        <Image src={moreIcon} ref={self.contextRef} />
                                                                                                                    </Button>} basic position='bottom right' on='click'>
                                                                                                                    <Popup.Content>
                                                                                                                        <List>
                                                                                                                            {/* <List.Item as='a' onClick={() => self.setGroupAction('MEMBERS_LIST')}>Message</List.Item> */}
                                                                                                                        <List.Item as='a'> <Link route={"/users/profile/" + user.userId}><a>View profile</a></Link></List.Item>
                                                                                                                                {/* {user.userId != self.state.userInfo.id && currentUserInfo.role == "1" && user.role != "1" ? <List.Item as='a' onClick={() => self.updateGroupDetails(groupFeed.clientGroupId, [{ "userId": Number(user.userId), "role": "1" }])}>Make group admin</List.Item> : ""} */}
                                                                                                                                {user.userId != self.state.userInfo.id && currentUserInfo.role == "1" && user.role != "1" ? <List.Item as='a' onClick={() => self.setGroupAction("MAKE_USER_ADMIN", false, { groupId: groupFeed.clientGroupId, groupUserInfo: [{ "userId": Number(user.userId), "role": "1" }], groupUserName: self.state.userDetails[user.userId].displayName || "User" })}>Make group admin</List.Item> : ""}
                                                                                                                                {/* {user.userId != self.state.userInfo.id && currentUserInfo.role == "1" && user.role == "1" ? <List.Item as='a' onClick={() => self.updateGroupDetails(groupFeed.clientGroupId, [{ "userId": Number(user.userId), "role": "3" }])}>Remove group admin</List.Item> : ""} */}
                                                                                                                                {user.userId != self.state.userInfo.id && currentUserInfo.role == "1" && user.role == "1" ? <List.Item as='a' onClick={() => self.setGroupAction("REMOVE_ADMIN", false, { groupId: groupFeed.clientGroupId, groupUserInfo: [{ "userId": Number(user.userId), "role": "3" }], groupUserName: self.state.userDetails[user.userId].displayName || "User" })}>Remove admin status</List.Item> : ""}
                                                                                                                        {user.userId != self.state.userInfo.id && currentUserInfo.role == "1" && user.role != "1" ? <Divider /> : ""}
                                                                                                                                {/* {user.userId != self.state.userInfo.id && currentUserInfo.role == "1" ? <List.Item as='a' className="red" onClick={() => self.removeUserFromGroup(groupFeed.clientGroupId, user.userId)}>Remove from conversation</List.Item> : ""} */}
                                                                                                                                {user.userId != self.state.userInfo.id && currentUserInfo.role == "1" ? <List.Item as='a' className="red" onClick={() => self.setGroupAction("REMOVE_USER", false, { groupId: groupFeed.clientGroupId, userId: user.userId, groupUserName: self.state.userDetails[user.userId].displayName || "User" })}>Remove from conversation</List.Item> : ""}
                                                                                                                        </List>
                                                                                                                    </Popup.Content>
                                                                                                                </Popup>
                                                                                                                }
                                                                                                        })()}
                                                                                                    </List.Content>
                                                                                                        <Image avatar src={self.state.userDetails[user.userId] && self.state.userDetails[user.userId].imageLink ? self.state.userDetails[user.userId].imageLink : placeholderUser} />
                                                                                                    <List.Content>
                                                                                                            <List.Header as='a'>{self.state.userDetails[user.userId].displayName || "User"} {(Number(user.userId) == Number(self.state.userInfo.id) ? "(You)" : "")} {user.role == "1" ? " (Admin)" : ""}</List.Header>
                                                                                                        {/* <List.Description></List.Description> */}
                                                                                                    </List.Content>
                                                                                                </List.Item>
                                                                                            )
                                                                                        });
                                                                                    }
                                                                                    // }
                                                                                })()}

                                                                            </List>
                                                                            </div>
                                                                        </Modal.Description>
                                                                        {/* <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.setGroupAction(null)}>Done1</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div> */}
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" open={self.state.groupAction == 'MEMBERS_ADD'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Add members</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">
                                                                            <div className="inputWraper">
                                                                                <Dropdown
                                                                                    noResultsMessage={null}
                                                                                    options={self.state.groupAddMemberOptions}
                                                                                    placeholder='Type a name or multiple names'
                                                                                    // search
                                                                                    selection
                                                                                    fluid
                                                                                    multiple
                                                                                    value={self.state.groupAddMemberValues}
                                                                                    //onAddItem={self.handleGroupAddMemberSelected}
                                                                                    onChange={self.handleGroupAddMemberChange}
                                                                                />

                                                                                {/* <Input fluid iconPosition='left' placeholder='Add members...' /> */}
                                                                            </div>
                                                                            <div className="swichAccounts mt-2 mb-2">
                                                                            <List divided verticalAlign='middle'>
                                                                                {(() => {
                                                                                    if (self.state.selectedConversation && self.state.selectedConversation.groupId) {
                                                                                        let groupFeed = self.state.groupFeeds[self.state.selectedConversation.groupId];
                                                                                        // console.log(groupFeed);
                                                                                        {
                                                                                            return Object.keys(self.state.userDetails).map(function (userId) {
                                                                                                let user = self.state.userDetails[userId];
                                                                                                if (user.userId != self.state.userInfo.id && (user.displayName || user.userName) && groupFeed.membersId.indexOf(user.userId+"") < 0) {
                                                                                                    return (<List.Item key={"member_" + user.userId}>
                                                                                                        <List.Content floated='right' className="ui checkbox">
                                                                                                            {/* <input value={user.userId} onChange={(e) => self.onMemberSelectForAddition(e, (user.displayName || user.userName))} checked={self.state.groupAddMemberValues.indexOf(user.userId + "") >= 0} type="checkbox" className="cp_chkbx" tabIndex="0" /> */}
                                                                                                            <Checkbox className="cp_chkbx" value={user.userId} onClick={(e) => self.onMemberSelectForAddition(user.userId + "", (user.displayName || user.userName))} checked={self.state.groupAddMemberValues.indexOf(user.userId + "") >= 0} />
                                                                                                        </List.Content>
                                                                                                            <Image avatar src={self.state.userDetails[user.userId] && self.state.userDetails[user.userId].imageLink ? self.state.userDetails[user.userId].imageLink : placeholderUser} />
                                                                                                        <List.Content>
                                                                                                            <List.Header as='a'>{user.displayName ? user.displayName : user.userName}</List.Header>
                                                                                                            {/* <List.Description></List.Description> */}
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
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.addSelectedUsersToGroup(groupFeed.clientGroupId)}>Add</Button>
                                                                            {/* <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button> */}
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" open={self.state.groupAction == 'MUTE_NOTIFICATIONS'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                                                                    <Modal.Header>Mute conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.muteOrUnmuteConversation(self.state.selectedConversation, true)}>Mute</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>

                                                                <Modal size="tiny" open={self.state.groupAction == 'UNMUTE_NOTIFICATIONS'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                                                                    <Modal.Header>Unmute conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">You can mute this conversation anytime.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.muteOrUnmuteConversation(self.state.selectedConversation, false)}>Unmute</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>


                                                                <Modal size="tiny" open={self.state.groupAction == 'LEAVE_GROUP'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                                                                    <Modal.Header>Leave conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">You won't get messages from this group chat unless another member adds you back into the chat.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.leaveGroup(self.state.selectedConversation.groupId)}>Leave conversation</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>

                                                                <Modal size="tiny" open={self.state.groupAction == 'DELETE_GROUP'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                                                                    <Modal.Header>Delete group?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">Cannot undo this action. All the messages in this group will be deleted permanentaly.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="red-btn-rounded-def red c-small" onClick={() => self.deleteGroup(self.state.selectedConversation.groupId)}>Delete</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>

                                                                <Modal size="tiny" open={self.state.groupAction == 'REMOVE_GROUP_IMAGE'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={true}>
                                                                    <Modal.Header>Remove group image?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">Cannot undo this action. The image of the group will be removed for all members.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="red-btn-rounded-def red c-small" onClick={() => self.updateGroupDetails(self.state.selectedConversation.groupId, false, { imageLink: " " }, true)}>Remove</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" open={self.state.groupAction == "VIEW_GROUP_IMAGE"} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal image-modal" style={{ backgroundImage: 'url(' + conversationInfo.image + ')' }} closeIcon centered={false}></Modal>
                                                                <List divided verticalAlign='middle'>
                                                                    <List.Item>
                                                                        {(() => {
                                                                            if (!conversationInfo.disabled) {
                                                                                return (
                                                                                    <List.Content floated='right'>
                                                                                        <Popup open={self.state.showMoreOptions} onClose={() => { self.setState({ showMoreOptions: false }) }} className="moreOptionPopup"
                                                                                            trigger={<Button onClick={self.setShowMoreOptions} className="moreOption-btn transparent" circular >
                                                                                                <Image src={moreIcon} ref={this.contextRef} />
                                                                                            </Button>} basic position='bottom right' on='click'>
                                                                                            <Popup.Content>
                                                                                                <List>
                                                                                                    <List.Item as='a' onClick={() => self.setGroupAction('MEMBERS_LIST', true)}>See members</List.Item>
                                                                                                    {currentUserInfo.role == "1" ? <List.Item as='a' onClick={() => self.setGroupAction('MEMBERS_ADD', true)}>Add members</List.Item> : ""}
                                                                                                    {conversationInfo.isMuted ? <List.Item as='a' onClick={() => self.setGroupAction('UNMUTE_NOTIFICATIONS', true)}>Unmute</List.Item> : <List.Item as='a' onClick={() => self.setGroupAction('MUTE_NOTIFICATIONS', true)}>Mute</List.Item>}
                                                                                                    <Divider />
                                                                                                    <List.Item as='a' onClick={() => self.setGroupAction('LEAVE_GROUP', true)} className="red">Leave conversation</List.Item>
                                                                                                </List>
                                                                                            </Popup.Content>
                                                                                        </Popup>
                                                                                    </List.Content>)
                                                                            } else {
                                                                                return (
                                                                                    <List.Content floated='right'>
                                                                                        <Popup open={self.state.showMoreOptions} onClose={() => { self.setState({ showMoreOptions: false }) }} className="moreOptionPopup"
                                                                                            trigger={<Button onClick={self.setShowMoreOptions} className="moreOption-btn transparent" circular >
                                                                                                <Image src={moreIcon} ref={this.contextRef} />
                                                                                            </Button>} basic position='bottom right' on='click'>
                                                                                            <Popup.Content>
                                                                                                <List>
                                                                                                    <List.Item as='a' onClick={() => self.setGroupAction('DELETE_GROUP', true)} className="red">Delete group</List.Item>
                                                                                                </List>
                                                                                            </Popup.Content>
                                                                                        </Popup>
                                                                                    </List.Content>)
                                                                            }
                                                                        })()}
                                                                        <Popup className="moreOptionPopup" open={self.state.groupAction == "IMAGE_ACTION"} onClose={() => self.setGroupAction(null)}
                                                                            trigger={<Image avatar onClick={() => self.setGroupAction("IMAGE_ACTION")} src={conversationInfo.image} />} basic position='bottom left' on='click'>
                                                                            <Popup.Content>
                                                                                <List>
                                                                                    {(() => {
                                                                                        if (conversationInfo.imagePresent) {
                                                                                            return <List.Item as='a'  onClick={(e) => self.setGroupAction("VIEW_GROUP_IMAGE", true)}>View photo</List.Item>
                                                                                        }
                                                                                    })()}

                                                                                    {(() => {
                                                                                        if (!conversationInfo.disabled) {
                                                                                            return (
                                                                                                <Fragment>
                                                                                                    <input id="myInput" accept="images/*" type="file" onChange={(event) => { self.onGroupImageChange(event, conversationInfo) }} ref={(ref) => this.upload = ref} style={{ display: 'none' }} />
                                                                                                    <List.Item as='a' onClick={(e) => this.upload.click()}>Upload photo</List.Item>
                                                                                                    {conversationInfo.imagePresent ? <List.Item as='a' onClick={(e) => self.setGroupAction("REMOVE_GROUP_IMAGE", true)}>Remove photo</List.Item> : ""}
                                                                                                </Fragment>
                                                                                            )
                                                                                        }
                                                                                    })()}
                                                                                </List>
                                                                            </Popup.Content>
                                                                        </Popup>

                                                                        <List.Content className="grpNameEdit">
                                                                            {(() => {
                                                                                if (self.state.editGroup) {
                                                                                    return <Fragment>
                                                                                        <Input maxLength="25" placeholder='Name this group chat' ref="groupName" value={self.state.editGroupName} onChange={(e) => { self.setState({ editGroupName: e.target.value }) }} />
                                                                                        <span className="charCount" ref="groupNameCharCount">{self.state.editGroupName.length}/25</span>
                                                                                        <Button className="EditGrpName" onClick={() => { self.updateGroupDetails(self.state.selectedConversation.groupId); self.setState({ editGroup: false }); }}><Icon name="check circle" /></Button>
                                                                                    </Fragment>
                                                                                } else {
                                                                                    return (<Fragment>{conversationInfo.title} {conversationInfo.disabled ? "" : <Button className="EditGrpName" onClick={() => { self.setState({ editGroup: true }) }}><Icon name="pencil" /></Button>}</Fragment>);
                                                                                }
                                                                            })()}
                                                                            {/* {self.conversationHead(self.state.selectedConversation).title}
                                                                            <Button className="EditGrpName"><Icon name="pencil" /></Button>
                                                                            <Button className="EditGrpName"><Icon name="check circle" /></Button> */}
                                                                        </List.Content>
                                                                    </List.Item>
                                                                </List>
                                                            </div>
                                                        </div>)
                                                    } else if (this.state.selectedConversation && (!self.state.isSmallerScreen || self.state.smallerScreenSection != "convList")) {
                                                        const conversationInfo = self.conversationHead(self.state.selectedConversation);
                                                        // return <ChatNameHead selectedConversation={this.state.selectedConversation} userDetails={this.state.userDetails} groupFeeds={this.state.groupFeeds} />
                                                        return <div className="chatHeader">
                                                            <div className="chatWith">
                                                                Message with {this.state.selectedConversation ? this.state.userDetails[this.state.selectedConversation.contactIds].displayName : ""}
                                                            </div>
                                                            <div className="moreOption">
                                                                {/* <Button className="moreOption-btn transparent" circular onClick={self.setShowMoreOptions}><Image src={moreIcon} ref={this.contextRef} /></Button> */}
                                                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => self.setState({ conversationAction: null })} closeIcon open={self.state.conversationAction == "MUTE"} centered={true}>
                                                                    <Modal.Header>Mute conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.muteOrUnmuteConversation(self.state.selectedConversation, true)}>Mute</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setState({ conversationAction: null })}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => self.setState({ conversationAction: null })} closeIcon open={self.state.conversationAction == "UNMUTE"} centered={true}>
                                                                    <Modal.Header>Unmute conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">You can mute this conversation anytime.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.muteOrUnmuteConversation(self.state.selectedConversation, false)}>Unmute</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setState({ conversationAction: null })}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => self.setState({ conversationAction: null })} closeIcon open={self.state.conversationAction == "DELETE"} centered={true}>
                                                                    <Modal.Header>Delete conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">Deleting removes conversations from inbox, but no ones else’s inbox.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="red-btn-rounded-def red c-small" onClick={(e) => self.deleteConversation({ userId: this.state.selectedConversation.contactIds })}>Delete</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setState({ conversationAction: null })}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Popup open={self.state.showMoreOptions} onClose={() => { self.setState({ showMoreOptions: false }) }} className="moreOptionPopup" basic position='bottom right' trigger={<Button className="moreOption-btn transparent" circular onClick={self.setShowMoreOptions}><Image src={moreIcon} ref={this.contextRef} /></Button>} on="click">
                                                                    <Popup.Content>
                                                                        <List>
                                                                            <List.Item as='a' onClick={() => { self.setState({ showMoreOptions: false }) }}> <Link route={"/users/profile/" + this.state.selectedConversation.contactIds}><a>View profile</a></Link></List.Item>
                                                                            {conversationInfo.isMuted ? <List.Item as='a' onClick={() => { self.setState({ showMoreOptions: false, conversationAction: "UNMUTE" }) }}>Unmute</List.Item> : <List.Item as='a' onClick={() => { self.setState({ showMoreOptions: false, conversationAction: "MUTE" }) }}>Mute</List.Item>}
                                                                            <List.Item as='a' onClick={() => { self.setState({ showMoreOptions: false, conversationAction: "DELETE" }) }}>Delete conversation</List.Item>
                                                                        </List>
                                                                    </Popup.Content>
                                                                </Popup>
                                                            </div>
                                                        </div>
                                                    }
                                                }
                                            })()}
                                            {(() => {
                                                if (this.state.selectedConversation && (!self.state.isSmallerScreen || self.state.smallerScreenSection != "convList")) {
                                                    const conversationInfo = self.conversationHead(self.state.selectedConversation);
                                                    const msgsByDate = self.groupMessagesByDate(self.state.selectedConversationMessages, {});
                                                    // return <ChatHistory selectedConversation={this.state.selectedConversation} userDetails={this.state.userDetails} groupFeeds={this.state.groupFeeds} />
                                                    return <Fragment>
                                                        <div className="chatContent">
                                                            <div className="mesgs" ref={(el) => { self.scrollParentRef = el; }} onScroll={(event) => { }} onScroll={this.handleScroll.bind(this)}>
                                                                <div className="msg_history" ref={(ref) => this.scrollRef = ref}>
                                                                    {/* <InfiniteScroll
                                                                        pageStart={0}
                                                                        initialLoad={true}
                                                                        loadMore={this.loadMoreItems.bind(this)}
                                                                        hasMore={self.hasMore}
                                                                        threshold={250}
                                                                        isReverse={true}
                                                                        loader={<div className="loader" key={0}>Loading...</div>}
                                                                        useWindow={false}
                                                                        useCapture={true}
                                                                        getScrollParent={() => { self.scrollParentRef }}
                                                                    > */}

                                                                    {
                                                                        Object.keys(msgsByDate).map(function (dateString) {
                                                                            let msgs = msgsByDate[dateString];
                                                                            // let conversationInfo = self.conversationHead(self.state.selectedConversation);
                                                                            return (
                                                                                <Fragment key={"date_" + dateString}>
                                                                                    <div className="dateTime">{dateString}</div>
                                                                                    {msgs.map(function (msg) {
                                                                                        if (msg.metadata.action && ["0", "1", "2", "3", "4", "5", "6","8"].indexOf(msg.metadata.action) >= 0) {
                                                                                            return <div key={"msg_" + msg.key} className="dateTime">{msg.message} <span style={{ float: "right", fontSize: 10, color: "#aaa", marginBottom: 0, marginRight: 0 }}>{self.timeString(msg.createdAtTime)}</span></div>
                                                                                        }
                                                                                        else if (msg.type == 5) {
                                                                                            return <div className="outgoing_msg" key={"msg_" + msg.key}>
                                                                                                <div className="sent_msg">
                                                                                                    <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: msg.message }}></p>
                                                                                                    <div className="dateTime" style={{ textAlign: "right" }}>{self.timeString(msg.createdAtTime)}</div>
                                                                                                    {/* <span style={{ float: "right", fontSize: 10, color: "#aaa", marginBottom: 0, marginRight: -10 }}>{self.timeString(msg.createdAtTime)}</span> */}
                                                                                                </div>
                                                                                            </div>
                                                                                        } else if (msg.type == 4) {
                                                                                            return <div className="incoming_msg" key={"msg_" + msg.key}>
                                                                                                {conversationInfo.type == "group" ? <div className="incoming_msg_img"> <Image avatar src={self.state.userDetails[msg.contactIds]["imageLink"] ? self.state.userDetails[msg.contactIds]["imageLink"] : placeholderUser} alt="" /> </div> : <div className="incoming_msg_img"> <Image avatar src={self.state.userDetails[msg.contactIds]["imageLink"] ? self.state.userDetails[msg.contactIds]["imageLink"] : placeholderUser} alt="" /> </div>}
                                                                                                <div className="received_msg">
                                                                                                    <div className="received_withd_msg">
                                                                                                        {conversationInfo.type == "group" ? <div className="bold">{self.state.userDetails[msg.contactIds]["displayName"]}</div> : ""}
                                                                                                        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: msg.message }}></p>
                                                                                                        <div className="dateTime" style={{ textAlign: "right" }}>{self.timeString(msg.createdAtTime)}</div>
                                                                                                        {/* <span style={{ float: "right", fontSize: 10, color: "#aaa", marginBottom: 0, marginRight: -10 }}>{self.timeString(msg.createdAtTime)}</span> */}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    })}
                                                                                </Fragment>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="chatFooter">
                                                            {(() => {
                                                                if (!(conversationInfo.type == "group" && conversationInfo.info.removedMembersId.indexOf(self.state.userInfo.id) >= 0)) {
                                                                    return <Form>
                                                                <Form.Field>
                                                                            <textarea placeholder='Type a message…' ref="currentConvMessageTextRef" disabled={conversationInfo.type == "group" && conversationInfo.info.removedMembersId.indexOf(self.state.userInfo.id) >= 0} rows="1" onKeyDown={this.handleMessageKeyDown.bind(this)}></textarea>
                                                                            <Button circular icon='paper plane outline' className="sendMsgBtn" disabled={conversationInfo.type == "group" && conversationInfo.info.removedMembersId.indexOf(self.state.userInfo.id) >= 0} onClick={() => { self.onSendKeyClick("currentConvMessageTextRef") }}></Button>
                                                                </Form.Field>
                                                            </Form>
                                                                }
                                                            })()}
                                                        </div>
                                                    </Fragment>
                                                } else if (!self.state.compose && (!self.state.isSmallerScreen || self.state.smallerScreenSection != "convList")) {
                                                    return <div class="no-messages">{self.isLoading() ? "Loading..." : (self.refs.conversationSearchEl && self.refs.conversationSearchEl.inputRef.current.value != "" ? "No mathcing conversations found!" : "No conversations to display. Click on compose to start new!")}</div>
                                                }
                                            })()}
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Container>
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.user.auth,
        userInfo: state.user.info
    };
}

export default connect(mapStateToProps)(ChatWrapper);
