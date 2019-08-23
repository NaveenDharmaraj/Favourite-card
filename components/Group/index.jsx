import React from 'react';

import GroupDetails from './GroupDetails';
import DonationDetails from './DonationDetails';
import ProfileDetails from './ProfileDetails';


const GroupProfileWrapper = () => (
    <React.Fragment>
        {/* <div className="top-breadcrumb">
            <Container>
                <Breadcrumb className="c-breadcrumb">
                    <Breadcrumb.Section link>Explore</Breadcrumb.Section>
                    <Breadcrumb.Divider icon="caret right"/>
                    <Breadcrumb.Section link>Giving Groups</Breadcrumb.Section>
                    <Breadcrumb.Divider icon="caret right"/>
                    <Breadcrumb.Section active>YWAM</Breadcrumb.Section>
                </Breadcrumb>
            </Container>
        </div> */}
        <div className="profile-header-image campaign" />
        <GroupDetails />
        <div className="profile-info-wraper pb-3">
            <DonationDetails />
        </div>
        <div className="pb-3">
            <ProfileDetails />
        </div>
    </React.Fragment>
);

export default GroupProfileWrapper;
