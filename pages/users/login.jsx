import querystring from 'querystring';

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { // eslint-disable-line import/order
    Container,
    Grid,
    Header,
} from 'semantic-ui-react';
import _includes from 'lodash/includes';

import auth0 from '../../services/auth';
import Layout from '../../components/shared/Layout';
import { Router } from '../../routes';
import ModalStatusMessage from '../../components/shared/ModalStatusMessage';

class UserAuthView extends React.Component {
    static async getInitialProps({
        query,
    }) {
        return {
            code: query.code,
            message: query.message,
            success: query.success,
        };
    }

    componentDidMount() {
        const {
            isAuthenticated,
        } = this.props;
        if (isAuthenticated) {
            Router.pushRoute('/dashboard');
        } else {
            auth0.returnProps = querystring.parse(
                window.location.search.slice(1), // must skip the '?' prefix
            );
            window.addEventListener('resize', this.showlock.bind(this));
            this.setState(
                {
                    innerWidth: window.innerWidth,
                },
            );
            auth0.lock.show({
                initialScreen: auth0.initialScreen,
            });
        }
    }

    componentWillUnmount() {
        auth0.lock.hide(); // lock MUST be hidden before being re-shown, because reasons
    }

    showlock() {
        const {
            innerWidth,
        } = this.state;
        if ((innerWidth >= 992 && window.innerWidth < 992) || (innerWidth < 992 && window.innerWidth >= 992)) {
            this.setState(
                {
                    innerWidth: window.innerWidth,
                },
            );
            location.reload();
        }
    }

    render() {
        const {
            code,
            isAuthenticated,
            message,
            success,
        } = this.props;
        let messageText = '';

        if (success === 'true') {
            messageText = (
                <ModalStatusMessage
                    message="Thanks! Your email is confirmed. To continue, please log in below."
                />
            );
            if (code === '3') {
                messageText = (
                    <ModalStatusMessage
                        message="Thanks! Your password is now changed. To continue, please log in below."
                    />
                );
            }
        } else if (_includes(message, 'This URL can be used only once')) {
            messageText = (
                <ModalStatusMessage
                    message="Thanks! Your email is confirmed. To continue, please log in below."
                />
            );
            if (code === '3') {
                messageText = (
                    <ModalStatusMessage
                        message="Thanks! Your password is now changed. To continue, please log in below."
                    />
                );
            }
        } else if (success === 'false') {
            messageText = (
                <ModalStatusMessage
                    error="We’re sorry, something went wrong. Please contact support."
                />
            );
        }

        return (
            <Fragment>
                { !isAuthenticated && (
                    <Layout onBoarding isLogin>
                        <div className="pageWraper loginPageBg">
                            <Container>
                                { messageText }
                                <div className="linebg">
                                    <Grid columns={2} stackable>
                                        <Grid.Row>
                                            <Grid.Column className="left-bg"><div></div></Grid.Column>
                                            <Grid.Column>
                                                <div className="login-form-wraper">
                                                    <div className="reg-header">
                                                        <Header as="h3">Log in to Charitable Impact</Header>
                                                        <Header as="h4">Enter your details below</Header>
                                                    </div>
                                                    <div id="auth0-lock-container" />
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>

                                    </Grid>
                                </div>
                            </Container>
                        </div>
                    </Layout>
                )}
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(UserAuthView);
