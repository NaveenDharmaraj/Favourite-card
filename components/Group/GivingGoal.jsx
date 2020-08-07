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

import {
    Link,
} from '../../routes';
import {
    formatCurrency,
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
                goalAmountRaised,
                goal,
                fundraisingPercentage,
                isMember,
                isAdmin,
                slug,
                totalMoneyRaised,
            },
        },
        isAuthenticated,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const hasGoal = !(fundraisingDaysRemaining === 0);
    const formattedMoneyRaised = (balance) ? formatCurrency(totalMoneyRaised, language, currency) : '';
    const formattedgoalAmountRaised = (hasGoal) ? formatCurrency(goalAmountRaised, language, currency) : '';
    const formattedgoal = (hasGoal) ? formatCurrency(goal, language, currency) : '';
    const daysText = (hasGoal && fundraisingDaysRemaining === 1) ? ' day left' : ' days left';
    let fundRaisingDuration = '';
    let lastDonationDay = '';
    let giveButton = null;
    if (lastDonationAt !== null) {
        lastDonationDay = distanceOfTimeInWords(lastDonationAt);
    }
    const giftText = `Last gift received ${lastDonationDay}`;
    if (fundraisingDaysRemaining !== null) {
        fundRaisingDuration = (
            <span className="badge white goalbtn">
                {`${fundraisingDaysRemaining}${daysText} to reach goal`}
            </span>
        );
    }
    if (isAuthenticated) {
        giveButton = (
            (isMember || isAdmin)
            && (
                <div className="buttonWraper">
                    <Link route={`/give/to/group/${slug}/new`}>
                        <Button className="blue-btn-rounded-def mt-1">Give</Button>
                    </Link>
                </div>
            )

        );
    } else {
        giveButton = (
            <div className="buttonWraper">
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                    <Button primary className="blue-btn-rounded">Give</Button>
                </a>
            </div>
        );
    }
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                {!hasGoal
                    ? (
                        <div className="charityInfowrap fullwidth">
                            <div className="charityInfo">
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
                            </div>
                        </div>
                    )
                    : (
                        <Fragment>
                            <Header as="h4">Raised on current giving goal</Header>
                            <Header as="h1">{formattedgoalAmountRaised}</Header>
                            <p>{`raised of ${formattedgoal} goal`}</p>
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
