import React, { Fragment } from 'react';
import {
    boolean,
} from 'prop-types';

import {
    Container,
    Image,
    Menu,
    Segment,
} from 'semantic-ui-react';

import logo from '../../../static/images/CharitableImpact.svg';

import AuthHeader from './AuthHeader/MobileHeader';
// import OnBoardingHeader from './OnBoarding';
import NonAuthHeader from './NonAuthHeader/MobileHeader';

const renderHeader = (onBoarding, isAuthenticated, children, showHeader, isClaimCharity) => {
    let headerComponent = null;
    if (onBoarding) {
        headerComponent = (
            <NonAuthHeader isClaimCharity={isClaimCharity}>
                { children }
            </NonAuthHeader>
        );
    } else if (isAuthenticated && showHeader) {
        headerComponent = (
            <AuthHeader>
                { children }
            </AuthHeader>
        );
    } else if (!isAuthenticated) {
        headerComponent = (
            <NonAuthHeader>
                { children }
            </NonAuthHeader>
        );
    } else if (!showHeader) {
        headerComponent = (
            <Fragment>
                <div className="staticNav">
                    <Segment
                        textAlign="center"
                        vertical
                    >
                        <Container>
                            <Menu secondary>
                                <Menu.Item className="chimpLogo">
                                    <Image src={logo} />
                                </Menu.Item>
                            </Menu>
                        </Container>
                    </Segment>
                </div>
                { children }
            </Fragment>
        );
    }
    return headerComponent;
};

const MobileHeader = (props) => {
    const {
        children,
        isAuthenticated,
        onBoarding,
        showHeader,
        isClaimCharity,
    } = props;
    return (
        <Fragment>
            {renderHeader(onBoarding, isAuthenticated, children, showHeader, isClaimCharity)}
        </Fragment>
    );
};

MobileHeader.propTypes = {
    isAuthenticated: boolean,
    onBoarding: boolean,
};

export default MobileHeader;
