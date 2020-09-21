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
    List,
} from 'semantic-ui-react';
import {
    number,
    string,
    bool,
    func,
    PropTypes,
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
                createdAt,
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
    const formattedCreated = formatDateForGivingTools(createdAt);
    const giveButtonElement = (
        <Button className="blue-btn-rounded-def">
            {formatMessage('common:giveButtonText')}
        </Button>
    );
    if (lastDonationAt) {
        lastDonationDay = distanceOfTimeInWords(lastDonationAt);
        giftText = `${formatMessage('groupProfile:lastGiftReceived')} ${lastDonationDay}`;
    }
    if (hasGoal) {
        if (parseInt(goalAmountRaised, 10) >= parseInt(goal, 10)) {
            goalText = formatMessage('groupProfile:reachedGoalText');
            canSetGoal = isAdmin;
        } else {
            goalText = `${fundraisingDaysRemaining}${daysText} ${formatMessage('groupProfile:toReachGoalText')}`;
        }
    } else if (hasPreviousGoal) {
        if (!_isEmpty(fundraisingEndDate)) {
            goalText = `${formatMessage('groupProfile:goalExpiredOnText')} ${formatDateForGivingTools(fundraisingEndDate)}`;
        } else if (parseInt(goalAmountRaised, 10) >= parseInt(goal, 10)) {
            goalText = formatMessage('groupProfile:reachedGoalText');
            canSetGoal = isAdmin;
        }
    }
    fundRaisingDuration = (
        <span className="badge white goalbtn topgoalbtn">
            {goalText}
            {canSetGoal
            && (
                <div>
                    <a href={(`${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit?accordion=goals-settings`)}>
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
                            <div className="groupcreated">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <i aria-hidden="true" className="calendar icon" />
                                        <List.Content>
                                            <List.Header>
                                                {`${formatMessage('groupProfile:groupCreated')} ${formattedCreated}.`}
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </div>
                            <Divider />
                            <Header className="totalMoneyRaised" as="h4">{formatMessage('groupProfile:totalMoneyRaised')}</Header>
                            <Header as="h1">{formattedtotalMoneyRaised}</Header>
                            {!_isEmpty(lastDonationAt)
                            && (
                                <div className="lastGiftWapper">
                                    <p className="lastGiftText lastGiftText_left">{giftText}</p>
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
                            {!_isEmpty(goalText) && fundRaisingDuration}
                            {!_isEmpty(lastDonationAt)
                            && (
                                <div className="lastGiftWapper">
                                    <p className="lastGiftText">{giftText}</p>
                                </div>
                            )}
                            <Responsive minWidth={768}>
                                <Divider />
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
            createdAt: '',
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
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            createdAt: string,
            fundraisingDaysRemaining: number,
            fundraisingEndDate: string,
            fundraisingPercentage: number,
            goal: string,
            goalAmountRaised: string,
            isAdmin: bool,
            lastDonationAt: string,
            slug: string,
            totalMoneyRaised: string,
        }),
    }),
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
