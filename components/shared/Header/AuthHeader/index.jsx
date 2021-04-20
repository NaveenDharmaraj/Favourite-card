import React, { Fragment } from 'react';
import {
    Menu,
    Image,
    Divider,
} from 'semantic-ui-react';

import MainNav from './MainNav';
import Notifications from './Notifications';
import Chat from './Chat';
import Profile from './Profile';
import Give from './Give';
import { Link } from '../../../../routes';
import searchIcon from '../../../../static/images/icons/icon-search.svg';

const AuthHeader = () => (
    <Fragment>
        <MainNav />
        <Menu.Menu position="right">
            <Menu.Item className="SearchIcon">
                <Link route="/search">
                    <Image src={searchIcon}/>
                </Link>       
            </Menu.Item>
            <Notifications />
            <Chat />
            <Profile />
            <Give />
        </Menu.Menu>
    </Fragment>
);

export default AuthHeader;
