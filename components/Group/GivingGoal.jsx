import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Header,
    Progress,
    Button,
    Divider,
    Responsive,
} from 'semantic-ui-react';
import {
    number,
    string,
    bool,
    func,
} from 'prop-types';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../i18n';
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
        t: formatMessage,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const hasGoal = (fundraisingDaysRemaining > 0);
    const hasPreviousGoal = ((fundraisingDaysRemaining === 0) && !_isEmpty(goal));
    const formattedtotalMoneyRaised = formatCurrency(totalMoneyRaised, language, currency);
    const formattedgoalAmountRaised = formatCurrency(goalAmountRaised, language, currency);
    const formattedgoal = (hasGoal || hasPreviousGoal) ? formatCurrency(goal, language, currency) : '';
    const daysText = (fundraisingDaysRemaining === 1) ? formatMessage('groupProfile:dayLeft') : formatMessage('groupProfile:daysLeft');
    let fundRaisingDuration = '';
    let lastDonationDay = '';
    let giveButton = null;
    let giftText = '';
    let goalText = '';
    let canSetGoal = false;
    const giveButtonElement = (
        <Button className="blue-btn-rounded-def mt-1">
            {formatMessage('common:giveButtonText')}
        </Button>
    );
    if (lastDonationAt) {
        lastDonationDay = distanceOfTimeInWords(lastDonationAt);
        giftText = `${formatMessage('groupProfile:lastGiftReceived')} ${lastDonationDay}`;
    }
    if (hasGoal) {
        if (goalAmountRaised >= goal) {
            goalText = formatMessage('groupProfile:reachedGoalText');
            canSetGoal = isAdmin;
        } else {
            goalText = `${fundraisingDaysRemaining}${daysText} ${formatMessage('groupProfile:toReachGoalText')}`;
        }
    } else if (hasPreviousGoal) {
        goalText = `${formatMessage('groupProfile:goalExpiredOnText')} ${formatDateForGivingTools(fundraisingEndDate)}`;
    }
    fundRaisingDuration = (
        <span className="badge white goalbtn">
            {goalText}
            {canSetGoal
            && (
                <div>
                    <a href={(`${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit?accrodian=charity_and_goal`)}>
                        {formatMessage('groupProfile:saveNewGoalText')}
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
                            <Header as="h4">{formatMessage('groupProfile:totalRaised')}</Header>
                            <Header as="h1">{formattedtotalMoneyRaised}</Header>
                            {(balance && parseInt(balance, 10) > 0)
                            && (
                                <div className="lastGiftWapper">
                                    <p className="lastGiftText">{giftText}</p>
                                </div>
                            )}
                            <Divider />
                            <Responsive minWidth={768}>
                                {giveButton}
                            </Responsive>
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            <Header as="h4">{formatMessage('groupProfile:raisedGoalText')}</Header>
                            <Header as="h1">{formattedgoalAmountRaised}</Header>
                            <p>
                                {formatMessage('groupProfile:ofGoalAmount',
                                    {
                                        formattedgoal,
                                    })
                                }
                            </p>
                            <div className="goalPercent">
                                <Progress percent={fundraisingPercentage} />
                            </div>
                            {fundRaisingDuration}
                            <div className="lastGiftWapper">
                                <p className="lastGiftText">{giftText}</p>
                            </div>
                            <Divider />
                            <Responsive minWidth={768}>
                                {giveButton}
                            </Responsive>
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
            fundraisingEndDate: '',
            fundraisingPercentage: null,
            goal: '',
            goalAmountRaised: '',
            isAdmin: false,
            lastDonationAt: '',
            slug: '',
            totalMoneyRaised: '',
        },
    },
    isAuthenticated: false,
    t: () => {},
};

GivingGoal.propTypes = {
    groupDetails: {
        attributes: {
            balance: number,
            fundraisingDaysRemaining: number,
            fundraisingEndDate: string,
            fundraisingPercentage: number,
            goal: string,
            goalAmountRaised: string,
            isAdmin: bool,
            lastDonationAt: string,
            slug: string,
            totalMoneyRaised: string,
        },
    },
    isAuthenticated: bool,
    t: func,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

const connectedComponent = withTranslation([
    'common',
    'groupProfile',
])(connect(mapStateToProps)(GivingGoal));
export {
    connectedComponent as default,
    GivingGoal,
    mapStateToProps,
};
