import React, { Fragment } from 'react';
import {
    Menu,
} from 'semantic-ui-react';

import MainNav from './MainNav';
import Notifications from './Notifications';
import Chat from './Chat';
import Profile from './Profile';
import Give from './Give';

const AuthHeader = () => (
    <Fragment>
        <MainNav />
        <Menu.Menu position="right">
            <Notifications />
            <Chat />
            <Profile />
            <Give />
        </Menu.Menu>
    </Fragment>
);

export default AuthHeader;
