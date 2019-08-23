import React from 'react';
import {
    Menu,
} from 'semantic-ui-react';

import { Link } from '../../../../routes';

const MainNav = () => (
    <Menu.Menu position="right">
        <Link route="/search" >
            <Menu.Item as="a">
                Explore
            </Menu.Item>
        </Link>
        <Menu.Item as="a" href="/user/groups">
            Giving Groups & Campaign
        </Menu.Item>
        <Menu.Item as="a" href="/user/followed-charities">
            Favorites
        </Menu.Item>
        <Link route="/user/recurring-donations" >
            <Menu.Item as="a">
                Tools
            </Menu.Item>
        </Link>
        <Menu.Item as="a" href="/user/tax-receipts">
            Tax receipts
        </Menu.Item>
    </Menu.Menu>
);

export default MainNav;
