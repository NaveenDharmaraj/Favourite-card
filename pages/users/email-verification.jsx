import React from 'react';
import {
    Button,
    Container,
    Header,
    Form,
    Grid,
    Message,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import { resendVerificationEmail } from '../../actions/onBoarding';
import Layout from '../../components/shared/Layout';
import storage from '../../helpers/storage';
import { Router } from '../../routes';

class EmailVerification extends React.Component {
    constructor(props) {
        super(props);
        let {
            newUserDetails,
        } = this.props;
        if (newUserDetails === undefined) {
            let newUserDetailsLocal = storage.get('newUserDetails', 'local');
            newUserDetails = JSON.parse(newUserDetailsLocal);
        }
        this.state = {
            newUserDetails,
        };
        if (newUserDetails === undefined) {
            Router.pushRoute('/users/error');
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let {
            newUserDetails,
        } = this.state;
        const {
            dispatch,
        } = this.props;
        const userId = `${newUserDetails.identities[0].provider}|${newUserDetails.identities[0].user_id}`;
        resendVerificationEmail(userId, dispatch);
    }

    render() {
        const {
            newUserDetails,
        } = this.state;
        const {
            apiResendEmail,
        } = this.props;
        return (
            <Layout>
                <div className="pageWraper">
                    <Container>
                        <div className="linebg">
                            <Grid columns={2} verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column className="left-bg"></Grid.Column>
                                    <Grid.Column>
                                        <div className="login-form-wraper">
                                            <div className="reg-header">
                                                <Header as="h3">Verify your email.</Header>
                                                <Header as="h4">
                                                    We’ve emailed a verification link to <a>{newUserDetails.email}</a>
                                                    . Click the link in that email to finish creating your account.
                                                </Header>
                                                <Header as="h4">
                                                    Don’t see an email from us?
                                                </Header>
                                            </div>
                                            <Form>
                                                <div className="create-btn-wraper">
                                                    <Button
                                                        type="submit"
                                                        onClick={this.handleSubmit}
                                                        primary
                                                        // disabled={!!apiResendEmail}
                                                    >
                                                        Resend email
                                                    </Button>
                                                </div>
                                                {!!apiResendEmail && <Message compact color='green'>Email Sent</Message>}

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
}
function mapStateToProps(state) {
    return {
        apiResendEmail: state.onBoarding.apiResendEmail,
        newUserDetails: state.onBoarding.newUserDetails,
    };
}
export default (connect(mapStateToProps)(EmailVerification));
