import React from 'react';
import {
    Button,
    Menu,
} from 'semantic-ui-react';
import { Link } from '../../../../routes';
import storage from '../../../../helpers/storage';

const OnBoardingHeader = ({ isLogin }) => {
    let claimCharityAccessCode;
    if (typeof Storage !== 'undefined') {
        claimCharityAccessCode = storage.getLocalStorageWithExpiry('claimToken', 'local');
    };
    const header = (isLogin) ? (
        <Menu.Menu position="right">
            <Menu.Item>
                Don't have an account?
            </Menu.Item>
            <Menu.Item>
                <Link route={claimCharityAccessCode ? `/users/new?isClaimCharity=${true}` : '/users/new'}>
                    <Button basic className="outline-btn">Sign up</Button>
                </Link>
            </Menu.Item>
        </Menu.Menu>
    ) : (
            <Menu.Menu position="right">
                <Menu.Item>
                    Already have an account?
            </Menu.Item>
                <Menu.Item>
                    <Link route="/users/login">
                        <Button basic className="outline-btn">Log in</Button>
                    </Link>
                </Menu.Item>
            </Menu.Menu>
        );
    return header;
};

export default OnBoardingHeader;
