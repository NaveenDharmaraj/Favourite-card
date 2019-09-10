import React from 'react';
import {
    Icon,
    Image,
    Menu,
    Label,
    Popup,
    List,
    Dropdown,
    Button
} from 'semantic-ui-react';

const Notifications = () => (
    <Popup
        position="bottom right"
        basic
        on="click"
        className="notification-popup"
        trigger={
            (
                <Menu.Item as="a" className="notifyNav">
                    <Icon name="bell outline new" />
                </Menu.Item>
            )
        }
    >
        <Popup.Header>
            Notification
            <a className="settingsIcon">
                <Icon name="setting" />
            </a>
        </Popup.Header>
        <Popup.Content>
            <List divided verticalAlign="top">
                <List.Item className="new">
                    <List.Content>
                        This notification is now removed. <a>Undo</a>
                    </List.Content>
                </List.Item>
                <List.Item className="new">
                    <Image avatar src="https://react.semantic-ui.com/images/avatar/small/lena.png" />
                    <List.Content>
                        <b>Sophia Yakisoba</b>
                        is waiting for you to accept their invitation.
                        <div className="time">4 hours ago</div>
                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Delete this notification" />
                                    <Dropdown.Item text="Stop recieving notifications like this" />
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                        <Button className="blue-btn-rounded-def c-small">Accept</Button>
                    </List.Content>
                </List.Item>
                <List.Item className="new">
                    <Image avatar src="https://react.semantic-ui.com/images/avatar/small/lena.png" />
                    <List.Content>
                        <b>Pablo Jorge</b>
                        just met his Giving Goal!
                        <div className="time">4 hours ago</div>
                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Delete this notification" />
                                    <Dropdown.Item text="Stop recieving notifications like this" />
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                        <Button className="blue-bordr-btn-round-def c-small">View profile</Button>
                    </List.Content>
                </List.Item>
                <List.Item className="new">
                    <Image avatar src="https://react.semantic-ui.com/images/avatar/small/lena.png" />
                    <List.Content>
                        <b>Kholde Brew </b>
                        and you are now friends.

                        <div className="time">Sunday</div>
                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Delete this notification" />
                                    <Dropdown.Item text="Stop recieving notifications like this" />
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                        <Button className="blue-btn-rounded-def c-small">Accept</Button>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src="https://react.semantic-ui.com/images/avatar/small/lena.png" />
                    <List.Content>
                        <b>CHIMP </b>
                        just introduced a new way of giving to maximize your donation.
                        <div className="time">Jan 13</div>
                        <span className="more-btn">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Delete this notification" />
                                    <Dropdown.Item text="Stop recieving notifications like this" />
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                        <Button className="blue-btn-rounded-def c-small">Accept</Button>
                    </List.Content>
                </List.Item>
            </List>
        </Popup.Content>
        <div className="popup-footer text-center">
            <a href="">
                See all activity
            </a>
        </div>
    </Popup>
);

export default Notifications;
