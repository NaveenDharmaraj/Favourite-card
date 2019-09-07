import React from 'react';
import _ from 'lodash';
import {
    Container,
    Tab,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getUserProfileBasic,
} from '../actions/userProfile';
import Layout from '../components/shared/Layout';
import BasicProfile from '../components/MyProfile/BasicProfile';
import EditProfileBasic from '../components/MyProfile/EditBasicProfile';
import EditCharitableInterest from '../components/MyProfile/EditCharitableInterest';
import Friends from '../components/MyProfile/Friends';
import Settings from '../components/MyProfile/Settings';

class MyProfile extends React.Component {
    componentDidMount() {
        const {
            currentUser: {
                id,
                attributes: {
                    email,
                },
            },
            dispatch,
        } = this.props;
        getUserProfileBasic(dispatch, email, id, id);
    }

    panes = [
        {
            menuItem: 'Basics',
            render: () => {
                const {
                    userProfileBasicData,
                } = this.props;
                let userData = '';
                if (userProfileBasicData
                    && userProfileBasicData.data
                    && _.size(userProfileBasicData.data) > 0) {
                    userData = userProfileBasicData.data[0].attributes;
                }             
                return(
                    <Tab.Pane attached={false}>
                        <EditProfileBasic userData={userData} />
                    </Tab.Pane>
                );
            }
        },
        {
            menuItem: 'Charitable interests',
            render: () => {
                return (
                    <Tab.Pane attached={false}>
                        <EditCharitableInterest />
                    </Tab.Pane>
                );
            },
        },
        {
            menuItem: 'Friends',
            render: () => (
                <Tab.Pane attached={false} className="user-messaging">
                    <Friends />
                </Tab.Pane>
            ),
        },
        {
            menuItem: 'Settings',
            render: () => (
                <Tab.Pane attached className="user-messaging">
                    <Settings />
                </Tab.Pane>
            ),
        },
    ];

    render() {
        const {
            userProfileBasicData,
        } = this.props;
        let userData = '';
        if (userProfileBasicData
            && userProfileBasicData.data
            && _.size(userProfileBasicData.data) > 0) {
            userData = userProfileBasicData.data[0].attributes;
        }
        return (
            <Layout authRequired>
                <BasicProfile userData={userData} />
                <div className="pb-3">
                    <Container>
                        <div className="charityTab n-border">
                            <Tab
                                menu={{
                                    pointing: true,
                                    secondary: true,
                                }}
                                panes={this.panes}
                            />
                        </div>
                    </Container>
                </div>
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
