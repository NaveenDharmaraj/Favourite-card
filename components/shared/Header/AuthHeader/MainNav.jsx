import React from 'react';
import {
    Menu,
} from 'semantic-ui-react';

const MainNav = () => (
    <Menu.Menu position="right">
        <Menu.Item as="a" to="https://github.com">
            Explore
        </Menu.Item>
        <Menu.Item as="a" to="https://github.com">
            Giving Groups & Campaign
        </Menu.Item>
        <Menu.Item as="a" to="https://github.com">
            Favorites
        </Menu.Item>
        <Menu.Item as="a" to="https://github.com">
            Tools
        </Menu.Item>
        <Menu.Item as="a" to="https://github.com">
            Tax receipts
        </Menu.Item>
    </Menu.Menu>
);

export default MainNav;
