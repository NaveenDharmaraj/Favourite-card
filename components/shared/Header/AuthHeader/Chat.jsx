import React, { cloneElement, Fragment } from 'react';
import { connect } from 'react-redux';
import { Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import applozicApi from "./../../../../services/applozicApi";
import graphApi from "./../../../../services/graphApi";
import placeholderUser from './../../../../static/images/no-data-avatar-user-profile.png';
import placeholderGroup from './../../../../static/images/no-data-avatar-group-chat-profile.png';
import { Link } from '../../../../routes';
import { actionTypes } from '../../../../actions/chat';

class Chat extends React.Component {
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    constructor(props) {
        super(props);
        this.state = {
            userInfo: props.userInfo,
            dispatch: props.dispatch,
            totalUnreadCount: props.totalUnreadCount || 0,
            messagesList: props.messagesList || [],
            userDetails: {},
            groupFeeds: {},
            showBackImage: false,
            classForMargin:'chat-popup',
        }
        // this.onMessagesListLoad.bind(this);
        this.loadFriendsList.bind(this);
        this.applozicAppInitialized.bind(this);
        this.onUnreadMessageCountUpdate.bind(this);
        this.onMessageReceived.bind(this);
        this.onMessageSent.bind(this);
        this.conversationHead.bind(this);
        this.getDateString.bind(this);
        this.timeString.bind(this);
        this.loadRecentMessages.bind(this);
        this.onChatPageRefreshEvent.bind(this);
        this.renderbackImage = this.renderbackImage.bind(this);
    }

    /*onMessagesListLoad = (e) => {
        console.log("onMessagesListLoad");
        let data = e.detail.data;
        let messagesList = data.message;
        let usersInfoById = {};
        let usersInfo = data.userDetails;
        _.forEach(usersInfo, function (userDetail) {
            usersInfoById[userDetail.userId] = userDetail;
        });
        let groupFeedsById = {};
        let groupFeeds = data.groupFeeds;
        _.forEach(groupFeeds, function (groupFeed) {
            groupFeedsById[groupFeed.id] = groupFeed;
        });
        console.log(e.detail);
        this.setState({ totalUnreadCount: e.detail.totalUnreadCount, messagesList: messagesList, userDetails: usersInfoById, groupFeeds: groupFeedsById });
    }
*/
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
                        userDetails[Number(userDetail.user_id)] = { userId: userDetail.user_id, displayName: userDetail.display_name, email: userDetail.email_hash, imageLink: userDetail.avatar };
                    }
                });
                self.setState({ userDetails: userDetails });
            },
        );
    };

    applozicAppInitialized = (e) => {
        this.setState({ totalUnreadCount: e.detail.count });
        this.loadRecentMessages();
    }
    onUnreadMessageCountUpdate = (e) => {
        this.setState({ totalUnreadCount: e.detail.count });
    }

    onMessageSent = (e) => {
        this.loadRecentMessages();
    };
    onChatPageRefreshEvent = (e) => {
        this.loadRecentMessages();
    }
    onMessageReceived = (e) => {
        this.loadRecentMessages();
        // console.log("onMessageReceived");
        // this.setState({ totalUnreadCount: this.state.totalUnreadCount + 1 });
        // console.log(e);
    }

    async loadRecentMessages() {
        let self = this;
        applozicApi.get("/message/v2/list", { params: { startIndex: 0, mainPageSize: 5, pageSize: 5 } }).then(function (response) {
            let userDetails = self.state.userDetails;
            _.forEach(response.response.userDetails, function (userDetail) {
                if (!userDetails[userDetail.userId]) {
                    userDetails[userDetail.userId] = userDetail;
                }
                userDetails[userDetail.userId].unreadCount = userDetail.unreadCount;
            });
            let groupFeeds = self.state.groupFeeds;
            _.forEach(response.response.groupFeeds, function (groupFeed) {
                groupFeeds[groupFeed.id] = groupFeed;
            });

            self.setState({ messagesList: response.response.message, userDetails: userDetails, groupFeeds: groupFeeds });
        })
            .catch(function (error) {
                // handle error
                console.log(error);
                self.props.dispatch({
                    payload: {
                        mesageListLoader: false,
                        messages: [],
                    },
                    type: actionTypes.LOAD_CONVERSATION_LIST,
                });
                self.setState({ messages: [] });
            })
            .finally(function () {
                // always executed 
                // console.log("Chat Load Done!");
            });
    }

    async componentDidMount() {
        // window.addEventListener('onMessagesListLoad', this.onMessagesListLoad, false);
        this.loadFriendsList();
        window.addEventListener('onChatPageRefreshEvent', this.onChatPageRefreshEvent, false);
        window.addEventListener('onMessageReceived', this.onMessageReceived, false);
        window.addEventListener('onMessageSent', this.onMessageSent, false);
        window.addEventListener('applozicAppInitialized', this.applozicAppInitialized, false);
        window.addEventListener('onUnreadMessageCountUpdate', this.onUnreadMessageCountUpdate, false);
        //this condition prevents loading applozic services before Applozic is getting Initialized.
        window.Applozic && await this.loadRecentMessages();
        window.addEventListener('scroll', () => {
            const {
                classForMargin,
            } = this.state;
            let classForSticky = 'chat-popup';
            if (window.scrollY >= 57) {
                classForSticky = 'chat-popup sticky-dropdown';
                if (classForMargin !== classForSticky) {
                    this.setState({
                        classForMargin: classForSticky,
                    });
                }
            } else if (classForMargin !== classForSticky) {
                this.setState({
                    classForMargin: classForSticky,
                });
            }
        });
    }

    componentWillUnmount() {
        // window.removeEventListener('onMessagesListLoad', this.onMessagesListLoad, false);
        window.removeEventListener('onChatPageRefreshEvent', this.onChatPageRefreshEvent, false);
        window.removeEventListener('applozicAppInitialized', this.applozicAppInitialized, false);
        window.removeEventListener('onMessageReceived', this.onMessageReceived, false);
        window.removeEventListener('onMessageSent', this.onMessageSent, false);
        window.removeEventListener('onUnreadMessageCountUpdate', this.onUnreadMessageCountUpdate, false);
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

    conversationHead(msg) {
        if (msg.groupId) {
            let info = this.state.groupFeeds[msg.groupId];
            let groupHead = { type: "group", title: info.name, image: (info.imageUrl ? info.imageUrl : placeholderGroup), info: info };
            return groupHead;
        } else {
            let info = this.state.userDetails[msg.contactIds];
            let convHead = { type: 'user', title: info['displayName'], image: (info.imageLink ? info.imageLink : placeholderUser), info: info };
            return convHead;
        }
    }
    renderIconColor() {
        const {
            dispatch,
        } = this.props;
        this.setState({
            showBackImage: true,
        });
    }

    renderbackImage() {
        this.setState({
            showBackImage: false,
        });
    }
    render() {
        let self = this;
        const {
            showBackImage,
            classForMargin,
        } = this.state;
        const activeClass = (showBackImage) ? 'menuActive' : '';
        return (
            <Popup
                position="bottom right"
                basic
                on='click'
                className={classForMargin}
                onOpen={() => this.renderIconColor()}
                onClose={() => this.renderbackImage()}
                trigger={
                    (
                        <Menu.Item as="a" className={`chatNav xs-d-none ${activeClass}`}>
                            {/* {userInfo.applogicClientRegistration ? (userInfo.applogicClientRegistration.totalUnreadCount > 0 ? <Label color="red" floating circular>4</Label> : '') : ''} */}
                            {/* {this.state.totalUnreadCount > 0 ? <Label color="red" floating circular className="chat-launcher-icon">{this.state.totalUnreadCount}</Label> : ""} */}
                            <Icon name={"chat" + (this.state.totalUnreadCount > 0 ? " new" : "")} />
                        </Menu.Item>
                    )
                }
                flowing>
                <Popup.Header>
                    {self.state.messagesList && self.state.messagesList.length > 0 ? "Messages" : "No Messages"} <Link route={`/chats/new`}><a className="newChatIcon"><Icon name="chatIcon" /></a></Link>
                </Popup.Header>
                <Popup.Content>
                    <List relaxed="very" verticalAlign='middle'>
                        {(() => {
                            if (self.state.messagesList && self.state.messagesList.length > 0) {
                                return self.state.messagesList.map(function (msg) {
                                    let conversationHead = self.conversationHead(msg);
                                    return (<List.Item key={"chat_head_" + msg.key} className={!msg.sent && !msg.read}>
                                        <Image avatar src={conversationHead.image} />
                                        <List.Content>
                                            <List.Header>
                                                <Link route={`/chats/` + (msg.groupId ? msg.groupId : msg.contactIds)}>
                                                    <a className="header"><span className={`name ${conversationHead.info.unreadCount > 0  ? "newMessage" : ""}`}>{conversationHead.title}</span> <span className="time">{self.timeString(msg.createdAtTime, true)}</span></a>
                                                </Link>
                                            </List.Header>
                                            <List.Description>
                                                <Link route={`/chats/` + (msg.groupId ? msg.groupId : msg.contactIds)}><span dangerouslySetInnerHTML={{ __html: msg.message.replace(/(<([^>]+)>)/ig, '') }}></span></Link>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>)
                                });
                            }
                        })()}


                    </List>
                </Popup.Content>
                <div className="popup-footer text-center">
                    <Link route={`/chats/all`}><a>{"See All Messages"}</a></Link>
                </div>
            </Popup>
        );
    }



}
function mapStateToProps(state) {
    return {
        userInfo: state.user.info,
        messageList: state.chat.messages,
        totalUnreadCount: 0
    };
}
export default connect(mapStateToProps)(Chat);
