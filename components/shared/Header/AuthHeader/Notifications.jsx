import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';
import { NotificationHelper } from '../../../../Firebase/NotificationHelper';
import { Link, Router } from '../../../../routes';
import { withTranslation } from '../../../../i18n';
import placeholderUser from '../../../../static/images/no-data-avatar-user-profile.png';
import {distanceOfTimeInWords} from '../../../../helpers/utils';

const noOfMessagesToShow = 6;

const Notifications = (props) => {
    let {
        messageCount,
        messages,
        userInfo,
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

    const onNotificationCTA = async (cta, msg) => {
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
                Router.pushRoute("/chats/{userId}");
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
    const listItems = messages.slice(0, noOfMessagesToShow).map(function (msg) {
        let messagePart = NotificationHelper.getMessagePart(msg, userInfo);
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
                    <div className="time">{distanceOfTimeInWords( msg.createdTs)}</div>
                    <span className="more-btn">
                        <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                            <Dropdown.Menu>
                                {/* <Dropdown.Item text={messagePart.read ? t("markAsUnread") : t("markAsRead")} onClick={() => updateReadFlag(msg._key, msg, !messagePart.read)} /> */}
                                <Dropdown.Item text={t("delete")} onClick={() => updateDeleteFlag(msg._key, msg, true)} />
                                <Dropdown.Item text={t("stop")} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                    {(() => {
                        if (msg.callToActions && msg.callToActions.length > 0) {
                            // msg.callToActions = msg.callToActions.concat(msg.callToActions);
                            return msg.callToActions.map(function (cta) {
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
    // console.log(state);
    return {
        messages: state.firebase.messages,
        lastSyncTime: state.firebase.lastSyncTime,
        messageCount: state.firebase.messages ? Object.keys(state.firebase.messages.filter(function (m) { return m.createdTs > state.firebase.lastSyncTime;/*!m.read;*/ })).length : 0,
        userInfo: state.user.info
    };
}

export default withTranslation('notification')(connect(mapStateToProps)(Notifications));