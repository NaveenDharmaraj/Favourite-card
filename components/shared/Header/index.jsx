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
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';

import logo from '../../../static/images/CharitableImpact.svg';
import { Link } from '../../../routes';

import AuthHeader from './AuthHeader';
import OnBoardingHeader from './OnBoarding';
import NonAuthHeader from './NonAuthHeader';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const renderHeader = (onBoarding, isAuthenticated, isLogin, showHeader) => {
    let headerComponent = null;
    if (onBoarding) {
        headerComponent = <OnBoardingHeader isLogin={isLogin} />;
    } else if (isAuthenticated && showHeader) {
        headerComponent = <AuthHeader />;
    } else if (!isAuthenticated) {
        headerComponent = <NonAuthHeader />;
    }
    return headerComponent;
};

const renderLogo = (currentAccount) => {
    let logoComponent = null;
    if (!_isEmpty(currentAccount) && currentAccount.accountType !== 'personal') {
        const typeMap = {
            charity: `admin/beneficiaries/${currentAccount.slug}`,
            company: `companies/${currentAccount.slug}`,
        };
        logoComponent = (
            <a href={`${RAILS_APP_URL_ORIGIN}/${typeMap[currentAccount.accountType]}`}>
                <Image src={logo} />
            </a>
        );
    } else {
        logoComponent = (
            <Link className="lnkChange" route={`/dashboard`}>
                <Image src={logo} />
            </Link>
        );
    }
    return logoComponent;
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
        currentAccount,
        isAuthenticated,
        isLogin,
        onBoarding,
        showHeader,
    } = props;
    return (
        <Segment
            textAlign="center"
            vertical
            className={getHeaderClassName(onBoarding, isAuthenticated)}
        >
            <Container>
                <Menu secondary>
                    <Menu.Item className="chimpLogo">
                        {renderLogo(currentAccount)}
                    </Menu.Item>
                    {renderHeader(onBoarding, isAuthenticated, isLogin, showHeader)}
                </Menu>
            </Container>
        </Segment>
    );
};

Header.propTypes = {
    isAuthenticated: boolean,
    onBoarding: boolean,
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
});

export default connect(mapStateToProps)(Header);
