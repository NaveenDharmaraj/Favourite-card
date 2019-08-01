import React from 'react';
import {
    Divider,
    Image,
    Menu,
    List,
    Popup,
} from 'semantic-ui-react';

const Profile = () => (
    <Popup basic on='click' wide className="account-popup" position='bottom right'
        trigger={(
            <Menu.Item as="a" className="user-img">
                <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png'style={{width:'35px'}} circular />
            </Menu.Item>
        )}
    >
        <Popup.Header>
        Hello, Johns!
        </Popup.Header>
        <Popup.Content>
            <List link>
                <List.Item active as='a'>Account Settings</List.Item>
                <List.Item as='a'>Switch Accounts</List.Item>
                <Divider />
                <List.Item as='a'>Logout</List.Item>
            </List>
        </Popup.Content>
    </Popup>
);

export default Profile;
