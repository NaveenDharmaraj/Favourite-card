import React from 'react';
import {
    Container,
    Header,
    Progress,
    Grid,
    Card,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const GivingGoal = (props) => {
    const {
        givingAmount,
        givenAmount,
        percentage,
    } = props;
    return (
        <div className="pb-3">
            <Container>
                <Header as="h4" className="underline">
                    Giving Goal
                </Header>
                <Grid stackable columns={3}>
                    <Grid.Row>
                        <Grid.Column>
                            <Card fluid className="user-Ggroup-card">
                                <Card.Content>
                                    <Header as="h2">
                                        ${givenAmount}
                                        <Header.Subheader
                                            className="small"
                                            style={{marginTop:'.7rem'}}
                                        >
                                        given of ${givingAmount} goal
                                        </Header.Subheader>
                                    </Header>
                                    <Progress className="mb-0 c-yello" percent={percentage} size="tiny" />
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    );
}


GivingGoal.propTypes = {
    givenAmount: PropTypes.number,
    givingAmount: PropTypes.number,
    percentage: PropTypes.number,
};

GivingGoal.defaultProps = {
    givenAmount: 0,
    givingAmount: 0,
    percentage: 0,
};


export default GivingGoal;
