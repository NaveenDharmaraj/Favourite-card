import React from 'react';
import {
    Button,
    Menu,
} from 'semantic-ui-react';

import { Link } from '../../../../routes';

const OnBoardingHeader = () => (
    <Menu.Menu position="right">
        <Menu.Item>
            Already have an account?
        </Menu.Item>
        <Menu.Item>
            <Link route="/users/login">
                <Button basic className="outline-btn">Sign in</Button>
            </Link>
        </Menu.Item>
    </Menu.Menu>
);

export default OnBoardingHeader;
