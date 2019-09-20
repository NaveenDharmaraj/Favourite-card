import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';
import { NotificationHelper } from '../../../../Firebase/NotificationHelper';
import { Link, Router } from '../../../../routes';
import { withTranslation } from '../../../../i18n';
import placeholderUser from '../../../../static/images/no-data-avatar-user-profile.png';
import { distanceOfTimeInWords } from '../../../../helpers/utils';

const noOfMessagesToShow = 6;

const Notifications = (props) => {
    let {
        messageCount,
        messages,
        userInfo,
        localeCode,
        dispatch,
        t
    } = props;
    if (!messages) {
        messages = [];
    }
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
    }

    const onNotificationMsgAction = async (cta, msg) => {
        switch (cta) {
            case "delete": {
                updateDeleteFlag(msg._key, msg, true);
                break;
            }
        }
    }

    const onNotificationCTA = async (ctaKey, ctaOptions, msg) => {
        console.log(JSON.stringify(msg) + JSON.stringify(cta));
        let ctaActionId = ctaKey;//cta.actionId;
        switch (ctaActionId) {
            case "setNewGivingGoal": {
                Router.pushRoute('/user/giving-goals');
                break;
            }
            case "sendThankYou": {
                let thankyouNote = ctaOptions.msg[this.state.localeCode];
                console.log(thankyouNote);
                Router.pushRoute("/chats/" + ctaOptions.sender_user_id);
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
                Router.pushRoute("/user/profile");
                break;
            }
            case "seeUpcomingGifts": {
                Router.pushRoute("/dashboard");
                break;
            }
            case "goToGivingGroup": {
                Router.pushRoute("/");
                break;
            }
            case "sayCongrats": {
                Router.pushRoute("/chats/{userId}");
                break;
            }
            case "accept": {
                this.acceptFriendRequestAsync(msg);
                break;
            }
            case "viewProfile": {
                Router.pushRoute("/users/profile/{userId}");
                break;
            }
        }
    }
    const listItems = messages.slice(0, noOfMessagesToShow).map(function (msg) {
        let messagePart = NotificationHelper.getMessagePart(msg, userInfo, 'en_CA');
        if (msg.deleted) {
            return <List.Item key={"notification_msg_" + msg._key} className="new">
                <div className="blankImage"></div>
                <List.Content>
                    {t("removed")} <a onClick={() => updateDeleteFlag(msg._key, msg, false)} >{t("undo")}</a>
                </List.Content>
            </List.Item>
        } else {
            //className={msg.read ? "" : "new"} onClick={() => updateReadFlag(msg._key, msg, true)}
            return (<List.Item key={"notification_head_" + msg._key} >
                <Image avatar src={messagePart.sourceImageLink ? messagePart.sourceImageLink : placeholderUser} />
                <List.Content>
                    {/* <b dangerouslySetInnerHTML={{ __html: messagePart.sourceDisplayName }}></b> {messagePart.message} */}
                    <span dangerouslySetInnerHTML={{ __html: messagePart.message }}></span>
                    <div className="time">{distanceOfTimeInWords(msg.createdTs)}</div>
                    <span className="more-btn">
                        <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                            <Dropdown.Menu>
                                {(() => {
                                    if (msg.msgActions && msg.msgActions.length > 0) {
                                        // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                                        return msg.msgActions.map(function (cta) {
                                            return <Dropdown.Item text={t(cta)} onClick={() => onNotificationMsgAction(cta, msg)} />
                                        });
                                    }
                                    /*if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                                        return <Button className="blue-btn-rounded-def c-small" onClick={() => self.acceptFriendRequestAsync(msg)}>{self.t("action_accept")}</Button>
                                    }*/
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
                            return Object.keys(msg.cta).map(function (ctaKey) {
                                let cta = msg.cta[ctaKey];
                                if (cta.isWeb) {
                                    return <Button className="blue-btn-rounded-def c-small" onClick={() => onNotificationCTA(ctaKey, cta, msg)}>{cta.title[localeCode]}</Button>
                                }
                            });
                        }
                        if (msg.callToActions && msg.callToActions.length > 0) {
                            // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                            return msg.cta.map(function (cta) {
                                return <Button className="blue-btn-rounded-def c-small" onClick={() => onNotificationCTA(cta, msg)}>{cta.actionTitle}</Button>
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
                </List.Content>*/}

            </List.Item>)
        }
    });
    return (<Popup
        position="bottom right"
        basic
        on="click"
        className="notification-popup"
        trigger={
            (
                <Menu.Item as="a" className="notifyNav">
                    {(() => {
                        if (messageCount > 0 && false) {
                            return <Label color="red" floating circular onClick={fetchMessages}>
                                {messageCount}
                            </Label>;
                        }
                    })()}

                    <Icon name={"bell outline" + (messageCount > 0 ? " new" : "")} />
                </Menu.Item>
            )
        }>
        <Popup.Header>
            {t("notificationHeader")} <a className="settingsIcon" style={{ display: 'none' }}><Icon name="setting" /></a>
        </Popup.Header>
        <Popup.Content>
            {/* <div className="viewAllNotifications"> */}
            {/*<div className="allNotification mb-3">*/}
            <List divided verticalAlign="top">
                {listItems}
            </List>
            {/*            </div>*/}
            {/* </div> */}
        </Popup.Content>
        <div className="popup-footer text-center">
            <Link route={`/notifications/all`}><a>{t("viewAll")}</a></Link>
        </div>
    </Popup>
    );
};

function mapStateToProps(state) {
    let localeCodes = { "en": "en_CA", "fr": "fr_CA" };
    return {
        messages: state.firebase.messages,
        lastSyncTime: state.firebase.lastSyncTime,
        localeCode: localeCodes[state.user.info.attributes.language ? state.user.info.attributes.language : 'en'],
        messageCount: state.firebase.messages ? Object.keys(state.firebase.messages.filter(function (m) { return m.createdTs > state.firebase.lastSyncTime;/*!m.read;*/ })).length : 0,
        userInfo: state.user.info
    };
}

export default withTranslation('notification')(connect(mapStateToProps)(Notifications));