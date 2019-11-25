import React from 'react';
import { connect } from 'react-redux';
import {
    number,
    string,
    bool,
} from 'prop-types';
import {
    Container,
    Header,
    Progress,
    Grid,
} from 'semantic-ui-react';

import {
    formatCurrency,
} from '../../helpers/give/utils';
import {
    distanceOfTimeInWords,
} from '../../helpers/utils';
import ActiveMatchBlock from '../shared/ActiveMatchBlock';

import CampaignSupports from './CampaignSupports';

const DonationDetails = (props) => {
    const {
        currency,
        language,
        groupDetails: {
            attributes: {
                campaignId,
                totalMoneyRaised,
                goal,
                fundraisingPercentage,
                totalMoneyGiven,
                balance,
                fundraisingDaysRemaining,
                lastDonationAt,
            },
        },
    } = props;
    let lastDonationDay = '';
    if (lastDonationAt !== null) {
        lastDonationDay = distanceOfTimeInWords(lastDonationAt);
    }
    let fundRaisingDuration = '';
    const daysText = (fundraisingDaysRemaining && fundraisingDaysRemaining === 1) ? ' day left' : ' days left';
    if (fundraisingDaysRemaining !== null) {
        fundRaisingDuration = (
            <span className="badge white right">
                {fundraisingDaysRemaining}
                {daysText}
            </span>
        );
    }
    return (
        <Container>
            <div className="profile-info-card giving">
                <Grid stackable>
                    <Grid.Row verticalAlign="middle">
                        <Grid.Column mobile={16} tablet={11} computer={11}>
                            <Header as="h2" className="font-s-34">
                                {formatCurrency(totalMoneyRaised, language, currency)}
                                {fundRaisingDuration}
                                <Header.Subheader className="small font-s-14" style={{ marginTop: '.7rem' }}>
                                    {`raised of 
                                    ${formatCurrency(goal, language, currency)}
                                    goal`}
                                </Header.Subheader>
                                
                            </Header>
                            <Progress className="mb-0 c-green" percent={fundraisingPercentage} size="tiny" />
                            {lastDonationDay
                            && (
                                <div className="small-font">
                                    {`Last donation
                                    ${lastDonationDay}`}
                                </div>
                            )
                            }
                            <div className="pt-1 campaign-amount">
                                <Grid stackable columns={3}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Header as="h2">
                                                {formatCurrency(totalMoneyGiven, language, currency)}
                                                <Header.Subheader className="small font-s-14">All time total given</Header.Subheader>
                                            </Header>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header as="h2">
                                                {formatCurrency(totalMoneyRaised, language, currency)}
                                                <Header.Subheader className="small font-s-14">All time total raised</Header.Subheader>
                                            </Header>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header as="h2">
                                                {formatCurrency(balance, language, currency)}
                                                <Header.Subheader className="small font-s-14">Current balance</Header.Subheader>
                                            </Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </div>
                        </Grid.Column>
                        {campaignId && <CampaignSupports />}
                    </Grid.Row>
                </Grid>
            </div>
            {
                (props.groupDetails.attributes.hasActiveMatch)
                    ? (
                        <ActiveMatchBlock
                            entityDetails={props.groupDetails}
                        />
                    )
                    : null
            }
        </Container>
    );
};

DonationDetails.defaultProps = {
    currency: 'USD',
    groupDetails: {
        attributes: {
            balance: null,
            fundraisingDaysRemaining: null,
            fundraisingPercentage: null,
            goal: null,
            totalMoneyGiven: null,
            totalMoneyRaised: null,
        },
    },
    language: 'en',
};

DonationDetails.propTypes = {
    currency: string,
    groupDetails: {
        attributes: {
            balance: number,
            fundraisingDaysRemaining: number,
            fundraisingPercentage: number,
            goal: number,
            totalMoneyGiven: number,
            totalMoneyRaised: number,
        },
    },
    language: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        deepLinkUrl: state.profile.deepLinkUrl,
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(DonationDetails);
