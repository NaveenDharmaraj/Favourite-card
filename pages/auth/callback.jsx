import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Dimmer,
    Loader,
} from 'semantic-ui-react';

import auth0 from '../../services/auth';
import AuthLayout from '../../components/shared/Layout/AuthLayout';

class AuthCallback extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        auth0.lock; // eslint-disable-line no-unused-expressions
        auth0.storeDispatch = dispatch;
    }

    render() {
        return (
            <AuthLayout>
                <Dimmer active inverted>
                    <Loader size='large' />
                </Dimmer>
            </AuthLayout>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(AuthCallback);
