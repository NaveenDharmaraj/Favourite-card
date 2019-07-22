import React from 'react';
import {
    Icon,
    Label,
    Menu,
} from 'semantic-ui-react';

const Chat = () => (
    <Menu.Item as="a">
        <Label color="red" floating circular>
            3
        </Label>
        <Icon name="chat" />
    </Menu.Item>
);

export default Chat;
