import React from 'react';

import UserDetails from './UserDetails';
import CharityDetails from './CharityDetails';
import ProfileDetails from './ProfileDetails';
import BreadcrumbDetails from './BreadcrumbDetails';

const CharityProfileWrapper = () => (
    <React.Fragment>
        <div className="top-breadcrumb">
            <BreadcrumbDetails />
        </div>
        <div className="profile-header-image charity" />
        <CharityDetails />
        <UserDetails />
        <ProfileDetails />
    </React.Fragment>
);

export default CharityProfileWrapper;
