import React, { Fragment } from 'react';
import {
    Button,
    Header,
    Form,
    Grid,
} from 'semantic-ui-react';
function FinalStep(props) {
    const {
        handleSubmit,
        buttonClicked,
    } = props;
    return (
        <Fragment>
            <Grid.Column className="left-bg"></Grid.Column>
            <Grid.Column>
                <div className="login-form-wraper">
                    <div className="reg-header">
                        <Header as="h3">Create your Impact Account. </Header>
                        <Header as="h4">
                            By clicking ‘Create your Impact Account’, you acknowlege that you have read the
                            <a href="https://lab.24467.org/privacy"> Privacy Policy</a>
                            , and agree to the
                            <a href="https://lab.24467.org/terms"> Terms & Conditions </a>
                             and 
                            <a href="https://lab.24467.org/chimp-account-agreement"> Account Agreement</a>
                            .
                        </Header>
                    </div>
                    <Form>
                        <div className="create-btn-wraper">
                            <Button
                                type="submit"
                                disabled={buttonClicked}
                                onClick={handleSubmit}
                                primary
                                content={buttonClicked ? 'Submitting' : 'Create Your ImpactAccount'}
                            />
                        </div>
                    </Form>
                </div>
            </Grid.Column>
        </Fragment>
    );
}

export default FinalStep;
