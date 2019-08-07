import React, { Fragment } from 'react';
import {
    boolean,
} from 'prop-types';

import AuthHeader from './AuthHeader/MobileHeader';
// import OnBoardingHeader from './OnBoarding';
import NonAuthHeader from './NonAuthHeader/MobileHeader';

const renderHeader = (onBoarding, isAuthenticated, children) => {
    let headerComponent = null;
    if (onBoarding) {
        headerComponent = (
            <NonAuthHeader>
                { children }
            </NonAuthHeader>
        );
    } else if (isAuthenticated) {
        headerComponent = (
            <AuthHeader>
                { children }
            </AuthHeader>
        );
    } else {
        headerComponent = (
            <NonAuthHeader>
                { children }
            </NonAuthHeader>
        );
    }
    return headerComponent;
};

const MobileHeader = (props) => {
    const {
        children,
        isAuthenticated,
        onBoarding,
    } = props;
    return (
        <Fragment>
            {renderHeader(onBoarding, isAuthenticated, children)}
        </Fragment>
    );
};

MobileHeader.propTypes = {
    isAuthenticated: boolean,
    onBoarding: boolean,
};

export default MobileHeader;
