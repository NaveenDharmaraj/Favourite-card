/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button,
    Container,
    Header,
    Form,
    Grid,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';

import { resendVerificationEmail } from '../../actions/onBoarding';
import Layout from '../../components/shared/Layout';
import storage from '../../helpers/storage';
import { Router } from '../../routes';

const ModalStatusMessage = dynamic(() => import('../../components/shared/ModalStatusMessage'), {
    ssr: false
});

class EmailVerification extends React.Component {
    constructor(props) {
        super(props);
        let {
            newUserDetails,
        } = this.props;
        if (newUserDetails === undefined) {
            const newUserDetailsEmail = storage.get('auth0UserEmail', 'local');
            const newUserDetailsId = storage.get('auth0UserId', 'local');
            newUserDetails = {
                email: newUserDetailsEmail,
                user_id: newUserDetailsId,
            };
        }

        if (newUserDetails === null) {
            Router.pushRoute('/users/login');
        }
        this.state = {
            newUserDetails,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let {
            newUserDetails,
        } = this.state;
        const {
            dispatch,
        } = this.props;
        resendVerificationEmail(newUserDetails.user_id, dispatch);
    }

    render() {
        const {
            newUserDetails,
        } = this.state;
        const {
            apiResendEmail,
        } = this.props;
        if (newUserDetails) {
            return (
                <Layout>
                    <div className="pageWraper">
                        <Container>
                            <div className="linebg">
                                <Grid columns={2}>
                                
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={7} className="left-bg verifyImg"><div></div></Grid.Column>
                                        <Grid.Column  mobile={16} tablet={16} computer={7}>
                                        {!!apiResendEmail && (
                                                        <Grid.Row>
                                                            <Grid.Column width={16} className="mt-2">
                                                                <ModalStatusMessage
                                                                    message = "Email sent"
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    )}
                                            <div className="login-form-wraper">
                                                <div className="reg-header">
                                                    <Header as="h3">Verify your email</Header>
                                                    <Header as="h4">
                                                        We’ve emailed a verification link to <a>{newUserDetails.email}</a>
                                                        . Click the link in that email to finish creating your account.
                                                    </Header>
                                                    
                                                </div>
                                                <Form>
                                                    <div className="create-btn-wraper">
                                                        <p className="font-s-14">
                                                            <span>Don’t see an email from us?</span>
                                                            <Button
                                                                type="submit"
                                                                onClick={this.handleSubmit}
                                                                className="blue-btn-rounded-def ml-1"
                                                                // disabled={!!apiResendEmail}
                                                            >
                                                            Resend email
                                                            </Button>
                                                        </p>
                                                        
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
        return null;
    }
}
function mapStateToProps(state) {
    return {
        apiResendEmail: state.onBoarding.apiResendEmail,
        newUserDetails: state.onBoarding.newUserDetails,
    };
}
export default (connect(mapStateToProps)(EmailVerification));
