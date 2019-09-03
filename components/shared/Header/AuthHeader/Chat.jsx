import React, { cloneElement, Fragment } from 'react';
import { connect } from 'react-redux';
import { Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import applozicApi from "./../../../../services/applozicApi"

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
            groupFeeds: {}
        }
        // this.onMessagesListLoad.bind(this);
        this.onMessageReceived.bind(this);
        this.conversationHead.bind(this);
        this.getDateString.bind(this);
        this.timeString.bind(this);
        this.loadRecentMessages.bind(this);
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

    onMessageReceived = (e) => {
        console.log("onMessageReceived");
        this.setState({ totalUnreadCount: this.state.totalUnreadCount + 1 });
        console.log(e);
    }

    async loadRecentMessages() {
        let self = this;
        applozicApi.get("/message/v2/list", { params: { startIndex: 0, mainPageSize: 5, pageSize: 5 } }).then(function (response) {
            // handle success
            console.log(response);
            let userDetails = self.state.userDetails;
            _.forEach(response.response.userDetails, function (userDetail) {
                userDetails[userDetail.userId] = userDetail;
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
                self.setState({ messages: [] });
            })
            .finally(function () {
                // always executed 
                // console.log("Chat Load Done!");
            });
    }

    async componentDidMount() {
        // window.addEventListener('onMessagesListLoad', this.onMessagesListLoad, false);
        window.addEventListener('onMessageReceived', this.onMessageReceived, false);
        await this.loadRecentMessages();
    }

    componentWillUnmount() {
        // window.removeEventListener('onMessagesListLoad', this.onMessagesListLoad, false);
        window.removeEventListener('onMessageReceived', this.onMessageReceived, false);
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
            let groupHead = { type: "group", title: info.name, image: (info.imageUrl ? info.imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMus31dApHDyvHuFOx1CM6bS6-RhuzlAb5oL0aaf37Di54iIUf"), info: info };
            return groupHead;
        } else {
            let info = this.state.userDetails[msg.contactIds];
            let convHead = { type: 'user', title: info['displayName'], image: (info.imageLink ? info.imageLink : "https://banner2.kisspng.com/20180802/icj/kisspng-user-profile-default-computer-icons-network-video-the-foot-problems-of-the-disinall-foot-care-founde-5b6346121ec769.0929994515332326581261.jpg"), info: info };
            return convHead;
        }
    }

    render() {
        let self = this;
        return (
            <Popup
                position="bottom center"
                pinned
                className="notification-popup"
                trigger={
                    (
                        <Menu.Item as="a">
                            {/* {userInfo.applogicClientRegistration ? (userInfo.applogicClientRegistration.totalUnreadCount > 0 ? <Label color="red" floating circular>4</Label> : '') : ''} */}
                            {this.state.totalUnreadCount > 0 ? <Label color="red" floating circular className="chat-launcher-icon">{this.state.totalUnreadCount}</Label> : ""}
                            <Icon name="chat" />
                        </Menu.Item>
                    )
                }
                flowing
                hoverable>
                <Popup.Header>
                    {self.state.messagesList && self.state.messagesList.length > 0 ? "Recent Messages" : "No Recent Messages"} <a style={{ float: 'right', display: 'none' }}><Icon name="setting" /></a>
                </Popup.Header>
                <Popup.Content>
                    <List relaxed="very">
                        {(() => {

                            if (self.state.messagesList && self.state.messagesList.length > 0) {
                                return self.state.messagesList.map(function (msg) {
                                    let conversationHead = self.conversationHead(msg);
                                    return (<List.Item key={"chat_head_" + msg.key} style={{ backgroundColor: "none" }}>
                                        <Image avatar src={conversationHead.image} />
                                        <List.Content>
                                            <List.Header style={{ width: "100%", maxWidth: '500px' }}>
                                                <a className="header">{conversationHead.title}</a>
                                                <div style={{ cursor: "pointer", maxWidth: "300px", width: "300px", overflow: "break-word", display: 'inline-block' }}>{msg.message}</div> &nbsp;&nbsp;&nbsp;&nbsp;
                                            </List.Header>
                                            <List.Description>
                                                {self.timeString(msg.createdAtTime)}
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>)
                                });
                            }
                        })()}


                    </List>
                </Popup.Content>
                <div className="popup-footer text-center">
                    <a href="/chats/all">{self.state.messagesList && self.state.messagesList.length > 0 ? "See All Conversations" : "Start Conversation"}</a>
                </div>
            </Popup>
        );
    }



}
function mapStateToProps(state) {
    return {
        userInfo: state.user.info,
        messageList: state.chat.messages,
    };
}
export default connect(mapStateToProps)(Chat);
