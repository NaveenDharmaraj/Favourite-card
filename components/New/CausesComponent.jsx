/* eslint-disable react/prop-types */
/* eslint-disable operator-assignment */
import React from 'react';

import {
    Button,
    Header,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';

import CauseComponent from './CauseComponent';

function CausesComponent(props) {
    const {
        handleSubmit,
        parentHandleCauses,
        userCauses,
        validity,
    } = props;
    const causesArray = [
        'arts_and_culture',
        'health',
        'education_and_research',
        'religion_and_spirituality',
        'human_rights',
        'international',
        'environment',
        'sports_and_recreation',
        'outreach_and_welfare',
        'animals',
        'community_development',
        'youth_or_children',
    ];
    const renderCauses = () => {
        const causesBlock = [];
        if (!_.isEmpty(causesArray)) {
            causesArray.forEach((cause) => {
                causesBlock.push(<CauseComponent
                    parentHandleCauses={parentHandleCauses}
                    userCauses={userCauses}
                    cause={cause}
                />);
            });
        }
        return causesBlock;
    };
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
                        {renderCauses()}
                    </Grid.Row>
                </Grid>
                <FormValidationErrorMessage
                    condition={!validity.isValidCauses}
                    errorMessage="Please select 3 or more causes"
                />
                <div className="reg-btn-wraper">
                    <Button
                        type="submit"
                        disabled={!(userCauses.length>=3)}
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
