import React from 'react';
import {
    Button,
    Menu,
} from 'semantic-ui-react';

const OnBoardingHeader = () => (
    <Menu.Menu position="right">
        <Menu.Item>
            Already have an account?
        </Menu.Item>
        <Menu.Item>
            <Button basic className="outline-btn">Sign in</Button>
        </Menu.Item>
    </Menu.Menu>
);

export default OnBoardingHeader;
