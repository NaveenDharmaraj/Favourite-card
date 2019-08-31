import React from 'react';
import { connect } from 'react-redux';
import { Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';

const Chat = (props) => {
    let {
        userInfo,
        dispatch
    } = props;
    
    return (
        <Popup
            position="bottom center"
            pinned
            className="notification-popup"
            trigger={
                (
                    <Menu.Item as="a">
                        {/* {userInfo.applogicClientRegistration ? (userInfo.applogicClientRegistration.totalUnreadCount > 0 ? <Label color="red" floating circular>4</Label> : '') : ''} */}
                        {window.totalUnreadCount > 0 ? <Label color="red" floating circular className="chat-launcher-icon">{window.totalUnreadCount}</Label> : ""}
                        <Icon name="chat" />
                    </Menu.Item>
                )
            }
            flowing
            hoverable>
            <Popup.Header>
                Messages <a style={{ float: 'right', display: 'none' }}><Icon name="setting" /></a>
            </Popup.Header>
            <Popup.Content>
                <List relaxed="very">
                    <List.Item key={"chat_1"} style={{ backgroundColor: "none" }}>
                        <Image avatar src="https://react.semantic-ui.com/images/avatar/small/daniel.jpg" />
                        <List.Content>
                            <List.Header style={{ width: "100%", maxWidth: '500px' }}>
                                <a className="header">Sandeep Shet</a>
                                <div style={{ cursor: "pointer", maxWidth: "300px", width: "300px", overflow: "break-word", display: 'inline-block' }}>{"Hey, let's connect today over a coffee?"}</div> &nbsp;&nbsp;&nbsp;&nbsp;
                            </List.Header>
                            <List.Description>
                                {"12:29"}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                </List>
            </Popup.Content>
            <div className="popup-footer text-center">
                <a href="/chats/all">See All Conversations</a>
            </div>
        </Popup>
    );
};

function mapStateToProps(state) {
    return {
        userInfo: state.user.info
    };
}

export default connect(mapStateToProps)(Chat);
