import React from 'react';
import {
    Dimmer,
    Loader,
} from 'semantic-ui-react';

import { Router } from '../routes';

import AuthLayout from '../components/shared/Layout/AuthLayout';

class Home extends React.Component {
    componentDidMount() {
        Router.pushRoute('/dashboard');
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

export default Home;
