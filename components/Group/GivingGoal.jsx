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
import { resetFlowObject } from '../../actions/give';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const GivingGoal = (props) => {
    const {
        currentUser: {
            attributes: {
                hasAdminAccess,
            },
        },
        dispatch,
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
                isMember,
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
    let lastDonationDate = '';
    let giveButton = null;
    let giftText = '';
    let goalText = '';
    let canSetGoal = false;
    const formattedCreated = formatDateForGivingTools(createdAt);
    const giveButtonElement = (
        <Button onClick={() => { resetFlowObject('group', dispatch); }} className="blue-btn-rounded-def">
            {formatMessage('common:giveButtonText')}
        </Button>
    );
    if (lastDonationAt) {
        lastDonationDate = formatDateForGivingTools(lastDonationAt);
        giftText = `${formatMessage('groupProfile:lastGiftReceived')} ${lastDonationDate}`;
    }
    if (hasGoal) {
        if (parseInt(goalAmountRaised, 10) >= parseInt(goal, 10)) {
            goalText = formatMessage('groupProfile:reachedGoalText');
            canSetGoal = isAdmin;
        } else {
            goalText = `${fundraisingDaysRemaining}${daysText} ${formatMessage('groupProfile:toReachGoalText')}`;
        }
    } else if (hasPreviousGoal) {
        if (!_isEmpty(fundraisingEndDate) && (parseInt(goalAmountRaised, 10) < parseInt(goal, 10))) {
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
                        <Link route={`/groups/${slug}/edit/givinggoals`}>
                            {formatMessage('groupProfile:saveNewGoalText')}
                        </Link>
                    </div>
                )}
        </span>
    );

    if (isAuthenticated) {
        if (isMember || hasAdminAccess) {
            giveButton = (
                <Fragment>
                    <Divider />
                    <div className="buttonWraper">
                        <Link route={`/give/to/group/${slug}/new`}>
                            {giveButtonElement}
                        </Link>
                    </div>
                </Fragment>

            );
        }
    } else {
        giveButton = (
            <Fragment>
                <Divider />
                <div className="buttonWraper">
                    <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                        {giveButtonElement}
                    </a>
                </div>
            </Fragment>
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
                                                {`${formatMessage('groupProfile:groupCreated')} ${formattedCreated}`}
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
                                {giveButton}
                            </Responsive>
                        </Fragment>
                    )}
            </div>
        </div>
    );
};

GivingGoal.defaultProps = {
    currentUser: {
        attributes: {
            hasAdminAccess: false,
        },
    },
    dispatch: () => { },
    groupDetails: {
        attributes: {
            createdAt: '',
            fundraisingDaysRemaining: null,
            fundraisingEndDate: '',
            fundraisingPercentage: null,
            goal: '',
            goalAmountRaised: '',
            isAdmin: false,
            isMember: false,
            lastDonationAt: '',
            slug: '',
            totalMoneyRaised: '',
        },
    },
    isAuthenticated: false,
    t: () => { },
};

GivingGoal.propTypes = {
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            hasAdminAccess: bool,
        }),
    }),
    dispatch: PropTypes.func,
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            createdAt: string,
            fundraisingDaysRemaining: number,
            fundraisingEndDate: string,
            fundraisingPercentage: number,
            goal: string,
            goalAmountRaised: string,
            isAdmin: bool,
            isMember: bool,
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
        currentUser: state.user.info,
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
