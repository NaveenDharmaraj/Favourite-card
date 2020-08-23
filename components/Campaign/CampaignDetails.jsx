
import React, { Fragment } from 'react';
// TODO uncomment after groups updation
// import ActiveMatchBlock from '../shared/ActiveMatchBlock';

import MoneyRaised from './MoneyRaised';
import CampaignSupporters from './CampaignSupporters';

const CampaignDetails = (props) => {
    const {
        activeMatch,
        hasActiveMatch,
        peopleInCampaign,
        groupsCount,
        slug,
        amountRaised,
        isAuthenticated,
        type,
    } = props;
    return (
        <Fragment>
            <MoneyRaised
                amountRaised={amountRaised}
                slug={slug}
                isAuthenticated={isAuthenticated}
            />
            {/* <ActiveMatchBlock
                activeMatch={activeMatch}
                type={type}
                hasActiveMatch={hasActiveMatch}
            /> */}
            <CampaignSupporters
                peopleInCampaign={peopleInCampaign}
                groupsCount={groupsCount}
                slug={slug}
            />
        </Fragment>
    );
};

export default CampaignDetails;
