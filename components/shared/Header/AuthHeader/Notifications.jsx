import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';

import { NotificationHelper } from '../../../../Firebase/NotificationHelper';
import { Link, Router } from '../../../../routes';
import { withTranslation } from '../../../../i18n';
import placeholderUser from '../../../../static/images/no-data-avatar-user-profile.png';
import { distanceOfTimeInWords } from '../../../../helpers/utils';
import {
    updateUserPreferences,
} from '../../../../actions/userProfile';

const noOfMessagesToShow = 6;

const Notifications = (props) => {
    const {
        messageCount,
        userInfo,
        localeCode,
        dispatch,
        t,
    } = props;
    let {
        messages,
    } = props;
    if (!messages) {
        messages = [];
    }
    setInterval(async () => {
        await NotificationHelper.getMessages(userInfo, dispatch, 1);
    }, 10000);
    const fetchMessages = async () => {
        await NotificationHelper.getMessages(userInfo, dispatch, 1);
    };
    const updateReadFlag = async (msgKey, msg, flag) => {
        await NotificationHelper.updateReadFlag(userInfo, dispatch, msgKey, msg, flag);
    };

    const acceptFriendRequestAsync = async (msg) => {
        await NotificationHelper.acceptFriendRequest(userInfo, dispatch, msg);
    };

    const updateDeleteFlag = async (msgKey, msg, flag) => {
        await NotificationHelper.updateDeleteFlag(userInfo, dispatch, msgKey, msg, flag);
    };

    const onNotificationMsgAction = async (cta, msg) => {
        switch (cta) {
            case 'delete': {
                updateDeleteFlag(msg._key, msg, true);
                break;
            }
            case 'turnOff': {
                updateUserPreferences(dispatch, userInfo.id, 'in_app_giving_group_activity', false);
                break;
            }
            default:
                break;
        }
    };

    const onNotificationCTA = async (ctaKey, ctaOptions, msg) => {
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
                // Router.pushRoute("/chats/" + cta.user_id);
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
                acceptFriendRequestAsync(msg);
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

    const listItems = messages.slice(0, noOfMessagesToShow).map((msg) => {
        // const messagePart = NotificationHelper.getMessagePart(msg, userInfo, 'en_CA');
        let messagePart;
        if (msg.msg) {
            messagePart = NotificationHelper.getMessagePart(msg, userInfo, 'en_CA');
        } else {
            return null;
        }
        if (msg.deleted) {
            return (
                <List.Item key={`notification_msg_${msg._key}`} className="new">
                    <div className="blankImage" />
                    <List.Content>
                        {t('removed')} <a onClick={() => updateDeleteFlag(msg._key, msg, false)} >{t('undo')}</a>
                    </List.Content>
                </List.Item>
            );
        }
        // className={msg.read ? "" : "new"} onClick={() => updateReadFlag(msg._key, msg, true)}
        return (
            <List.Item key={`notification_head_${msg._key}`}>
                <Image avatar src={messagePart.sourceImageLink ? messagePart.sourceImageLink : placeholderUser} />
                <List.Content>
                    {/* <b dangerouslySetInnerHTML={{ __html: messagePart.sourceDisplayName }}></b> {messagePart.message} */}
                    <span dangerouslySetInnerHTML={{ __html: messagePart.message }} />
                    <div className="time">{distanceOfTimeInWords(msg.createdTs)}</div>
                    <span className="more-btn">
                        <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                            <Dropdown.Menu>
                                {(() => {
                                    if (msg.msgActions && msg.msgActions.length > 0) {
                                    // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                                        return msg.msgActions.map((cta) => {
                                            return <Dropdown.Item text={t(cta)} onClick={() => onNotificationMsgAction(cta, msg)} />;
                                        });
                                    }
                                /* if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                                        return <Button className="blue-btn-rounded-def c-small" onClick={() => self.acceptFriendRequestAsync(msg)}>{self.t("action_accept")}</Button>
                                    } */
                                })()}
                                {/* <Dropdown.Item text={messagePart.read ? t("markAsUnread") : t("markAsRead")} onClick={() => updateReadFlag(msg._key, msg, !messagePart.read)} />
                                <Dropdown.Item text={t("delete")} onClick={() => updateDeleteFlag(msg._key, msg, true)} />
                                <Dropdown.Item text={t("stop")} /> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                    {(() => {
                        if (msg.cta) {
                        // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                            return Object.keys(msg.cta).map((ctaKey) => {
                                const cta = msg.cta[ctaKey];
                                if (cta.isWeb) {
                                    return <Button className="blue-btn-rounded-def c-small" onClick={() => onNotificationCTA(ctaKey, cta, msg)}>{cta.title[localeCode]}</Button>;
                                }
                            });
                        }
                        if (msg.callToActions && msg.callToActions.length > 0) {
                        // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                            return msg.cta.map((cta) => {
                                return <Button className="blue-btn-rounded-def c-small" onClick={() => onNotificationCTA(cta, msg)}>{cta.actionTitle}</Button>;
                            });
                        }
                    // if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                    //     return <Button className="blue-btn-rounded-def c-small" onClick={() => acceptFriendRequestAsync(msg)}>{t("action_accept")}</Button>
                    // }
                    })()}
                </List.Content>
                {/* <List.Content floated='right'>
                    {(() => {
                        if (msg.callToActions && msg.callToActions.length > 0) {
                            // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                            return msg.callToActions.map(function (cta) {
                                return <Button className="blue-btn-rounded-def c-small" onClick={() => self.onNotificationCTA(cta, msg)}>{cta.actionTitle}</Button>
                            });
                        }
                        // if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                        //     return <Button className="blue-btn-rounded-def c-small" onClick={() => acceptFriendRequestAsync(msg)}>{t("action_accept")}</Button>
                        // }
                    })()}

                    <span className="more-btn">
                        <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                            <Dropdown.Menu>
                                {/* <Dropdown.Item text={messagePart.read ? t("markAsUnread") : t("markAsRead")} onClick={() => updateReadFlag(msg._key, msg, !messagePart.read)} /> * /}
                                <Dropdown.Item text={t("delete")} onClick={() => updateDeleteFlag(msg._key, msg, true)} />
                                <Dropdown.Item text={t("stop")} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                </List.Content> */}

            </List.Item>
        );
    });
    return (
        <Popup
            position="bottom right"
            basic
            on="click"
            className="notification-popup"
            trigger={
                (
                    <Menu.Item as="a" className="notifyNav">
                        {(() => {
                            if (messageCount > 0 && false) {
                                return (
                                    <Label color="red" floating circular onClick={fetchMessages}>
                                        {messageCount}
                                    </Label>
                                );
                            }
                        })()}

                        <Icon name={`bell outline${messageCount > 0 ? ' new' : ''}`} />
                    </Menu.Item>
                )
            }
        >
            <Popup.Header>
                {t('notificationHeader')} <a className="settingsIcon" style={{ display: 'none' }}><Icon name="setting" /></a>
            </Popup.Header>
            <Popup.Content>
                {/* <div className="viewAllNotifications"> */}
                {/* <div className="allNotification mb-3"> */}
                <List divided verticalAlign="top">
                    {listItems}
                </List>
                {/*            </div> */}
                {/* </div> */}
            </Popup.Content>
            <div className="popup-footer text-center">
                <Link route={`/notifications/all`}><a>{t('viewAll')}</a></Link>
            </div>
        </Popup>
    );
};

function mapStateToProps(state) {
    const localeCodes = {
        en: 'en_CA',
        fr: 'fr_CA',
    };
    return {
        messages: state.firebase.messages,
        lastSyncTime: state.firebase.lastSyncTime,
        localeCode: localeCodes[state.user.info.attributes.language ? state.user.info.attributes.language : 'en'],
        messageCount: state.firebase.messages ? Object.keys(state.firebase.messages.filter(function (m) { return m.createdTs > state.firebase.lastSyncTime;/*! m.read;*/ })).length : 0,
        userInfo: state.user.info,
    };
}

export default withTranslation('notification')(connect(mapStateToProps)(Notifications));