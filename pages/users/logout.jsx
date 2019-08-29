import React from 'react';
import {
    Dimmer,
    Loader,
} from 'semantic-ui-react';

import { logout } from '../../actions/auth';
import AuthLayout from '../../components/shared/Layout/AuthLayout';

class Logout extends React.Component {
    componentDidMount() {
        logout();
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

export default Logout;
