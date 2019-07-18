import querystring from 'querystring';

import React from 'react';
import { connect } from 'react-redux';
import { // eslint-disable-line import/order
    Grid,
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
                <Grid
                    centered
                    column={1}
                    padded="vertically"
                >
                    <Grid.Row>
                        <Grid.Column
                            mobile={16}
                            tablet={6}
                            computer={6}
                            largeScreen={4}
                            widescreen={3}
                            id="auth0-lock-container"
                            {...segmentProps}
                        />
                    </Grid.Row>
                </Grid>
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
