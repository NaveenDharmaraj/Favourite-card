
import React, { Fragment } from 'react';
import _isEmpty from 'lodash/isEmpty';

import ActiveMatchBlock from '../shared/ActiveMatchBlock';
import ExpiredMatchBlock from '../../components/Group/ExpiredMatchBlock';

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
        matchHistory,
    } = props;
    const hasMatchingHistory = !_isEmpty(matchHistory);
    return (
        <Fragment>
            <MoneyRaised
                amountRaised={amountRaised}
                slug={slug}
                isAuthenticated={isAuthenticated}
            />
            {hasActiveMatch
                && (
                    <ActiveMatchBlock
                        activeMatch={activeMatch}
                        type={type}
                        hasActiveMatch={hasActiveMatch}
                        hasMatchingHistory={hasMatchingHistory}
                    />
                )}
            {(!hasActiveMatch && hasMatchingHistory)
                && (
                    <ExpiredMatchBlock
                        matchHistory={matchHistory[0]}
                    />
                )}
            <CampaignSupporters
                peopleInCampaign={peopleInCampaign}
                groupsCount={groupsCount}
                slug={slug}
            />
        </Fragment>
    );
};

export default CampaignDetails;
