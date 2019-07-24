import React from 'react';

import {
    Button,
    Header,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

import FormValidationErrorMessage from '../../../components/shared/FormValidationErrorMessage';

function CausesComponent(props) {
    let {
        handleSubmit,
        parentHandleCauses,
        userCauses,
        validity,
    } = props;
    return (
        <Grid.Column mobile={16} tablet={14} computer={14} largeScreen={12}>
            <div className="prefered-wraper">
                <div className="prefered-img" />
                <div className="reg-header">
                    <Header as="h3">What causes are important to you? </Header>
                    <Header as="h4">Your answers help us personalize your experience. </Header>
                </div>
                <p>Choose 3 or more</p>
                <Grid className="select-btn-wraper">
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'arts_and_culture') ? 'active' : ''}`}
                                id="arts_and_culture"
                                name="arts_and_culture"
                                onClick={parentHandleCauses}
                            >
                                Arts and culture
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'health') ? 'active' : ''}`}
                                id="health"
                                name="health"
                                onClick={parentHandleCauses}
                            >
                                Health
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'education_and_research') ? 'active' : ''}`}
                                id="education_and_research"
                                name="education_and_research"
                                onClick={parentHandleCauses}
                            >
                                Education and research
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'religion_and_spirituality') ? 'active' : ''}`}
                                id="religion_and_spirituality"
                                name="religion_and_spirituality"
                                onClick={parentHandleCauses}
                            >
                                Religion and spirituality
                            </Button>
                        </Grid.Column>

                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'human_rights') ? 'active':''}`}
                                id="human_rights"
                                name="human_rights"
                                onClick={parentHandleCauses}
                            >
                                Human rights
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'international') ? 'active' : ''}`}
                                id="international"
                                name="international"
                                onClick={parentHandleCauses}
                            >
                                International
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'environment') ? 'active' : ''}`}
                                id="environment"
                                name="environment"
                                onClick={parentHandleCauses}
                            >
                                Environment
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'sports_and_recreation') ? 'active' : ''}`}
                                id="sports_and_recreation"
                                name="sports_and_recreation"
                                onClick={parentHandleCauses}
                            >
                                Sports and recreation
                            </Button>
                        </Grid.Column>

                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'outreach_and_welfare') ? 'active' : ''}`}
                                id="outreach_and_welfare"
                                name="outreach_and_welfare"
                                onClick={parentHandleCauses}
                            >
                                Outreach and welfare
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'animals') ? 'active' : ''}`}
                                onClick={parentHandleCauses}
                                id="animals"
                                name="animals"
                            >
                                Animals
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'community_development') ? 'active' : ''}`}
                                id="community_development"
                                name="community_development"
                                onClick={parentHandleCauses}
                            >
                                Community development
                            </Button>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Button
                                basic
                                fluid
                                className={`select-btn ${_.includes(userCauses, 'youth_or_children') ? 'active' : ''}`}
                                id="youth_or_children"
                                name="youth_or_children"
                                onClick={parentHandleCauses}
                            >
                                Youth/children
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <FormValidationErrorMessage
                    condition={!validity.isValidCauses}
                    errorMessage="Please select 3 or more causes"
                />
                <div className="reg-btn-wraper">
                    <Button
                        type="submit"
                        active={(_.every(validity))}
                        primary
                        onClick={handleSubmit}
                    >
                        Continue
                    </Button>
                </div>
            </div>
            
        </Grid.Column>
    );
}

export default CausesComponent;
