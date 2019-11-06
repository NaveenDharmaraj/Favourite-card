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
        handleBack,
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
            <Grid.Column mobile={16} tablet={16} computer={2} largeScreen={4} className="causesLeftImg">
               <div/>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={14} largeScreen={12}>
                <div className="prefered-wraper">
                    <div className="prefered-img" />
                    <div className="reg-header">
                        <Header as="h3">What causes are important to you? </Header>
                        <Header as="h4">Your answers help us find charities and Giving Groups that you might be interested in. </Header>
                        <p className="pb-2">
                        The causes you select are visible only to you unless you choose to share them on your Charitable Impact profile, and only you can see the charities and Giving Groups discovered for you.<br/><br/>
                        We don't share the information you provide with charities or anyone else.
                        </p>
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
                            className="blue-bordr-btn-round-def"
                            content="Back"
                            onClick={handleBack}
                        />
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
