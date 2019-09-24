import React, { cloneElement, Fragment } from 'react';
//import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { Link, Router } from '../../routes';
import placeholderUser from '../../static/images/no-data-avatar-user-profile.png';
import { distanceOfTimeInWords } from '../../helpers/utils';
import eventApi from '../../services/eventApi';
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
import {
    updateUserPreferences,
} from '../../actions/userProfile';
import _ from 'lodash';
import { NotificationHelper } from '../../Firebase/NotificationHelper';
import { withTranslation } from '../../i18n';

class NotificationWrapper extends React.Component {
    t = null;
    loading = false;
    deletedItems = [];
    deleteTimeouts = {};
    intervalId = -1;
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
        /*const messageCount = props.messageCount;
        const messages = props.messages;
        const currentPage = props.page;
        const userInfo = props.userInfo;
        const dispatch = props.dispatch;
        const msgId = props.msgId;
        const lastSyncTime = props.lastSyncTime;
        const localeCode = props.localeCode;
        this.state = {
            msgId: msgId,
            messageCount: messageCount,
            messages: messages,
            lastSyncTime: lastSyncTime,
            page: currentPage,
            userInfo: userInfo,
            localeCode: localeCode,
            dispatch: dispatch
        };*/
        // console.log(props);
        this.listItems.bind(this);
        this.splitNotifications.bind(this);
        this.updateReadFlag.bind(this);
        this.acceptFriendRequestAsync.bind(this);
        this.updateDeleteFlag.bind(this);
        this.onLoadMoreClick.bind(this);
        this.onNotificationCTA.bind(this);
        this.onNotificationMsgAction.bind(this);
        this.handleScroll.bind(this);
    }

    handleScroll = (e) => {
        const {
            userInfo,
            dispatch
        } = this.state;
        // console.log("Call Load More" + (window.innerHeight - window.pageYOffset));
        // Do something generic, if you have to
        let scrollGap = window.innerHeight - window.pageYOffset;
        if (this.state.messages && this.state.messages.length > 0 && scrollGap <= 200 && !this.loading) {
            this.loading = true;
            let lastMsg = this.state.messages[this.state.messages.length - 1];
            NotificationHelper.getMessages(userInfo, dispatch, 1, lastMsg, lastMsg["_key"]);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    async componentWillUnmount() {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.updateLastSyncTime(userInfo, dispatch, new Date().getTime());
        window.removeEventListener("scroll", this.handleScroll);
        clearInterval(this.intervalId);
        // await NotificationHelper.updateLastSyncTime();
    }

    async componentDidMount() {
        const {
            userInfo,
            dispatch
        } = this.state;
        window.addEventListener("scroll", this.handleScroll);
        this.intervalId = setInterval(async function () {
            await NotificationHelper.getMessages(userInfo, dispatch, 1);
        }, 10000);
        await NotificationHelper.getMessages(userInfo, dispatch, 1);
    }
    async onClick(userInfo, dispatch) {
        await NotificationHelper.getMessages(userInfo, dispatch, 1);
    }
    async onLoadMoreClick(userInfo, dispatch, currentPage) {
        let lastMsg = this.state.messages[0];//
        lastMsg = this.state.messages[this.state.messages.length - 1];
        await NotificationHelper.getMessages(userInfo, dispatch, currentPage + 1, lastMsg, lastMsg["_key"]);
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

    async onNotificationMsgAction(cta, msg) {
        switch (cta) {
            case "delete": {
                this.updateDeleteFlag(msg._key, msg, true);
                break;
            }
            case "turnOff": {
                updateUserPreferences(this.state.dispatch, this.state.userInfo.id, "in_app_giving_group_activity", false);
                break;
            }
            default:
                break;
        }
    }

    async onNotificationCTA(ctaKey, ctaOptions, msg) {
        let ctaActionId = ctaKey;//cta.actionId;
        switch (ctaActionId) {
            case "setNewGivingGoal": {
                Router.pushRoute('/user/giving-goals');
                break;
            }
            case "sendThankYou": {
                // let thankyouNote = ctaOptions.msg[this.state.localeCode];
                const userId = ctaOptions['user_id'];
                Router.pushRoute(`/chats/${userId}`);
                break;
            }
            case "sendGift": {
                Router.pushRoute("/give/to/friend/new");
                break;
            }
            case "viewMessage": {
                Router.pushRoute("/chats/" + cta.user_id);
                break;
            }
            case "updatePayment": {
                Router.pushRoute("/user/profile/settings/creditcard");
                break;
            }
            case "seeUpcomingGifts": {
                Router.pushRoute("/dashboard");
                break;
            }
            case "goToGivingGroup": {
                const givingGroupSlug = ctaOptions['group_slug'];
                Router.pushRoute(`/groups/${givingGroupSlug}`);
                break;
            }
            case "sayCongrats": {
                const userId = ctaOptions['user_id'];
                Router.pushRoute(`/chats/${userId}`);
                break;
            }
            case "accept": {
                this.acceptFriendRequestAsync(msg);
                break;
            }
            case "viewProfile": {
                const userId = ctaOptions['user_id'];
                Router.pushRoute(`/users/profile/${userId}`);
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
            localeCode,
            dispatch
        } = this.state;
        return messages.map(function (msg) {
            let messagePart = NotificationHelper.getMessagePart(msg, userInfo, localeCode);
            if (self.deletedItems.indexOf(msg["id"]) >= 0) {
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
                            if (msg.cta) {
                                // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                                return Object.keys(msg.cta).map(function (ctaKey) {
                                    let cta = msg.cta[ctaKey];
                                    if (cta.isWeb) {
                                        return <Button className="blue-btn-rounded-def c-small" onClick={() => self.onNotificationCTA(ctaKey, cta, msg)}>{cta.title[localeCode]}</Button>
                                    }
                                });
                            }
                            /*if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                                return <Button className="blue-btn-rounded-def c-small" onClick={() => self.acceptFriendRequestAsync(msg)}>{self.t("action_accept")}</Button>
                            }*/
                        })()}

                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                                <Dropdown.Menu>
                                    {(() => {
                                        if (msg.msgActions && msg.msgActions.length > 0) {
                                            // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                                            return msg.msgActions.map(function (cta) {
                                                return <Dropdown.Item text={self.t(cta)} onClick={() => self.onNotificationMsgAction(cta, msg)} />
                                            });
                                        }
                                        /*if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                                            return <Button className="blue-btn-rounded-def c-small" onClick={() => self.acceptFriendRequestAsync(msg)}>{self.t("action_accept")}</Button>
                                        }*/
                                    })()}
                                    {/* <Dropdown.Item text={messagePart.read ? self.t("markAsUnread") : self.t("markAsRead")} onClick={() => self.updateReadFlag(msg._key, msg, !messagePart.read)} /> */}
                                    {/* <Dropdown.Item text={self.t("delete")} onClick={() => self.updateDeleteFlag(msg._key, msg, true)} /> */}
                                    {/* <Dropdown.Item text={self.t("stop")} /> */}
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
        let self = this;
        if (flag) {
            this.deletedItems.push(msg.id);
            this.deleteTimeouts[msg.id] = setTimeout(function () {
                eventApi.post("/notification/delete", { "user_id": self.state.userInfo.id, "id_prevent": msg.id }).then(async function (response) {
                    await NotificationHelper.getMessages(self.state.userInfo, self.state.dispatch, 1);
                });
            });
        } else {
            this.deletedItems.splice(this.deletedItems.indexOf(msg.id), 1);
            clearTimeout(this.deleteTimeouts[msg.id]);
        }
        await NotificationHelper.updateDeleteFlag(this.state.userInfo, this.state.dispatch, msgKey, msg, flag);
    }

    async acceptFriendRequestAsync(msg) {
        await NotificationHelper.acceptFriendRequest(this.state.userInfo, this.state.dispatch, msg);
    };

    render() {
        this.t = this.props.t;
        this.loading = false;
        const messageCount = this.props.messageCount;
        const messages = this.props.messages;
        const currentPage = this.props.page;
        const userInfo = this.props.userInfo;
        const dispatch = this.props.dispatch;
        const msgId = this.props.msgId;
        const lastSyncTime = this.props.lastSyncTime;
        const localeCode = this.props.localeCode;
        this.state = {
            msgId: msgId,
            messageCount: messageCount,
            messages: messages,
            lastSyncTime: lastSyncTime,
            page: currentPage,
            userInfo: userInfo,
            localeCode: localeCode,
            dispatch: dispatch
        };
        let self = this;
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
                                    <Link route="/user/profile/settings/notifications">
                                        <a className="settingsIcon"><Icon name="setting" /></a>
                                    </Link>
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
                </div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    const localeCodes = { "en": "en_CA", "fr": "fr_CA" };
    return {
        auth: state.user.auth,
        messages: state.firebase.messages,
        lastSyncTime: state.firebase.lastSyncTime,
        page: state.firebase.page,
        messageCount: state.firebase.messages ? Object.keys(state.firebase.messages.filter(function (m) { return !m.read; })).length : 0,
        userInfo: state.user.info,
        localeCode: localeCodes[state.user.info.attributes.language ? state.user.info.attributes.language : 'en']
    };
}

export default withTranslation('notification')(connect(mapStateToProps)(NotificationWrapper));