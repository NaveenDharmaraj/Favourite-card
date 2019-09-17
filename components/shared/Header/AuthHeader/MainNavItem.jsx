import React from 'react';
import {
    Menu,
} from "semantic-ui-react";

import { Link } from '../../../../routes';

const MainNavItem = (props) => {
    const {
        isExternal,
        location,
        name,
    } = props;
    if(isExternal) {
        return (
            <Link href={location}>
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
