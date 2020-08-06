import React, { Fragment } from 'react';
import ActiveMatchBlock from '../shared/ActiveMatchBlock';
import MoneyRaised from './MoneyRaised';
import CampaignSupporters from './CampaignSupporters';

const CampaignDetails = (props) => {
    const {
        campaignDetails,
    } = props;
    return (
        <Fragment>
            <MoneyRaised
                moneyDetails={campaignDetails}
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
