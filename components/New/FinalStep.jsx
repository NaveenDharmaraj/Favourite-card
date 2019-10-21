import React, { Fragment } from 'react';
import getConfig from 'next/config';
import {
    Button,
    Header,
    Form,
    Grid,
} from 'semantic-ui-react';

const { publicRuntimeConfig } = getConfig();

const {
    APP_URL_ORIGIN,
} = publicRuntimeConfig;


function FinalStep(props) {
    const {
        handleSubmit,
        buttonClicked,
    } = props;
    return (
        <Fragment>
            <Grid.Column className="left-bg"><div></div></Grid.Column>
            <Grid.Column>
                <div className="login-form-wraper">
                    <div className="reg-header">
                        <Header as="h3">Create your Impact Account. </Header>
                        <Header as="h4">
                            By clicking ‘Create your Impact Account,’ you acknowlege that you have read the
                            <a href={`${APP_URL_ORIGIN}/privacy`} target="_blank"> Privacy Policy</a>
                            , and agree to the
                            <a href={`${APP_URL_ORIGIN}/terms`} target="_blank"> Terms & Conditions </a>
                             and
                            <a href={`${APP_URL_ORIGIN}/account-agreement`} target="_blank"> Account Agreement</a>
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
                                content={buttonClicked ? 'Submitting' : 'Create Your Impact Account'}
                            />
                        </div>
                    </Form>
                </div>
            </Grid.Column>
        </Fragment>
    );
}

export default FinalStep;
