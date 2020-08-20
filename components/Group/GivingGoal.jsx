import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Header,
    Progress,
    Button,
    Divider,
} from 'semantic-ui-react';
import {
    number,
    string,
    bool,
} from 'prop-types';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';

import {
    Link,
} from '../../routes';
import {
    formatCurrency,
    formatDateForGivingTools,
} from '../../helpers/give/utils';
import {
    distanceOfTimeInWords,
} from '../../helpers/utils';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const GivingGoal = (props) => {
    const {
        groupDetails: {
            attributes: {
                balance,
                lastDonationAt,
                fundraisingDaysRemaining,
                fundraisingEndDate,
                goalAmountRaised,
                goal,
                fundraisingPercentage,
                isAdmin,
                slug,
                totalMoneyRaised,
            },
        },
        isAuthenticated,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const hasGoal = (fundraisingDaysRemaining > 0);
    const hasPreviousGoal = ((fundraisingDaysRemaining === 0) && !_isEmpty(goal));
    const formattedMoneyRaised = formatCurrency(totalMoneyRaised, language, currency);
    const formattedgoalAmountRaised = formatCurrency(goalAmountRaised, language, currency);
    const formattedgoal = (hasGoal || hasPreviousGoal) ? formatCurrency(goal, language, currency) : '';
    const daysText = (fundraisingDaysRemaining === 1) ? ' day left' : ' days left';
    let fundRaisingDuration = '';
    let lastDonationDay = '';
    let giveButton = null;
    let giftText = '';
    let goalText = '';
    let canSetGoal = false;
    const giveButtonElement = <Button className="blue-btn-rounded-def mt-1">Give</Button>;
    if (lastDonationAt) {
        lastDonationDay = distanceOfTimeInWords(lastDonationAt);
        giftText = `Last gift received ${lastDonationDay}`;
    }
    if (hasGoal) {
        if (goalAmountRaised >= goal) {
            goalText = 'The group has reached the goal!';
            canSetGoal = isAdmin;
        } else {
            goalText = `${fundraisingDaysRemaining}${daysText} to reach goal`;
        }
    } else if (hasPreviousGoal) {
        goalText = `Giving goal expired on ${formatDateForGivingTools(fundraisingEndDate)}`;
    }
    fundRaisingDuration = (
        <span className="badge white goalbtn">
            {goalText}
            {canSetGoal
            && (
                <div>
                    <a href={(`${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`)}>
                    Save new Giving Goal
                    </a>
                </div>
            )}
        </span>
    );

    if (isAuthenticated) {
        giveButton = (
            <div className="buttonWraper">
                <Link route={`/give/to/group/${slug}/new`}>
                    {giveButtonElement}
                </Link>
            </div>
        );
    } else {
        giveButton = (
            <div className="buttonWraper">
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                    {giveButtonElement}
                </a>
            </div>
        );
    }
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                {(!hasGoal && !hasPreviousGoal)
                    ? (
                        <Fragment>
                            <Header as="h4">Total raised</Header>
                            <Header as="h1">{formattedMoneyRaised}</Header>
                            {(balance && parseInt(balance, 10) > 0)
                            && (
                                <div className="lastGiftWapper">
                                    <p className="lastGiftText">{giftText}</p>
                                </div>
                            )}
                            <Divider />
                            {giveButton}
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            <Header as="h4">Raised on current giving goal</Header>
                            <Header as="h1">{formattedgoalAmountRaised}</Header>
                            <p>{`of ${formattedgoal} goal`}</p>
                            <div className="goalPercent">
                                <Progress percent={fundraisingPercentage} />
                            </div>
                            {fundRaisingDuration}
                            <div className="lastGiftWapper">
                                <p className="lastGiftText">{giftText}</p>
                            </div>
                            <Divider />
                            {giveButton}
                        </Fragment>
                    )}
            </div>
        </div>
    );
};

GivingGoal.defaultProps = {
    groupDetails: {
        attributes: {
            balance: null,
            fundraisingDaysRemaining: null,
            fundraisingPercentage: null,
            goal: '',
            goalAmountRaised: '',
            lastDonationAt: '',
        },
    },
    isAuthenticated: false,
};

GivingGoal.propTypes = {
    groupDetails: {
        attributes: {
            balance: number,
            fundraisingDaysRemaining: number,
            fundraisingPercentage: number,
            goal: string,
            goalAmountRaised: string,
            lastDonationAt: string,
        },
    },
    isAuthenticated: bool,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GivingGoal);
