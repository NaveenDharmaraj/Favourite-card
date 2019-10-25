import React from 'react';

import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
    Header,
    Message,
    Container,
    Button,
} from 'semantic-ui-react';

import { formatCurrency } from '../../helpers/give/utils';
import ShareDetails from '../shared/ShareSectionProfilePage';
import ActiveMatchBlock from '../shared/ActiveMatchBlock';

const detailsView = (valuesObject) => {

    const currency = 'USD';
    const language = 'en';
    const formattedAmount = formatCurrency(valuesObject.amountRaised, language, currency);
    return (
        <div className="pt-2 campaign-amount">
            <Grid stackable columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        <Header as='h2'>
                            {formattedAmount.slice(0, -3)}
                            <Header.Subheader className="small">All time total raised</Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h2'>
                            {valuesObject.peopleInCampaign}
                            <Header.Subheader className="small">Campaign participants</Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h2'>
                            {valuesObject.groupsCount}
                            <Header.Subheader className="small">Groups supporting this campaign</Header.Subheader>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

const CampaignDetails = (props) => {
    const {
        campaignDetails,
        deepLinkUrl,
        dispatch,
        isAuthenticated,
        userId,
    } = props;
    return (
        <div className="profile-info-wraper pb-3">
            <Container>
                <div className="profile-info-card campaign">
                    <Header as="h3">
                        Campaign information
                    </Header>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                {((!_isEmpty(campaignDetails.attributes))
                                && detailsView(campaignDetails.attributes))}
                            </Grid.Column>
                            {(isAuthenticated
                            && (
                                <ShareDetails
                                    profileDetails={campaignDetails}
                                    deepLinkUrl={deepLinkUrl}
                                    dispatch={dispatch}
                                    userId={userId}
                                />
                            )
                            )
                            }

                        </Grid.Row>
                    </Grid>
                </div>
                {
                    (campaignDetails.attributes.hasActiveMatch) ? 
                        (
                            <ActiveMatchBlock
                                entityDetails={campaignDetails}
                            />
                        )
                        : null
                }
            </Container>
        </div>
    );
};

export default CampaignDetails;
