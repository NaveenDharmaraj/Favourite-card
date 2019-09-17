import React from 'react';
import {
    Menu,
} from "semantic-ui-react";
import getConfig from 'next/config';

import { Link } from '../../../../routes';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const MainNavItem = (props) => {
    const {
        isExternal,
        location,
        name,
    } = props;
    if(isExternal) {
        return (
            <Link href={`${RAILS_APP_URL_ORIGIN}${location}`}>
                <Menu.Item as="a">
                    {name}
                </Menu.Item>
            </Link>
        );
    }
    return (
        <Link route={location}>
            <Menu.Item as="a">
                {name}
            </Menu.Item>
        </Link>
    );
};

export default MainNavItem;
