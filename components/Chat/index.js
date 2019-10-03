import React, { cloneElement, Fragment } from 'react';
//import dynamic from 'next/dynamic';
// import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import {
    Button,
    Container,
    Header,
    Divider,
    Icon,
    Image,
    Popup,
    Responsive,
    Form,
    Input,
    Dropdown,
    Modal,
    Segment,
    Visibility,
    Grid,
    List,
    Card,
    Breadcrumb,
    TextArea,
} from 'semantic-ui-react'
import _ from 'lodash';
import placeholderUser from '../../static/images/no-data-avatar-user-profile.png';
import placeholderGroup from '../../static/images/no-data-avatar-user-profile.png';
import moreIcon from '../../static/images/icons/ellipsis.svg';
import applozicApi from "../../services/applozicApi";
import graphApi from "../../services/graphApi";
import '../../static/less/message.less';

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
            newGroupMemberIds: [],
            messages: [],
            userDetails: {},
            groupFeeds: {},
            selectedConversation: null,
            selectedConversationMessages: [],
            editGroup: false,
            newGroupName: "New Group",
            newGroupImageUrl: placeholderGroup,
            editGroupName: "",
            editGroupImageUrl: placeholderGroup,
            userInfo: userInfo,
            dispatch: dispatch
        };
        this.composeNew.bind(this);
        this.setGroupAction.bind(this);
        this.groupMessagesByDate.bind(this);
        this.getDateString.bind(this);
        this.loadFriendsList.bind(this);
        this.createGroup.bind(this);
        this.deleteConversation.bind(this);
        this.getFriendsListDropDownOptions.bind(this);
        this.leaveGroup.bind(this);
        this.deleteGroup.bind(this);
        this.addUserToGroup.bind(this);
        this.removeUserFromGroup.bind(this);
        this.updateGroupDetails.bind(this);
        this.loadConversationMessages.bind(this);
        this.sendMessageToSelectedConversation.bind(this);
        this.conversationHead.bind(this);
        this.loadConversations.bind(this);
        this.onMessageReceived.bind(this);
        this.onMessageEvent.bind(this);
        this.refreshForNewMessages.bind(this);
        this.onConversationSelect.bind(this);
        this.handleContactSelection.bind(this);
        this.handleComposeMessageKeyDown.bind(this);
        this.handleMessageKeyDown.bind(this);
        this.onConversationSearchChange.bind(this);
        this.timeString.bind(this);
        this.handleScroll.bind(this);
        this.handleNewGroupEdit.bind(this);
        this.handleNewGroupEditDone.bind(this);
        this.getCurrentUserRoleInGroup.bind(this);
    }
    composeNew() {
        this.setState({ compose: !this.state.compose, newGroupMemberIds: [], newGroupName: "New Group", newGroupImageUrl: placeholderGroup, selectedConversation: (!this.state.compose ? null : (this.state.selectedConversation && this.state.selectedConversation.key ? this.state.selectedConversation : (this.state.filteredMessages ? this.state.filteredMessages[0] : null))) });
    }
    setGroupAction(action) {
        this.setState({ groupAction: action });
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

    loadFriendsList = () => {
        let self = this;
        const pageSize = 999;
        const pageNumber = 1;
        const email = this.state.userInfo.attributes.email;
        graphApi.get(`/user/myfriends?userid=${email}&page[number]=${pageNumber}&page[size]=${pageSize}&status=accepted`).then(
            (result) => {
                let userDetails = self.state.userDetails;
                let friendsList = result.data;
                _.forEach(friendsList, function (userDetailObj) {
                    if (userDetailObj.type == "users") {
                        const userDetail = userDetailObj.attributes;
                        userDetails[Number(userDetail.user_id)] = { userId: userDetail.user_id, displayName: userDetail.display_name, email: userDetail.email_hash, imageLink: userDetail.avatar };
                    }
                });
                self.setState({ userDetails: userDetails });
                self.loadConversations(false, self.state.msgId, self.state.msgId);
            },
        );

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
        applozicApi.post("/group/v2/create", params).then(function (response) {
            let groupId = response.response.id;
            let groupFeeds = self.state.groupFeeds;
            groupFeeds[groupId] = response.response;
            self.setState({ groupFeeds: groupFeeds, compose: false });
            if (messageInfo && messageInfo.send) {
                self.sendMessageToSelectedConversation({ groupId: groupId }, messageInfo.message);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    deleteConversation(params) {
        // console.log(params);
        let self = this;
        applozicApi.get("/message/delete/conversation", { params: params }).then(function (response) {
            self.loadConversations();
        }).catch(function (error) {
            console.log(error);
            self.setState({ conversationAction: null });
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
            self.loadConversations();
        });
    }

    deleteGroup(groupId) {
        let self = this;
        let params = { clientGroupId: groupId };
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.get("/group/delete", { params: params }).then(function (response) {
            self.setGroupAction(null);
            self.loadConversations();
        });
    }

    addUserToGroup(groupId, userId, role) {
        let self = this;
        let params = { clientGroupId: groupId };
        params["userId"] = userId;
        params["role"] = role;
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.post("/group/add/member", params).then(function (response) {
            self.loadConversations();
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
            self.loadConversations();
        });
    }

    updateGroupDetails(groupId, usersInfo) {
        let self = this;
        let params = { groupId: groupId };
        let currentGroupInfo = self.state.groupFeeds[groupId];
        if (!currentGroupInfo || currentGroupInfo.name != self.state.editGroupName) {
            params["newName"] = self.state.editGroupName;
        }
        if (!currentGroupInfo || currentGroupInfo.imageUrl != self.state.editGroupImageUrl) {
            params["imageUrl"] = self.state.editGroupImageUrl;
        }
        if (usersInfo) {
            params = { clientGroupId: groupId };
            params["users"] = usersInfo;
        }
        // params['_userId'] = this.state.userInfo.id;
        // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
        applozicApi.post("/group/update", params).then(function (response) {
            self.setGroupAction(null);
            self.loadConversations(false, groupId);
        });
    }

    loadConversationMessages(selectedConversation, endTime, resetMessages) {
        self = this;
        if (selectedConversation && !self.loading) {
            // console.log("loadConversationMessages");
            self.loading = true;
            let params = { endTime: endTime, pageSize: 10 }; //{ startIndex: startIndex, mainPageSize: 100, pageSize: 50 };
            if (selectedConversation.groupId) {
                params["groupId"] = selectedConversation.groupId;
            } else { params["userId"] = selectedConversation.contactIds; }
            applozicApi.get("/message/v2/list", { params: params }).then(function (response) {
                self.loading = false;
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
                    console.log(error);
                    self.setState({ selectedConversationMessages: [] });

                })
                .finally(function () {
                    self.loading = false;
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

    sendMessageToSelectedConversation(conversation, message) {
        //send the message
        if (conversation && message.replace(/(?:\r\n|\r|\n|\s)/g, '').length > 0) {
            let params = { message: message.trim().replace(/(?:\r\n|\r|\n)/g, '<br/>') };
            if (conversation.groupId) {
                params["clientGroupId"] = conversation.groupId;
            } else { params["to"] = conversation.contactIds; }
            params['contentType'] = 3;
            // params['_userId'] = this.state.userInfo.id;
            // params["_deviceKey"] = this.state.userInfo.applogicClientRegistration.deviceKey;
            applozicApi.post("/message/v2/send", params).then(function (response) {
                // handle success
                //load messages again
                self.loadConversationMessages(conversation, new Date().getTime(), true);
                self.loadConversations();
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
                    if (msg.contactIds == contactId) {
                        msg.selected = true;
                        selectedConversation = msg;
                    }
                });
            }

            let newState = { messages: response.response.message, filteredMessages: response.response.message, userDetails: userDetails, groupFeeds: groupFeeds };
            if (contactId && userDetails[contactId] && selectedConversation == null) {
                newState["compose"] = true;
                newState["newGroupMemberIds"] = [contactId];
                selectedConversation = { contactIds: contactId };
                // self.refs.groupContactIds.state.value = [contactId];
            }
            if (selectedConversation == null && response.response.message.length > 0) {
                selectedConversation = response.response.message[0];
                response.response.message[0].selected = true;
            }
            self.setState(newState);
            if (self.refs.conversationSearchEl && self.refs.conversationSearchEl.inputRef && self.refs.conversationSearchEl.inputRef.current) {
                self.refs.conversationSearchEl.inputRef.current.value = "";
            }

            if (!ignoreLoadingChatMsgs || (self.state.selectedConversation.contactIds == response.response.message[0]['contactIds'] && self.state.selectedConversation.groupId == response.response.message[0]['groupId'])) {
                // console.log("Loading Conv msgs");
                let newState = { selectedConversation: selectedConversation };
                if (selectedConversation.groupId) {
                    let groupInfo = groupFeeds[selectedConversation.groupId];
                    newState["editGroupName"] = groupInfo["name"];
                    newState["editGroupImageUrl"] = groupInfo["imageUrl"];
                }
                // newState["compose"] = false;
                self.setState(newState);
                self.loadConversationMessages(selectedConversation, new Date().getTime(), true);//(self.state.selectedConversation.contactIds != response.response.message[0]['contactIds'] || self.state.selectedConversation.groupId != response.response.message[0]['groupId'])
                // } else {
                // console.log("Skipped Loading Conv msgs"); console.log(self.conversationHead(response.response.message[0])['info']);
            }
        })
            .catch(function (error) {
                // handle error
                self.setState({ messages: [] });
            })
            .finally(function () {
                // always executed 
                // console.log("Chat Load Done!");
            });
    }

    componentDidMount() {
        let self = this;
        self.loadFriendsList();
        window.addEventListener('applozicAppInitialized', this.applozicAppInitialized, false);
        window.addEventListener('onMessageEvent', this.onMessageEvent, false);
        window.addEventListener('onMessageReceived', this.onMessageReceived, false);
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
        this.setState({
            msgId: msgId,
            compose: nextProps.msgId == "new"
        });
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
            this.setState(newState);
            // this.loading = true;
            this.loadConversationMessages(msg, new Date().getTime(), true);
        }
    }

    conversationHead(msg) {
        let currentUserId = this.state.userInfo.id;
        if (msg.groupId) {
            let info = this.state.groupFeeds[msg.groupId];
            let groupHead = { type: "group", title: info.name, image: (info.imageUrl ? info.imageUrl : placeholderGroup), info: info };
            groupHead["disabled"] = (info.removedMembersId && info.removedMembersId.indexOf(currentUserId) >= 0);

            return groupHead;
        } else {
            let info = this.state.userDetails[msg.contactIds];
            let convHead = info ? { type: 'user', title: info['displayName'], image: (info.imageLink ? info.imageLink : placeholderUser), info: info } : {};
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
        if (!e.shiftKey && e.key === 'Enter') {
            // console.log(e.target.value);
            self.sendMessageToSelectedConversation(this.state.selectedConversation, e.target.value);
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
        if (e.target.value !== "") {
            // Assign the original list to currentList
            currentList = self.state.messages;

            // Use .filter() to determine which items should be displayed
            // based on the search terms
            newList = currentList.filter(item => {
                // change current item to lowercase
                const lc = self.conversationHead(item).title.toLowerCase();
                // change search term to lowercase
                const filter = e.target.value.toLowerCase();
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
        if (e.target.scrollTop <= 50 && self.state.selectedConversationMessages && self.state.selectedConversationMessages.length > 0) {
            self.loadConversationMessages(self.state.selectedConversation, self.state.selectedConversationMessages[0].createdAtTime);
        }
    }
    handleNewGroupEdit(e) {
        this.setState({ editGroup: true });
    }

    handleNewGroupEditDone(e) {
        this.setState({ editGroup: false });
        this.setState({ newGroupName: this.refs.groupName.inputRef.current.value, newGroupImageUrl: placeholderGroup });
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
                <div className="messageMainWraper">
                    <Container>
                        <div className="messageHeader">
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={12} computer={13}>
                                        <div className="pt-1 pb-1">
                                            <Header as='h2'>
                                                Messages
                                            </Header>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={4} computer={3} className="text-right">
                                        <div className="pb-1">
                                            <Button className={"" + (self.state.compose ? " red-btn-rounded-def red" : "success-btn-rounded-def")} onClick={() => { self.composeNew() }}><Icon name="edit" />{self.state.compose ? "Cancel" : "Compose"}</Button>
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
                                                <Input fluid iconPosition='left' icon='search' placeholder='Search...' ref="conversationSearchEl" onChange={this.onConversationSearchChange.bind(this)} />
                                            </div>
                                            <div className="chatList">
                                                <List divided verticalAlign='middle'>
                                                    {(() => {
                                                        if (self.state.filteredMessages && self.state.filteredMessages.length > 0) {
                                                            return self.state.filteredMessages.map((msg) => (
                                                                <List.Item as="a" active={self.state.selectedConversation && msg.key == self.state.selectedConversation.key} key={"head_" + msg.key} onClick={() => self.onConversationSelect(msg)}>
                                                                    <List.Content floated='right'>
                                                                        <div className="time">
                                                                            {self.timeString(msg.createdAtTime, true)}
                                                                        </div>
                                                                        <div className="iconWraper">
                                                                            {/* <Icon name="mute" /> */}
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
                                                if (self.state.compose) {
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
                                                                                <input id="myInput" accept="images/*" type="file" ref={(ref) => this.newUpload = ref} style={{ display: 'none' }} />
                                                                                <Image avatar onClick={(e) => this.newUpload.click()} src={self.state.newGroupImageUrl} />
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
                                                            <div className="mesgs-1" style={self.state.selectedConversation ? {} : { height: 300 }}>
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
                                                            if (!self.state.selectedConversation) {
                                                                return <div className="chatFooter">
                                                                    <Form>
                                                                        <Form.Field>
                                                                            <textarea rows="1" placeholder='Type a message…' onKeyDown={self.handleComposeMessageKeyDown.bind(this)} ></textarea>
                                                                        </Form.Field>
                                                                    </Form>
                                                                </div>
                                                            }
                                                        })()}

                                                    </Fragment>
                                                } else {
                                                    if (this.state.selectedConversation && self.conversationHead(this.state.selectedConversation).type == "group" && self.state.selectedConversation.groupId) {
                                                        let groupFeed = self.state.groupFeeds[self.state.selectedConversation.groupId];
                                                        let currentUserInfo = self.getCurrentUserRoleInGroup(groupFeed);
                                                        let conversationInfo = self.conversationHead(self.state.selectedConversation);
                                                        // return <ChatNameHeadGroup selectedConversation={this.state.selectedConversation} userDetails={this.state.userDetails} groupFeeds={this.state.groupFeeds} />
                                                        return (<div className="chatHeader">
                                                            <div className="chatWithGroup">
                                                                <Modal open={self.state.groupAction == 'MEMBERS_LIST'} onClose={() => self.setGroupAction(null)} size="tiny" dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Members</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">
                                                                            <div className="messageSearch">
                                                                                <Input fluid iconPosition='left' icon='search' placeholder='Search...' />
                                                                            </div>
                                                                            <List divided verticalAlign='middle'>
                                                                                {(() => {
                                                                                    // if (self.state.selectedConversation && self.state.selectedConversation.groupId) {
                                                                                    {
                                                                                        return groupFeed.groupUsers.map(function (user) {
                                                                                            return (
                                                                                                <List.Item key={"member_" + user.userId}>
                                                                                                    <List.Content floated='right'>
                                                                                                        {(() => {
                                                                                                            if (user.userId != self.state.userInfo.id && currentUserInfo.role == "1") {
                                                                                                                return <Popup className="moreOptionPopup"
                                                                                                                    trigger={<Button className="moreOption-btn transparent" circular>
                                                                                                                        <Image src={moreIcon} ref={self.contextRef} />
                                                                                                                    </Button>} basic position='bottom right' on='click'>
                                                                                                                    <Popup.Content>
                                                                                                                        <List>
                                                                                                                            {/* <List.Item as='a' onClick={() => self.setGroupAction('MEMBERS_LIST')}>Message</List.Item> */}
                                                                                                                            {user.role != "1" ? <List.Item as='a' onClick={() => self.updateGroupDetails(groupFeed.clientGroupId, { "userId": Number(user.userId), "role": "1" })}>Make as Admin</List.Item> : ""}
                                                                                                                            {user.role != "1" ? <Divider /> : ""}
                                                                                                                            <List.Item as='a' className="red" onClick={() => self.removeUserFromGroup(groupFeed.clientGroupId, user.userId)}>Remove</List.Item>
                                                                                                                        </List>
                                                                                                                    </Popup.Content>
                                                                                                                </Popup>

                                                                                                            } else {
                                                                                                                // return <Fragment>(You)</Fragment>
                                                                                                            }
                                                                                                        })()}
                                                                                                    </List.Content>
                                                                                                    <Image avatar src={user.imageLink ? user.imageLink : "https://banner2.kisspng.com/20180802/icj/kisspng-user-profile-default-computer-icons-network-video-the-foot-problems-of-the-disinall-foot-care-founde-5b6346121ec769.0929994515332326581261.jpg"} />
                                                                                                    <List.Content>
                                                                                                        <List.Header as='a'>{self.state.userDetails[user.userId].displayName || (user.userId == self.state.userInfo.id ? "You" : " No Name")} {user.role == "1" ? " (Admin)" : ""}</List.Header>
                                                                                                        {/* <List.Description></List.Description> */}
                                                                                                    </List.Content>
                                                                                                </List.Item>
                                                                                            )
                                                                                        });
                                                                                    }
                                                                                    // }
                                                                                })()}

                                                                            </List>
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
                                                                            <div className="messageSearch">
                                                                                <Input fluid iconPosition='left'  placeholder='Add members...' />
                                                                            </div>
                                                                            <List divided verticalAlign='middle'>
                                                                                {(() => {
                                                                                    if (self.state.selectedConversation && self.state.selectedConversation.groupId) {
                                                                                        let groupFeed = self.state.groupFeeds[self.state.selectedConversation.groupId];
                                                                                        // console.log(groupFeed);
                                                                                        {
                                                                                            return Object.keys(self.state.userDetails).map(function (userId) {
                                                                                                let user = self.state.userDetails[userId];
                                                                                                if (user.userId != self.state.userInfo.id && (user.displayName || user.userName) && groupFeed.membersId.indexOf(user.userId) < 0) {
                                                                                                    return (<List.Item key={"member_" + user.userId}>
                                                                                                        <List.Content floated='right'>
                                                                                                            <Popup className="moreOptionPopup"
                                                                                                                trigger={<Button className="moreOption-btn transparent" circular>
                                                                                                                    <Image src={moreIcon} ref={self.contextRef} />
                                                                                                                </Button>} basic position='bottom right' on='click'>
                                                                                                                <Popup.Content>
                                                                                                                    <List>
                                                                                                                        {/* <Button className="blue-btn-rounded-def c-small" onClick={() => self.addUserToGroup(groupFeed.clientGroupId, user.userId, 3)}>+</Button> */}
                                                                                                                        <List.Item as='a' onClick={() => self.addUserToGroup(groupFeed.clientGroupId, user.userId, 3)}>Add as Member</List.Item>
                                                                                                                        <Divider />
                                                                                                                        <List.Item as='a' onClick={() => self.addUserToGroup(groupFeed.clientGroupId, user.userId, 1)}>Add as Admin</List.Item>
                                                                                                                    </List>
                                                                                                                </Popup.Content>
                                                                                                            </Popup>

                                                                                                        </List.Content>
                                                                                                        <Image avatar src={user.imageLink ? user.imageLink : "https://banner2.kisspng.com/20180802/icj/kisspng-user-profile-default-computer-icons-network-video-the-foot-problems-of-the-disinall-foot-care-founde-5b6346121ec769.0929994515332326581261.jpg"} />
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
                                                                        </Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.setGroupAction(null)}>Add</Button>
                                                                            {/* <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button> */}
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" open={self.state.groupAction == 'MUTE_NOTIFICATIONS'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Mute conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.setGroupAction(null)}>Mute</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>

                                                                <Modal size="tiny" open={self.state.groupAction == 'LEAVE_GROUP'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Leave conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">Others can add you to the Group again.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.leaveGroup(self.state.selectedConversation.groupId)}>Leave conversation</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>

                                                                <Modal size="tiny" open={self.state.groupAction == 'DELETE_GROUP'} onClose={() => self.setGroupAction(null)} dimmer="inverted" className="chimp-modal" closeIcon centered={false}>
                                                                    <Modal.Header>Delete Group?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">Cannot undo this action. All the messages in this group will be deleted permanentaly.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.deleteGroup(self.state.selectedConversation.groupId)}>Delete</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setGroupAction(null)}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>

                                                                <List divided verticalAlign='middle'>
                                                                    <List.Item>
                                                                        {(() => {
                                                                            if (!conversationInfo.disabled) {
                                                                                return (
                                                                                    <List.Content floated='right'>
                                                                                        <Popup className="moreOptionPopup"
                                                                                            trigger={<Button className="moreOption-btn transparent" circular >
                                                                                                <Image src={moreIcon} ref={this.contextRef} />
                                                                                            </Button>} basic position='bottom right' on='click'>
                                                                                            <Popup.Content>
                                                                                                <List>
                                                                                                    <List.Item as='a' onClick={() => self.setGroupAction('MEMBERS_LIST')}>See members</List.Item>
                                                                                                    {currentUserInfo.role == "1" ? <List.Item as='a' onClick={() => self.setGroupAction('MEMBERS_ADD')}>Add members</List.Item> : ""}
                                                                                                    <List.Item as='a' onClick={() => self.setGroupAction('MUTE_NOTIFICATIONS')}>Mute</List.Item>
                                                                                                    <Divider />
                                                                                                    <List.Item as='a' onClick={() => self.setGroupAction('LEAVE_GROUP')} className="red">Leave Conversation</List.Item>
                                                                                                    {currentUserInfo.role == "1" ? <List.Item as='a' onClick={() => self.setGroupAction('DELETE_GROUP')} className="red">Delete Group</List.Item> : ""}
                                                                                                </List>
                                                                                            </Popup.Content>
                                                                                        </Popup>
                                                                                    </List.Content>)
                                                                            }
                                                                        })()}
                                                                        <Popup className="moreOptionPopup"
                                                                            trigger={<Image avatar src={conversationInfo.image} />} basic position='bottom left' on='click'>
                                                                            <Popup.Content>
                                                                                <List>
                                                                                    <Modal size="tiny" dimmer="inverted" className="chimp-modal image-modal" style={{ backgroundImage: 'url(' + conversationInfo.image + ')' }} closeIcon trigger={<List.Item as='a'>View photo</List.Item>} centered={false}></Modal>
                                                                                    {(() => {
                                                                                        if (!conversationInfo.disabled) {
                                                                                            return (
                                                                                                <Fragment>
                                                                                                    <input id="myInput" accept="images/*" type="file" ref={(ref) => this.upload = ref} style={{ display: 'none' }} />
                                                                                                    <List.Item as='a' onClick={(e) => this.upload.click()}>Upload photo</List.Item>
                                                                                                    <List.Item as='a'>Remove photo</List.Item>
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
                                                                                        <Input maxLength="25" placeholder='Group Title' ref="groupName" value={self.state.editGroupName} onChange={(e) => { self.setState({ editGroupName: e.target.value }) }} />
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
                                                    } else if (this.state.selectedConversation) {
                                                        // return <ChatNameHead selectedConversation={this.state.selectedConversation} userDetails={this.state.userDetails} groupFeeds={this.state.groupFeeds} />
                                                        return <div className="chatHeader">
                                                            <div className="chatWith">
                                                                Message with {this.state.selectedConversation ? this.state.userDetails[this.state.selectedConversation.contactIds].displayName : ""}
                                                            </div>
                                                            <div className="moreOption">
                                                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => self.setState({ conversationAction: null })} closeIcon open={self.state.conversationAction == "MUTE"} centered={false}>
                                                                    <Modal.Header>Mute conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={() => self.setState({ conversationAction: null })}>Mute</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small" onClick={() => self.setState({ conversationAction: null })}>Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" onClose={() => self.setState({ conversationAction: null })} closeIcon open={self.state.conversationAction == "DELETE"} centered={false}>
                                                                    <Modal.Header>Delete conversation?</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description className="font-s-16">Deleting removes conversations from inbox, but no ones else’s inbox.</Modal.Description>
                                                                        <div className="btn-wraper pt-3 text-right">
                                                                            <Button className="blue-btn-rounded-def c-small" onClick={(e) => self.deleteConversation({ userId: this.state.selectedConversation.contactIds })}>Delete</Button>
                                                                            <Button className="blue-bordr-btn-round-def c-small">Cancel</Button>
                                                                        </div>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Popup className="moreOptionPopup"
                                                                    trigger={<Button className="moreOption-btn transparent" circular>
                                                                        <Image src={moreIcon} ref={this.contextRef} />
                                                                    </Button>} basic position='bottom right' on='click'>
                                                                    <Popup.Content>
                                                                        <List>
                                                                            <List.Item as='a' onClick={() => { self.setState({ conversationAction: "MUTE" }) }}>Mute</List.Item>
                                                                            <List.Item as='a' onClick={() => { self.setState({ conversationAction: "DELETE" }) }}>Delete conversation</List.Item>
                                                                        </List>
                                                                    </Popup.Content>
                                                                </Popup>
                                                            </div>
                                                        </div>
                                                    }
                                                }
                                            })()}
                                            {(() => {
                                                if (this.state.selectedConversation) {
                                                    let conversationInfo = self.conversationHead(self.state.selectedConversation);
                                                    let msgsByDate = self.groupMessagesByDate(self.state.selectedConversationMessages, {});
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
                                                                                        if (msg.metadata.action && ["0", "1", "2", "3", "4", "5", "6"].indexOf(msg.metadata.action) >= 0) {
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
                                                                                                {conversationInfo.type == "group" ? <div className="incoming_msg_img"> <Image avatar src={self.state.userDetails[msg.contactIds]["imageLink"] ? self.state.userDetails[msg.contactIds]["imageLink"] : "https://banner2.kisspng.com/20180802/icj/kisspng-user-profile-default-computer-icons-network-video-the-foot-problems-of-the-disinall-foot-care-founde-5b6346121ec769.0929994515332326581261.jpg"} alt="" /> </div> : ''}
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
                                                            <Form>
                                                                <Form.Field>
                                                                    <textarea placeholder='Type a message…' disabled={conversationInfo.type == "group" && conversationInfo.info.removedMembersId.indexOf(self.state.userInfo.id) >= 0} rows="1" onKeyDown={this.handleMessageKeyDown.bind(this)} ></textarea>
                                                                </Form.Field>
                                                            </Form>
                                                        </div>
                                                    </Fragment>
                                                } else if (!self.state.compose) {
                                                    return <div class="no-messages">{self.loading ? "Loading..." : "No Messages Click Compose to Start Messaging"}</div>
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