import React from 'react';
import {
    Container,
    Header,
    Button,
    Form,
} from 'semantic-ui-react';

import Layout from '../components/shared/Layout';
import '../static/less/claimcharity.less';

function OneLastStep() {
    return (
        <Layout>
            <div className="OneLastStepBanner">
                <Container>
                    <div className="lefttopicon"></div>
                    <div className="onelaststepwapper">
                        <div className="OneLastStepHeading">
                            <Header as='h3'>One last step</Header>
                        </div>
                        <div className="Onelaststepsubhesding">
                            <p>To finish creating your Charity Account, you’ll first need to open a personal Impact Account. It’s how you’ll access your new Charity Account.</p>
                        </div>
                        <div className="lefttopiconbox">
                            <Form>
                                <Form.Field>
                                    <label>First name</label>
                                    <input placeholder='Your first name' className="mb-1 OneLastfield" />
                                </Form.Field>
                                <Form.Field>
                                    <label>Last name</label>
                                    <input placeholder='Your last name' className="OneLastfield" />
                                </Form.Field>
                                <div className="OneLastbtn">
                                    <Button className=" primary blue-btn-rounded w-180 disabled pt-1 pb-1"><b>Continue</b></Button>
                                    <p>Already have an account? Log in</p>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Container>
            </div>
        </Layout>
    );
}

export default OneLastStep;
