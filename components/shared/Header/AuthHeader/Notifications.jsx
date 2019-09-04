import React from 'react';
import { connect } from 'react-redux';
import { Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';
import { NotificationHelper } from '../../../../Firebase/NotificationHelper';

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}
const noOfMessagesToShow = 8;

const Notifications = (props) => {
    let {
        messageCount,
        messages,
        userInfo,
        dispatch
    } = props;
    if (!messages) {
        messages = [];
    }
    const fetchMessages = async () => {
        await NotificationHelper.getMessages(userInfo, dispatch);
    };
    const onMessageClick = async (msgKey, msg) => {
        await NotificationHelper.markAsRead(userInfo, dispatch, msgKey, msg);
    };

    const acceptFriendRequestAsync = async (msg) => {
        await NotificationHelper.acceptFriendRequest(userInfo, dispatch, msg);
    };

    const listItems = messages.slice(0, noOfMessagesToShow).map((msg) => (
        <List.Item key={msg._key} style={{ backgroundColor: (msg.read ? "none" : "none") }}>
            <Image avatar src="https://react.semantic-ui.com/images/avatar/small/daniel.jpg" />
            <List.Content>
                <List.Header style={{ width: "100%", maxWidth: '500px' }}>
                    <div onClick={() => onMessageClick(msg._key, msg)} style={{ cursor: "pointer", maxWidth: "300px",width:"300px", overflow: "break-word", display: 'inline-block' }}>{msg.message}</div> &nbsp;&nbsp;&nbsp;&nbsp;
                    {(() => {
                        if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                            return <div style={{ width: "100px", textAlign: 'center', float: 'right', display: 'inline-block' }}>
                                {/* <button style={{ float: "right" }} className="ui button">Reject</button> */}
                                <button style={{ float: "right", marginRight: "10px" }} className="ui primary button" onClick={() => acceptFriendRequestAsync(msg)}>Accept</button>
                            </div>;
                        }
                    })()}
                </List.Header>

                <List.Description>
                    {timeDifference(new Date().getTime(), msg.createdTs)}
                </List.Description>
            </List.Content>
        </List.Item>
    ));
    return (<Popup
        position="bottom center"
        pinned
        className="notification-popup"
        trigger={
            (
                <Menu.Item as="a">
                    {(() => {
                        if (messageCount > 0) {
                            return <Label color="red" floating circular onClick={fetchMessages}>
                                {messageCount}
                            </Label>;
                        }
                    })()}

                    <Icon name="bell outline" />
                </Menu.Item>
            )
        }
        flowing
        hoverable
    >
        <Popup.Header>
            Notification <a style={{ float: 'right', display: 'none' }}><Icon name="setting" /></a>
        </Popup.Header>
        <Popup.Content>
            <List relaxed="very">
                {listItems}
            </List>
        </Popup.Content>
        <div className="popup-footer text-center">
            <a href="/notifications/all">{messageCount <= noOfMessagesToShow ? "See All Activity" : "See all activity"}</a>
        </div>
    </Popup>
    );
};

function mapStateToProps(state) {
    console.log(state);
    return {
        messages: state.firebase.messages,
        messageCount: state.firebase.messages ? Object.keys(state.firebase.messages).length : 0,
        userInfo: state.user.info
    };
}

export default connect(mapStateToProps)(Notifications);