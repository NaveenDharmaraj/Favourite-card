import React from 'react';
import {
    Icon,
    Image,
    Menu,
    Label,
    Popup,
    List,
} from 'semantic-ui-react';

const Notifications = () => (
    <Popup
        position="bottom center"
        pinned
        className="notification-popup"
        trigger={
            (
                <Menu.Item as="a">
                    <Label color="red" floating circular>
                        12
                    </Label>
                    <Icon name="bell outline" />
                </Menu.Item>
            )
        }
        flowing
        hoverable
    >
        <Popup.Header>
            Notification <a style={{float:'right'}}><Icon name="setting"/></a>
        </Popup.Header>
        <Popup.Content>
            <List relaxed="very">
                <List.Item>
                    <Image avatar src="https://react.semantic-ui.com/images/avatar/small/daniel.jpg" />
                    <List.Content>
                        <List.Header>
                            <a>Daniel Louise</a>
                            Started followed you
                        </List.Header>
                        <List.Description>
                            4 hours ago
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
                    <List.Content>
                        <List.Header as="a">
                            Stevie Feliciano
                        </List.Header>
                        <List.Description>
                            Last seen watching
                            {' '}
                            <a>
                                <b>Bob's Burgers</b>
                            </a>
                            {' '}
                            10 hours ago.
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                    <List.Content>
                        <List.Header as="a">Elliot Fu</List.Header>
                        <List.Description>
                            Last seen watching
                            {' '}
                            <a>
                                <b>The Godfather Part 2</b>
                            </a>
                            {' '}
                            yesterday.
                        </List.Description>
                    </List.Content>
                </List.Item>
            </List>
        </Popup.Content>
        <div className="popup-footer text-center">
            <a href="">See all activity</a>
        </div>
    </Popup>
);

export default Notifications;
