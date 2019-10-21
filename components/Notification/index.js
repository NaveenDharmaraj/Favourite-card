import React, { cloneElement, Fragment } from 'react';
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
    Dropdown,
    Responsive,
    List,
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
        this.t = props.t;
        this.listItems.bind(this);
        this.splitNotifications.bind(this);
        this.acceptFriendRequestAsync.bind(this);
        this.updateDeleteFlag.bind(this);
        this.onNotificationCTA.bind(this);
        this.onNotificationMsgAction.bind(this);
        this.handleScroll.bind(this);
        this.state = {
            deletedItems: [],
            deleteTimeouts: {},
            intervalId: -1,
        }
    }

    handleScroll = (e) => {
        const {
            userInfo,
            dispatch,
            messages,
        } = this.props;
        const footerHeight = document.getElementsByClassName('my-footer')[0].offsetHeight;
        // Do something generic, if you have to
        let reachedBottom = document.scrollingElement.scrollHeight - footerHeight <= document.scrollingElement.scrollTop + window.innerHeight;
        this.loading = false;
        if (messages && messages.length > 0 && reachedBottom && !this.loading) {
            this.loading = true;
            let lastMsg = messages[messages.length - 1];
            NotificationHelper.getMessages(userInfo, dispatch, 1, lastMsg, lastMsg["_key"]);
        }
    }

    async componentWillUnmount() {
        const {
            intervalId,
        } = this.state;
        const {
            userInfo,
            dispatch,
        } = this.props;
        await NotificationHelper.updateLastSyncTime(userInfo, dispatch, new Date().getTime());
        window.removeEventListener("scroll", this.handleScroll);
        clearInterval(intervalId);
    }

    async componentDidMount() {
        // const {
        //     userInfo,
        //     dispatch
        // } = this.props;
        window.addEventListener("scroll", this.handleScroll);
        // await NotificationHelper.getMessages(userInfo, dispatch, 1);
    }

    async acceptFriendRequestAsync(msg) {
        const {
            userInfo,
            dispatch
        } = this.props;
        await NotificationHelper.acceptFriendRequest(userInfo, dispatch, msg);
    };

    async onNotificationMsgAction(cta, msg) {
        switch (cta) {
            case "delete": {
                this.updateDeleteFlag(msg._key, msg, true);
                break;
            }
            case "turnOff": {
                updateUserPreferences(this.props.dispatch, this.props.userInfo.id, "in_app_giving_group_activity", false);
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

    listItems(messages , newClass = "") {
        if (!messages) {
            messages = [];
        }
        let self = this;
        const {
            deletedItems,
        } = this.state;
        const {
            localeCode,
            dispatch,
            userInfo,
        } = this.props;
        return messages.map(function (msg) {
            let messagePart;
            if (msg.msg) {
                messagePart = NotificationHelper.getMessagePart(msg, userInfo, 'en_CA');
            } else {
                return null;
            }
            if (deletedItems.indexOf(msg["id"]) >= 0) {
                return <List.Item key={"notification_msg_" + msg._key} className="new">
                    <div className="blankImage"></div>
                    <List.Content>
                        {self.t("removed")} <a onClick={() => self.updateDeleteFlag(msg._key, msg, false)} >{self.t("undo")}</a>
                    </List.Content>
                </List.Item>
            } else {
                // className={msg.read ? "" : "new"} onClick={() => self.updateReadFlag(msg._key, msg, true)}
                return (<List.Item key={"notification_msg_" + msg._key} className={newClass}>
                    <List.Content floated='right' className="d-d-inline-block">
                        <Responsive minWidth={768}>
                            {(() => {
                                if (msg.cta) {
                                    return Object.keys(msg.cta).map(function (ctaKey) {
                                        let cta = msg.cta[ctaKey];
                                        if (cta.isWeb) {
                                            return <Button className="blue-btn-rounded-def c-small" onClick={() => self.onNotificationCTA(ctaKey, cta, msg)}>{cta.title[localeCode]}</Button>
                                        }
                                    });
                                }
                            })()}
                        </Responsive>
                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                                <Dropdown.Menu>
                                    {(() => {
                                        if (msg.msgActions && msg.msgActions.length > 0) {
                                            return msg.msgActions.map(function (cta) {
                                                return <Dropdown.Item text={self.t(cta)} onClick={() => self.onNotificationMsgAction(cta, msg)} />
                                            });
                                        }
                                    })()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                    </List.Content>
                    <Image avatar src={messagePart.sourceImageLink ? messagePart.sourceImageLink : placeholderUser} />
                    <List.Content>
                        <span dangerouslySetInnerHTML={{ __html: messagePart.message }}></span>
                        <div className="time">{distanceOfTimeInWords(msg.createdTs)}</div>
                        <Responsive maxWidth={767}>
                            {(() => {
                                if (msg.cta) {
                                    return Object.keys(msg.cta).map(function (ctaKey) {
                                        let cta = msg.cta[ctaKey];
                                        if (cta.isWeb) {
                                            return <Button className="blue-btn-rounded-def c-small" onClick={() => self.onNotificationCTA(ctaKey, cta, msg)}>{cta.title[localeCode]}</Button>
                                        }
                                    });
                                }
                            })()}
                        </Responsive>
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
            if(item)
            return item.createdTs > lastSyncTime;
        });

        let earlierItems = messages.filter(function (item) {
            if(item)
            return item.createdTs <= lastSyncTime;
        });
        return { "recent": recentItems, "earlier": earlierItems };
    }
    // async updateReadFlag(msgKey, msg, flag) {
    //     await NotificationHelper.updateReadFlag(this.state.userInfo, this.state.dispatch, msgKey, msg, flag);
    // };

    async updateDeleteFlag(msgKey, msg, flag) {
        const {
            deletedItems,
            deleteTimeouts,
        } = this.state;

        const {
            userInfo,
        } = this.props;
       if (flag) {
            deletedItems.push(msg.id);
            deleteTimeouts[msg.id] = setTimeout(function () {
                eventApi.post("/notification/delete", { "user_id": userInfo.id, "id": msg.id });
            },10000);
        } else {
            deletedItems.splice(deletedItems.indexOf(msg.id), 1);
            clearTimeout(deleteTimeouts[msg.id]);
        }
        this.setState({
            ...this.state,
            deletedItems,
            deleteTimeouts,
        })
    }

    render() {
        this.t = this.props.t;
        this.loading = false;
        const currentPage = this.props.page;
        const msgId = this.props.msgId;
        const {
            lastSyncTime,

        } = this.props;
        this.state = {
            ...this.state,
            msgId: msgId,
            page: currentPage,
        };
        let self = this;
        let itemByType = self.splitNotifications(this.props.messages, lastSyncTime);
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
                                        {self.listItems(recentItems, 'new')}
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
        userInfo: state.user.info,
        localeCode: localeCodes[state.user.info.attributes.language ? state.user.info.attributes.language : 'en']
    };
}

export default withTranslation('notification')(connect(mapStateToProps)(NotificationWrapper));
