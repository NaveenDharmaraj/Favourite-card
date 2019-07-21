import React from 'react';
import {
    boolean,
} from 'prop-types';
import {
    Container,
    Image,
    Menu,
    Segment,
} from 'semantic-ui-react';

import logo from '../../../static/images/CharitableImpact.png';

import '../Header/header.less';
import AuthHeader from './AuthHeader';
import OnBoardingHeader from './OnBoarding';

const renderHeader = (onBording, isAuthenticated) => {
    let headerComponent = null;
    if (onBording) {
        headerComponent = <OnBoardingHeader />;
    } else if (isAuthenticated) {
        headerComponent = <AuthHeader />;
    } else {
        headerComponent = <OnBoardingHeader />;
    }
    return headerComponent;
};

const Header = (props) => {
    const {
        isAuthenticated,
    } = props;
    return (
        <Segment
            textAlign="center"
            vertical
            className="c-login-header"
        >
            <Container>
                <Menu secondary>
                    <Menu.Item>
                        <Image style={{ width: '131px' }} src={logo} />
                    </Menu.Item>
                    {renderHeader(false, isAuthenticated)}
                </Menu>
            </Container>
        </Segment>
    );
};

Header.propTypes = {
    isAuthenticated: boolean,
};

export default Header;
