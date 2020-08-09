
import React, { Fragment } from 'react';

// TODO place ActiveMatchBlock
// import ActiveMatchBlock from '../shared/ActiveMatchBlock';
import MoneyRaised from './MoneyRaised';
import CampaignSupporters from './CampaignSupporters';

const CampaignDetails = (props) => {
    const {
        peopleInCampaign,
        groupsCount,
        slug,
        amountRaised,
        isAuthenticated
    } = props;
    return (
        <Fragment>
            <MoneyRaised
                amountRaised={amountRaised}
                slug={slug}
                isAuthenticated={isAuthenticated}
            />
            <CampaignSupporters
                peopleInCampaign={peopleInCampaign}
                groupsCount={groupsCount}
                slug={slug}
            />
            {/* TODO place ActiveMatchBlock */}
            {/* {
                (campaignDetails.attributes.hasActiveMatch) ?
                    (
                        <ActiveMatchBlock
                            entityDetails={campaignDetails}
                        />
                    )
                    : null
            } */}
        </Fragment>
    );
};

export default CampaignDetails;
