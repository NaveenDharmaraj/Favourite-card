import React from 'react';
import {
    Button,
    Menu,
} from 'semantic-ui-react';
import { Link } from '../../../../routes';

const OnBoardingHeader = ( { isLogin, isClaimCharity  }) => {

    const header = (isLogin) ? (
        <Menu.Menu position="right">
            <Menu.Item>
                Don't have an account?
            </Menu.Item>
            <Menu.Item>
                <Link route={isClaimCharity && isClaimCharity === true ? `/users/new?isClaimCharity=${isClaimCharity}` : '/users/new'}>
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
