import React from 'react';
import {
    Button,
    Menu,
} from 'semantic-ui-react';

import { Link } from '../../../../routes';
import storage from '../../../../helpers/storage';
import { invitationParameters } from '../../../../services/auth';

const OnBoardingHeader = ({ isLogin }) => {
    let claimCharityAccessCode;
    let signUpUrl = '/users/new';
    if (typeof Storage !== 'undefined') {
        claimCharityAccessCode = storage.getLocalStorageWithExpiry('claimToken', 'local');
        if (claimCharityAccessCode) {
            signUpUrl = `/users/new?isClaimCharity=${true}`;
        }
    }
    const reqPar = invitationParameters.reqParameters;
    if (reqPar && reqPar.invitationType && reqPar.sourceId) {
        signUpUrl = `/users/new?invitationType=${reqPar.invitationType}&sourceId=${reqPar.sourceId}`;
    }
    const header = (isLogin) ? (
        <Menu.Menu position="right">
            <Menu.Item>
                Don't have an account?
            </Menu.Item>
            <Menu.Item>
                <Link route={signUpUrl}>
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
