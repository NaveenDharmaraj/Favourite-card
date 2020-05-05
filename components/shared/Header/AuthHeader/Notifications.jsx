import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Button, Dropdown, Icon, Image, Label, List, Menu, Popup,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import { NotificationHelper } from '../../../../Firebase/NotificationHelper';
import {
    Link, Router,
} from '../../../../routes';
import { withTranslation } from '../../../../i18n';
import placeholderUser from '../../../../static/images/no-data-avatar-user-profile.png';
import { distanceOfTimeInWords } from '../../../../helpers/utils';
import eventApi from '../../../../services/eventApi';
import {
    updateUserPreferences,
} from '../../../../actions/userProfile';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deletedItems: [],
            deleteTimeouts: {},
            intervalId: -1,
            showBackImage: false,
        };
        this.updateDeleteFlag = this.updateDeleteFlag.bind(this);
        this.renderlistItems = this.renderlistItems.bind(this);
        this.acceptFriendRequestAsync = this.acceptFriendRequestAsync.bind(this);
        this.onNotificationMsgAction = this.onNotificationMsgAction.bind(this);
        this.renderIconColor = this.renderIconColor.bind(this);
        this.splitNotifications = this.splitNotifications.bind(this);
        this.renderbackImage = this.renderbackImage.bind(this);
    }

    updateDeleteFlag(msgKey, msg, flag) {
        const {
            deletedItems,
            deleteTimeouts,
        } = this.state;

        const {
            userInfo,
        } = this.props;
        if (flag) {
            deletedItems.push(msg.id);
            deleteTimeouts[msg.id] = setTimeout(() => {
                eventApi.post('/notification/delete', {
                    id: msg.id,
                    user_id: userInfo.id,
                });
            }, 10000);
        } else {
            deletedItems.splice(deletedItems.indexOf(msg.id), 1);
            clearTimeout(deleteTimeouts[msg.id]);
        }
        this.setState({
            ...this.state,
            deletedItems,
            deleteTimeouts,
        });
    }

    componentWillMount() {
        const {
            messages,
            userInfo,
            dispatch,
        } = this.props;
        if (_isEmpty(messages)) {
            NotificationHelper.firebaseInitialLoad(userInfo, dispatch);
        }
    }

    acceptFriendRequestAsync(msg) {
        const {
            userInfo,
            dispatch,
        } = this.props;
        NotificationHelper.acceptFriendRequest(userInfo, dispatch, msg);
    }

    // eslint-disable-next-line class-methods-use-this
    splitNotifications(messages = []) {
        const {
            lastSyncTime
        } = this.props;
        const recentItems = messages.filter((item) => {
            if (item) { return item.createdTs > lastSyncTime; }
        });

        const earlierItems = messages.filter((item) => {
            if (item) { return item.createdTs <= lastSyncTime; }
        });
        return {
            earlier: earlierItems,
            recent: recentItems,
        };
    }

    renderlistItems(messages, newClass = '') {
        const {
            userInfo,
            localeCode,
            t,
        } = this.props;
        if (_isEmpty(messages)) {
            return null;
        }
        let list = [];
        messages.slice(0, 6).map((msg) => {
        // const messagePart = NotificationHelper.getMessagePart(msg, userInfo, 'en_CA');
            let messagePart;
            if (!_isEmpty(msg) && msg.msg) {
                messagePart = NotificationHelper.getMessagePart(msg, userInfo, 'en_CA');
            } else {
                return null;
            }
            if (this.state.deletedItems.indexOf(msg['id']) >= 0) {
                return list.push(
                    <List.Item key={`notification_msg_${msg._key}`} className="new">
                        <div className="blankImage" />
                        <List.Content>
                            {t('removed')} <a onClick={() => this.updateDeleteFlag(msg._key, msg, false)}>{t('undo')}</a>
                        </List.Content>
                    </List.Item>,
                )
            }
            // className={msg.read ? "" : "new"} onClick={() => updateReadFlag(msg._key, msg, true)}
            return list.push(
                <List.Item key={`notification_head_${msg._key}`} className={newClass}>
                    <Image avatar src={messagePart.sourceImageLink ? messagePart.sourceImageLink : placeholderUser} />
                    <List.Content>
                        <span dangerouslySetInnerHTML={{ __html: messagePart.message }} />
                        <div className="time">{distanceOfTimeInWords(msg.createdTs)}</div>
                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    {(() => {
                                        if (msg.msgActions && msg.msgActions.length > 0) {
                                            return msg.msgActions.map((cta) => {
                                                return <Dropdown.Item key={cta} text={t(cta)} onClick={() => this.onNotificationMsgAction(cta, msg)} />;
                                            });
                                        }
                                    })()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                        {(() => {
                            if (msg.cta) {
                                return Object.keys(msg.cta).map((ctaKey) => {
                                    const cta = msg.cta[ctaKey];
                                    if (cta.isWeb) {
                                        return <Button key={ctaKey} className="blue-btn-rounded-def c-small" onClick={() => this.onNotificationCTA(ctaKey, cta, msg)}>{cta.title[localeCode]}</Button>;
                                    }
                                });
                            }
                        })()}
                    </List.Content>
                </List.Item>,
            );
        });
        return list;
    }

    async onNotificationCTA(ctaKey, ctaOptions, msg) {
        const ctaActionId = ctaKey; // cta.actionId;
        switch (ctaActionId) {
            case 'setNewGivingGoal': {
                Router.pushRoute('/user/giving-goals');
                break;
            }
            case 'sendThankYou': {
                // let thankyouNote = ctaOptions.msg[this.state.localeCode];
                const userId = ctaOptions['user_id'];
                Router.pushRoute(`/chats/${userId}`);
                break;
            }
            case 'sendGift': {
                Router.pushRoute('/give/to/friend/new');
                break;
            }
            case 'viewMessage': {
                Router.pushRoute('/chats/' + cta.user_id);
                break;
            }
            case 'updatePayment': {
                Router.pushRoute('/user/profile/settings/creditcard');
                break;
            }
            case 'seeUpcomingGifts': {
                Router.pushRoute('/dashboard');
                break;
            }
            case 'goToGivingGroup': {
                const givingGroupSlug = ctaOptions['group_slug'];
                Router.pushRoute(`/groups/${givingGroupSlug}`);
                break;
            }
            case 'sayCongrats': {
                const userId = ctaOptions['user_id'];
                Router.pushRoute(`/chats/${userId}`);
                break;
            }
            case 'accept': {
                this.acceptFriendRequestAsync(msg);
                break;
            }
            case 'viewProfile': {
                const userId = ctaOptions['user_id'];
                Router.pushRoute(`/users/profile/${userId}`);
                break;
            }
            default:
                break;
        }
    };

    async onNotificationMsgAction(cta, msg) {
        switch (cta) {
            case 'delete': {
                this.updateDeleteFlag(msg._key, msg, true);
                break;
            }
            case 'turnOff': {
                updateUserPreferences(this.props.dispatch, this.props.userInfo.id, 'in_app_giving_group_activity', false);
                break;
            }
            default:
                break;
        }
    }

    // fetchMessages = async () => {
    //     await NotificationHelper.getMessages(userInfo, dispatch, 1);
    // };

    renderIconColor() {
        const {
            dispatch,
        } = this.props;
        this.setState({
            showBackImage: true,
        });
        dispatch({
            payload: {
                notificationUpdate: false,
            },
            type: 'FIREBASE_NOTIFICATION_COUNT',
        });
    }

    renderbackImage() {
        this.setState({
            showBackImage: false,
        });
    }

    render() {
        const {
            messages,
            notificationUpdate,
            t,
        } = this.props;
        // setInterval(async () => {
        //     await NotificationHelper.getMessages(userInfo, dispatch, 1);
        // }, 1000 * 60 * 5);

        // updateReadFlag = async (msgKey, msg, flag) => {
        //     await NotificationHelper.updateReadFlag(userInfo, dispatch, msgKey, msg, flag);
        // };
        const {
            showBackImage,
        } = this.state;
        const activeClass = (showBackImage) ? 'menuActive' : '';
        const itemByType = this.splitNotifications(messages);
        const recentItems = !_isEmpty(itemByType.recent) ? itemByType.recent : [];
        const earlierItems = !_isEmpty(itemByType.earlier) ? itemByType.earlier : [];
        const recentList = (recentItems && recentItems.length > 0) && this.renderlistItems(recentItems, 'new');
        const earlierList = (earlierItems && earlierItems.length > 0) && this.renderlistItems(earlierItems);
        let renderList = [];
        if (recentList && recentList.length> 0 && earlierList && earlierList.length > 0) {
            renderList = recentList.concat(earlierList).slice(0, 6);
        } else if (recentList && recentList.length > 0) {
            renderList = recentList;
        } else if (earlierList && earlierList.length > 0) {
            renderList = earlierList;
        }
        return (
            <Popup
                position="bottom right"
                basic
                on="click"
                className="notification-popup"
                onOpen={() => this.renderIconColor()}
                onClose={() => this.renderbackImage()}
                trigger={
                    (
                        <Menu.Item as="a" className={`notifyNav xs-d-none ${activeClass}`}>
                            <Icon name={`bell outline${notificationUpdate ? ' new' : ''}`} />
                        </Menu.Item>
                    )
                }
            >
                <Popup.Header>
                    {t('notificationHeader')} <Link route="/user/profile/settings/notifications"><a className="settingsIcon"><Icon name="setting" /></a></Link>
                </Popup.Header>
                <Popup.Content>
                    <List divided verticalAlign="top">
                        {renderList.map((list) => list)}
                    </List>
                </Popup.Content>
                <div className="popup-footer text-center">
                    <Link route={`/notifications/all`}><a>{t('viewAll')}</a></Link>
                </div>
            </Popup>
        );
    }
}

function mapStateToProps(state) {
    const localeCodes = {
        en: 'en_CA',
        fr: 'fr_CA',
    };
    return {
        messages: state.firebase.messages,
        lastSyncTime: state.firebase.lastSyncTime,
        localeCode: localeCodes[state.user.info.attributes.language ? state.user.info.attributes.language : 'en'],
        notificationUpdate: state.firebase.notificationUpdate,
        userInfo: state.user.info,
    };
}

export default withTranslation('notification')(connect(mapStateToProps)(Notifications));
