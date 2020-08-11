
import React, { Fragment } from 'react';

// TODO place ActiveMatchBlock
import ActiveMatchBlock from '../shared/ActiveMatchBlock';
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
            {
                (hasActiveMatch) ?
                    (
                        <ActiveMatchBlock
                            activeMatch={activeMatch}
                            type={type}
                        />
                    )
                    : null
            }
            <CampaignSupporters
                peopleInCampaign={peopleInCampaign}
                groupsCount={groupsCount}
                slug={slug}
            />
        </Fragment>
    );
};

export default CampaignDetails;
