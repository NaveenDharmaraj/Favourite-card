
import React, { Fragment } from 'react';
import _isEmpty from 'lodash/isEmpty';

import ActiveMatchBlock from '../shared/ActiveMatchBlock';
import ExpiredMatchBlock from '../shared/ExpiredMatchBlock';
import {
    PropTypes,
} from 'prop-types';

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
                        type={type}
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

CampaignDetails.defaultProps = {
    activeMatch: false,
    hasActiveMatch: false,
    peopleInCampaign: '',
    groupsCount: '',
    slug: '',
    amountRaised: '',
    isAuthenticated: false,
    type: '',
    matchHistory: [],
}

// eslint-disable-next-line react/no-typos
CampaignDetails.PropTypes = {
    activeMatch: PropTypes.bool,
    hasActiveMatch: PropTypes.bool,
    peopleInCampaign: PropTypes.string,
    groupsCount: PropTypes.string,
    slug: PropTypes.string,
    amountRaised: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    type: PropTypes.string,
    matchHistory: PropTypes.array,
}

export default CampaignDetails;
