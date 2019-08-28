import React from 'react';
import { connect } from 'react-redux';
import {
    number,
    string,
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

const DonationDetails = (props) => {
    const {
        currency,
        language,
        groupDetails: {
            attributes: {
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
    const lastDonationDay = distanceOfTimeInWords(lastDonationAt);
    return (
        <Container>
            <div className="profile-info-card giving">
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={6} computer={6}>
                            <Header as="h2">
                                {formatCurrency(totalMoneyRaised, language, currency)}
                                {fundraisingDaysRemaining
                                    && (
                                        <span className="badge white right">
                                            {fundraisingDaysRemaining}
                                            days left
                                        </span>
                                    )}
                                <Header.Subheader className="small" style={{ marginTop: '.7rem' }}>
                                    {`raised of 
                                    ${formatCurrency(goal, language, currency)}`}
                                </Header.Subheader>
                                
                            </Header>
                            <Progress className="mb-0 c-green" percent={fundraisingPercentage} size="tiny" />
                            <div className="small-font">
                                {`Last donation 
                                ${lastDonationAt && lastDonationDay}`}
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={10} computer={10}>
                            <Header as="h3">
                                Milestones
                            </Header>
                            <div className="pt-1 campaign-amount">
                                <Grid stackable columns={3}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Header as="h2">
                                                {formatCurrency(totalMoneyRaised, language, currency)}
                                                <Header.Subheader className="small">All time total raised</Header.Subheader>
                                            </Header>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header as="h2">
                                                {formatCurrency(totalMoneyGiven, language, currency)}
                                                <Header.Subheader className="small">All time total given</Header.Subheader>
                                            </Header>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header as="h2">
                                                {formatCurrency(balance, language, currency)}
                                                <Header.Subheader className="small">Current balance</Header.Subheader>
                                            </Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
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
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(DonationDetails);
