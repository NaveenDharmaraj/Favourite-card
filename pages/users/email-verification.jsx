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
        this.state = {
            buttonClicked: false,
        };
        let {
            newUserDetails,
        } = this.props;
        if (newUserDetails === undefined) {
            let newUserDetailsLocal = storage.get('newUserDetails', 'local');
            newUserDetails = JSON.parse(newUserDetailsLocal);
        }
        this.state.newUserDetails = newUserDetails;
        if (newUserDetails === undefined) {
            Router.pushRoute('/users/error');
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let {
            newUserDetails,
            buttonClicked,
        } = this.state;
        resendVerificationEmail(newUserDetails.user_id);
        buttonClicked = true;
        this.setState({
            buttonClicked,
        });
        setTimeout(() => {
            this.setState({ buttonClicked: false });
        }, 3000);
    }

    render() {
        let {
            newUserDetails,
            buttonClicked,
        } = this.state;


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
                                                    <a>{newUserDetails.email}</a>
                                                    .Click the link in that email to finish creating your account.
                                                </Header>
                                                <Header as="h4">
                                                    Don’t see an email from us?
                                                </Header>
                                            </div>
                                            <Form>
                                                <div className="create-btn-wraper">
                                                    <Button  type="submit" 
                                                        onClick={this.handleSubmit}
                                                        primary>
                                                        Resend email
                                                    </Button>
                                                </div>
                                                {!!buttonClicked && <Message compact color='green'>Email Sent</Message>}

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
        newUserDetails: state.onBoarding.newUserDetails,
    };
}
export default (connect(mapStateToProps)(EmailVerification));
