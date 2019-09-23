/* eslint-disable react/prop-types */
/* eslint-disable operator-assignment */
import React,{Fragment} from 'react';

import {
    Button,
    Header,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';

import SingleCause from './SingleCause';

function CausesSelection(props) {
    const {
        causesList,
        handleSubmit,
        parentHandleCauses,
        userCauses,
        validity,
    } = props;
    const renderCauses = () => {
        const causesBlock = [];
        if (!_.isEmpty(causesList)) {
            causesList.forEach((cause, i) => {
                causesBlock.push(<SingleCause
                    parentHandleCauses={parentHandleCauses}
                    userCauses={userCauses}
                    cause={cause}
                    index={i % 12}
                />);
            });
        }
        return causesBlock;
    };
    return (
        <Fragment>
            <Grid.Column mobile={16} tablet={2} computer={2} largeScreen={4} className="causesLeftImg">
               <div/>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={14} computer={14} largeScreen={12}>
                <div className="prefered-wraper">
                    <div className="prefered-img" />
                    <div className="reg-header">
                        <Header as="h3">What causes are important to you? </Header>
                        <Header as="h4">Your answers help us personalize your experience. </Header>
                    </div>
                    <p>Choose 3 or more:</p>
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
        </Fragment>
    );
}

export default CausesSelection;
