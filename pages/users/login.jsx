import querystring from 'querystring';

import React from 'react';
import { connect } from 'react-redux';
import { // eslint-disable-line import/order
    Container,
    Grid,
    Header,
} from 'semantic-ui-react';

import auth0 from '../../services/auth';
import Layout from '../../components/shared/Layout';

class UserAuthView extends React.Component {
    componentDidMount() {
        auth0.returnProps = querystring.parse(
            window.location.search.slice(1), // must skip the '?' prefix
        );

        if (window.location.pathname === '/users/logout') {
            return logout();
        }
        auth0.lock.show({
            initialScreen: auth0.initialScreen,
        });
    }

    componentWillUnmount() {
        auth0.lock.hide(); // lock MUST be hidden before being re-shown, because reasons
    }

    render() {
        const {
            isAuthenticated,
        } = this.props;

        const segmentProps = {};

        if (isAuthenticated) {
            segmentProps.loading = true;
        } else {
            segmentProps.raised = true;
        }

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
                                                <Header as="h3">Sign in to Charitable Impact</Header>
                                                <Header as="h4">Enter your details below</Header>
                                            </div>
                                            <div id="auth0-lock-container">

                                            </div>
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
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(UserAuthView);
