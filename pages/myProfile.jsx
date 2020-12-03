import React from 'react';
import _ from 'lodash';
import {
    Container,
    Tab,
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
import BasicProfile from '../components/MyProfile/BasicProfile';
import EditProfileBasic from '../components/MyProfile/EditBasicProfile';
import EditCharitableInterest from '../components/MyProfile/EditCharitableInterest';
const Friends = dynamic(() => import('../components/MyProfile/Friends'), {
    ssr: false
});
const Settings = dynamic(() => import('../components/MyProfile/Settings'), {
    ssr: false
});
import { Router } from '../routes';

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

    constructor(props) {
        super(props);
        const {
            pageName,
        } = this.props;
        const activeTabIndex = _.isEmpty(pageName) ? 0 : this.getPageIndexByName(pageName);
        this.state = {
            activeTabIndex,
        };
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        if (!_.isEmpty(currentUser)) {
            const {
                id,
                attributes: {
                    email,
                },
            } = currentUser;
            getUserProfileBasic(dispatch, email, id, id);
        }
    }

    getPageIndexByName(pageName) {
        switch (pageName) {
            case 'basic':
                return 0;
            case 'charitableinterest':
                return 1;
            case 'friends':
                return 2
            case 'settings':
                return 3
            default:
                break;
        }
    }

    render() {
        const {
            userProfileBasicData,
            currentUser,
        } = this.props;
        const {
            activeTabIndex,
        } = this.state;
        let userData = '';
        if (userProfileBasicData
            && userProfileBasicData.data
            && _.size(userProfileBasicData.data) > 0) {
            userData = userProfileBasicData.data[0].attributes;
        }
        let userAvatar = '';
        if (!_.isEmpty(currentUser)) {
            userAvatar = currentUser.attributes.avatar;
        }
        return (
            <Layout authRequired stripe>
                <Container>
                    <div className='account-settings-wrap'>
                        <Header>Account settings</Header>
                        <Settings settingName={this.props.settingName} />
                    </div>
                </Container>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileBasicData: state.userProfile.userProfileBasicData,
        userCausesList: state.userProfile.userCausesList,
    };
}

export default (connect(mapStateToProps)(MyProfile));
