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
                        <Header as="h3" className="pb-3">A couple of quick questions before heading to your account…</Header>
                        <Header as="h4" className="font-s-20">What causes are important to you? </Header>
                        <p className="pb-2">
                        Select causes to see charities and Giving Groups that might interest you. You’ll see them in the
                            <b> "discovered for you" </b>
                            section of your account.
                        </p>
                    </div>
                    <p>Select as many as you like:</p>
                    <Grid className="select-btn-wraper">
                        <Grid.Row>
                            {renderCauses()}
                        </Grid.Row>
                    </Grid>
                    <p className="causes-selection">Only you can see causes you care about unless you decide to share them on your personal profile. We don't share your selected causes with charities or anyone else.</p>
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
                            // disabled={!(userCauses.length>=3)}
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
