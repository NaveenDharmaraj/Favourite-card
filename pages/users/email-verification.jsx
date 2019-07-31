import React from 'react';
import {
    Button,
    Container,
    Header,
    Form,
    Grid,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import Layout from '../../components/shared/Layout';

function EmailVerification(props) {
    console.log(props);
    return (
        <Layout>
            <div className="pageWraper">
                <Container>
                    <div className="linebg" >
                        <Grid columns={2} verticalAlign='middle'>
                            <Grid.Row>
                                <Grid.Column className="left-bg"></Grid.Column>
                                <Grid.Column>
                                    <div className="login-form-wraper">
                                        <div className="reg-header">
                                            <Header as="h3">Verify your email.</Header>
                                            <Header as="h4">
                                                We’ve emailed a verification link to 
                                                <a>tammy.tuba@gmail.com</a>
                                                .Click the link in that email to finish creating your account.
                                            </Header>
                                            <Header as="h4">
                                                Don’t see an email from us?
                                            </Header>
                                        </div>
                                        <Form>
                                            <div className="create-btn-wraper">
                                                <Button type='submit' primary>Resend email</Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>

                        </Grid>
                    </div>
                </Container>
            </div>
        </Layout>
    );
}
function mapStateToProps(state) {
    return {
        newUserDetails: state.user.newUserDetails,
    };
}
export default (connect(mapStateToProps)(EmailVerification));
