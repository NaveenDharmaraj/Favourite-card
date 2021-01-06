import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Container,
    Header,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import dynamic from 'next/dynamic';

import {
    getUserProfileBasic,
} from '../actions/userProfile';
import Layout from '../components/shared/Layout';
const Settings = dynamic(() => import('../components/MyProfile/Settings'), {
    ssr: false
});

class MyProfile extends React.Component {
    static async getInitialProps({ query }) {
        return {
            pageName: query.slug,
            settingName: query.step,
            namespacesRequired: [
                'giveCommon',
            ],
        };
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        if (!_isEmpty(currentUser)) {
            const {
                id,
                attributes: {
                    email,
                },
            } = currentUser;
            getUserProfileBasic(dispatch, email, id, id);
        }
    }

    render() {
        return (
            <Layout authRequired stripe>
                <Container>
                    <div className='account-settings-wrap charityTab n-border user-profile-settings'>
                        <Header>Account settings</Header>
                        <div className='user-messaging'>
                            <Settings settingName={this.props.settingName} />
                        </div>
                    </div>
                </Container>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(MyProfile));
