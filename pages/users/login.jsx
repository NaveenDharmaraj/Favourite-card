import querystring from 'querystring';

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { // eslint-disable-line import/order
    Container,
    Grid,
    Header,
} from 'semantic-ui-react';

import auth0 from '../../services/auth';
import Layout from '../../components/shared/Layout';
import { Router } from '../../routes';

class UserAuthView extends React.Component {
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
            auth0.lock.show({
                initialScreen: auth0.initialScreen,
            });
        }
    }

    componentWillUnmount() {
        auth0.lock.hide(); // lock MUST be hidden before being re-shown, because reasons
    }

    render() {
        const {
            isAuthenticated,
        } = this.props;

        return (
            <Fragment>
                { !isAuthenticated && (
                    <Layout onBoarding>
                        <div className="pageWraper">
                            <Container>
                                <div className="linebg">
                                    <Grid columns={2} stackable>
                                        <Grid.Row>
                                            <Grid.Column className="left-bg"><div></div></Grid.Column>
                                            <Grid.Column>
                                                <div className="login-form-wraper">
                                                    <div className="reg-header">
                                                        <Header as="h3">Sign in to Charitable Impact</Header>
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
