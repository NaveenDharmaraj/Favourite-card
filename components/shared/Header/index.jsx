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

import AuthHeader from './AuthHeader';
import OnBoardingHeader from './OnBoarding';
import NonAuthHeader from './NonAuthHeader';

const renderHeader = (onBoarding, isAuthenticated) => {
    let headerComponent = null;
    if (onBoarding) {
        headerComponent = <OnBoardingHeader />;
    } else if (isAuthenticated) {
        headerComponent = <AuthHeader />;
    } else {
        headerComponent = <NonAuthHeader />;
    }
    return headerComponent;
};

const getHeaderClassName = (onBoarding, isAuthenticated) => {
    let className = 'c-default-header';
    if (onBoarding) {
        className = 'c-logout-header';
    } else if (isAuthenticated) {
        className = 'c-login-header';
    }
    return className;
};

const Header = (props) => {
    const {
        isAuthenticated,
        onBoarding,
    } = props;
    return (
        <Segment
            textAlign="center"
            vertical
            className={getHeaderClassName(onBoarding, isAuthenticated)}
        >
            <Container>
                <Menu secondary>
                    <Menu.Item as="a" href="/dashboard">
                        <Image style={{ width: '131px' }} src={logo} />
                    </Menu.Item>
                    {renderHeader(onBoarding, isAuthenticated)}
                </Menu>
            </Container>
        </Segment>
    );
};

Header.propTypes = {
    isAuthenticated: boolean,
    onBoarding: boolean,
};

export default Header;
