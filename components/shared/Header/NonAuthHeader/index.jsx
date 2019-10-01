import React, { Fragment } from 'react';
import {
    Button,
    Dropdown,
    Icon,
    Menu,
} from 'semantic-ui-react';

import { Link } from '../../../../routes';

const NonAuthHeader = () => (
    <Fragment>
        <Menu.Menu className="left-menu">
            <Menu.Item as="a" to="https://github.com">
                How it works
            </Menu.Item>
            <Dropdown item text='About'>
                <Dropdown.Menu>
                    <Dropdown.Item text='Press'/>
                    <Dropdown.Item text='Charitable Impact ' />
                    <Dropdown.Item text='Careers' />
                    <Dropdown.Item text='Foundation' />
                </Dropdown.Menu>
            </Dropdown>
            <Menu.Item as="a" to="https://github.com">
                Support
            </Menu.Item>
            <Menu.Item as="a" to="https://github.com">
                Blog
            </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right btn-wraper">
            <Link route='/search'>
                <Menu.Item as="a" to="" className="login-btn">
                    <Icon name='search'/>
                    Explore
                </Menu.Item>
            </Link>
            <Link route='/users/login'>
                <Menu.Item as="a" to="" className="login-btn">
                    Login
                </Menu.Item>
            </Link>
            <Link route='/users/new'>
                <Menu.Item className="signup">
                    <Button primary>Sign Up</Button>
                </Menu.Item>
            </Link>
        </Menu.Menu>
    </Fragment>
);

export default NonAuthHeader;
