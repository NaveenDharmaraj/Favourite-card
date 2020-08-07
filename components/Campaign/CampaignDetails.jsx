
import React, { Fragment } from 'react';

// TODO place ActiveMatchBlock
// import ActiveMatchBlock from '../shared/ActiveMatchBlock';
import MoneyRaised from './MoneyRaised';
import CampaignSupporters from './CampaignSupporters';

const CampaignDetails = (props) => {
    const {
        campaignDetails,
        isAuthenticated
    } = props;
    return (
        <Fragment>
            <MoneyRaised
                moneyDetails={campaignDetails}
                isAuthenticated={isAuthenticated}
            />
            <CampaignSupporters
                supportingDetails={campaignDetails}
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
