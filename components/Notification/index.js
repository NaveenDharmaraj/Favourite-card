import React, { cloneElement, Fragment } from 'react';
//import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { Link, Router } from '../../routes';
import placeholderUser from '../../static/images/no-data-avatar-user-profile.png';
import { distanceOfTimeInWords } from '../../helpers/utils';
// import { Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';
import {
    Button,
    Container,
    Header,
    Icon,
    Image,
    Menu,
    Responsive,
    Form,
    Input,
    Dropdown,
    Divider,
    Table,
    Tab,
    Grid,
    List,
    Pagination,
    Breadcrumb,
    TextArea,
} from 'semantic-ui-react'
import _ from 'lodash';
import { NotificationHelper } from '../../Firebase/NotificationHelper';
import { withTranslation } from '../../i18n';

class NotificationWrapper extends React.Component {
    t = null;
    constructor(props) {
        super(props)
        /* const messageCount = props.messageCount;
         const messages = props.messages;
         const userInfo = props.userInfo;
         const dispatch = props.dispatch;
         this.state = {
             msgId: props.msgId,
             messageCount: messageCount,
             messages: messages,
             userInfo: userInfo,
             dispatch: dispatch
         };*/
        this.t = props.t;
        // console.log(props);
        this.listItems.bind(this);
        this.splitNotifications.bind(this);
        this.updateReadFlag.bind(this);
        this.acceptFriendRequestAsync.bind(this);
        this.updateDeleteFlag.bind(this);
        this.onLoadMoreClick.bind(this);
        this.onNotificationCTA.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {

    }

    async componentWillUnmount() {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.updateLastSyncTime(userInfo, dispatch, new Date().getTime());
        // await NotificationHelper.updateLastSyncTime();
    }

    async componentDidMount() {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.getMessages(userInfo, dispatch, 1);
    }
    async onClick(userInfo, dispatch) {
        await NotificationHelper.getMessages(userInfo, dispatch, 1);
    }
    async onLoadMoreClick(userInfo, dispatch, currentPage) {
        console.log("onLoadMore");
        await NotificationHelper.getMessages(userInfo, dispatch, currentPage + 1);
    }
    async onMessageClick(msgKey, msg) {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.markAsRead(userInfo, dispatch, msgKey, msg);
    };

    async acceptFriendRequestAsync(msg) {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.acceptFriendRequest(userInfo, dispatch, msg);
    };

    async onNotificationCTA(cta, msg) {
        console.log(JSON.stringify(msg) + JSON.stringify(cta));
        let ctaActionId = cta.actionId;
        switch (ctaActionId) {
            case "Set_New_Giving_Goal": {
                Router.pushRoute('/user/giving-goals');
                break;
            }
            case "Send_a_Thank_you": {
                Router.pushRoute("/chats/{userId}");
                break;
            }
            case "Send_a_Gift": {
                Router.pushRoute("/give/to/friend/new");
                break;
            }
            case "View_Message": {
                Router.pushRoute("/chats/" + cta.user_id);
                break;
            }
            case "Update_payment": {
                Router.pushRoute("/user/profile");
                break;
            }
            case "See_upcoming_gifts": {
                Router.pushRoute("/dashboard");
                break;
            }
            case "Go_to_Giving_Group": {
                Router.pushRoute("/");
                break;
            }
            case "Say_Congrats": {
                Router.pushRoute("/chats/{userId}");
                break;
            }
            case "Accept": {
                this.acceptFriendRequestAsync(msg);
                break;
            }
            case "view_profile": {
                Router.pushRoute("/users/profile/{userId}");
                break;
            }
        }
    }

    listItems(messages) {
        if (!messages) {
            messages = [];
        }
        let self = this;
        const {
            userInfo,
            dispatch
        } = this.state;
        return messages.map(function (msg) {
            let messagePart = NotificationHelper.getMessagePart(msg, userInfo);
            if (msg.deleted) {
                return <List.Item key={"notification_msg_" + msg._key} className="new">
                    <div className="blankImage"></div>
                    <List.Content>
                        {self.t("removed")} <a onClick={() => self.updateDeleteFlag(msg._key, msg, false)} >{self.t("undo")}</a>
                    </List.Content>
                </List.Item>
            } else {
                // className={msg.read ? "" : "new"} onClick={() => self.updateReadFlag(msg._key, msg, true)}
                return (<List.Item key={"notification_msg_" + msg._key}>
                    <List.Content floated='right'>
                        {(() => {
                            if (msg.callToActions && msg.callToActions.length > 0) {
                                // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                                return msg.callToActions.map(function (cta) {
                                    return <Button className="blue-btn-rounded-def c-small" onClick={() => self.onNotificationCTA(cta, msg)}>{cta.actionTitle}</Button>
                                });
                            }
                            /*if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                                return <Button className="blue-btn-rounded-def c-small" onClick={() => self.acceptFriendRequestAsync(msg)}>{self.t("action_accept")}</Button>
                            }*/
                        })()}

                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                                <Dropdown.Menu>
                                    {/* <Dropdown.Item text={messagePart.read ? self.t("markAsUnread") : self.t("markAsRead")} onClick={() => self.updateReadFlag(msg._key, msg, !messagePart.read)} /> */}
                                    <Dropdown.Item text={self.t("delete")} onClick={() => self.updateDeleteFlag(msg._key, msg, true)} />
                                    <Dropdown.Item text={self.t("stop")} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                    </List.Content>
                    <Image avatar src={messagePart.sourceImageLink ? messagePart.sourceImageLink : placeholderUser} />
                    <List.Content>
                        {/* <b dangerouslySetInnerHTML={{ __html: messagePart.sourceDisplayName }}></b> {messagePart.message} {msg.deleted ? " Deleted" : ""} */}
                        <span dangerouslySetInnerHTML={{ __html: messagePart.message }}></span>
                        <div className="time">{distanceOfTimeInWords(msg.createdTs)}</div>
                    </List.Content>
                </List.Item>)
            }
        });
    }

    splitNotifications(messages, lastSyncTime) {
        if (!messages) {
            messages = [];
        }
        let recentItems = messages.filter(function (item) {
            // return item.createdTs >= (new Date().getTime() - (1000 * 60 * 60 * 48));
            return item.createdTs > lastSyncTime;
        });

        let earlierItems = messages.filter(function (item) {
            // return item.createdTs < (new Date().getTime() - (1000 * 60 * 60 * 48));
            return item.createdTs <= lastSyncTime;
        });
        return { "recent": recentItems, "earlier": earlierItems };
    }
    async updateReadFlag(msgKey, msg, flag) {
        await NotificationHelper.updateReadFlag(this.state.userInfo, this.state.dispatch, msgKey, msg, flag);
    };

    async updateDeleteFlag(msgKey, msg, flag) {
        await NotificationHelper.updateDeleteFlag(this.state.userInfo, this.state.dispatch, msgKey, msg, flag);
    }

    async acceptFriendRequestAsync(msg) {
        await NotificationHelper.acceptFriendRequest(this.state.userInfo, this.state.dispatch, msg);
    };

    render() {
        this.t = this.props.t;
        const messageCount = this.props.messageCount;
        const messages = this.props.messages;
        const currentPage = this.props.page;
        const userInfo = this.props.userInfo;
        const dispatch = this.props.dispatch;
        const msgId = this.props.msgId;
        const lastSyncTime = this.props.lastSyncTime;
        this.state = {
            msgId: msgId,
            messageCount: messageCount,
            messages: messages,
            lastSyncTime: lastSyncTime,
            page: currentPage,
            userInfo: userInfo,
            dispatch: dispatch
        };
        let self = this;
        console.log(self.state);
        let itemByType = self.splitNotifications(self.state.messages, lastSyncTime);
        let recentItems = itemByType.recent;
        let earlierItems = itemByType.earlier;
        return (
            <Container>
                <div className="viewAllNotifications">
                    <div className="notificationHeader">
                        <List divided verticalAlign='middle'>
                            <List.Item>
                                <List.Content floated='right'>
                                    <a className="settingsIcon"><Icon name="setting" /></a>
                                </List.Content>
                                <List.Content>
                                    <Header as="h3">
                                        {self.t("notificationHeader")}
                                    </Header>
                                </List.Content>
                            </List.Item>
                        </List>
                    </div>
                    {(() => {
                        if (recentItems && recentItems.length > 0) {
                            return <div>
                                <div className="font-s-16 bold mt-2 mb-1">{self.t("recent")}</div>
                                <div className="allNotification mb-3">
                                    <List celled verticalAlign='middle'>
                                        {self.listItems(recentItems)}
                                    </List>
                                </div>
                            </div>
                        }
                    })()}
                    {(() => {
                        if (earlierItems && earlierItems.length > 0) {
                            return <div>
                                <div className="font-s-16 bold mt-2 mb-1">{self.t("earlier")}</div>
                                <div className="allNotification mb-3">
                                    <List celled verticalAlign='middle'>
                                        {self.listItems(earlierItems)}
                                    </List>
                                </div>
                            </div>
                        }
                    })()}
                    {/* <div className="popup-footer text-center">
                        <a onClick={() => { self.onLoadMoreClick(userInfo, dispatch, currentPage) }}>{self.t("loadMore")}</a>
                    </div> */}
                </div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.user.auth,
        messages: state.firebase.messages,
        lastSyncTime: state.firebase.lastSyncTime,
        page: state.firebase.page,
        messageCount: state.firebase.messages ? Object.keys(state.firebase.messages.filter(function (m) { return !m.read; })).length : 0,
        userInfo: state.user.info
    };
}

export default withTranslation('notification')(connect(mapStateToProps)(NotificationWrapper));