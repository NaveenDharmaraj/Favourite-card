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
import { Router } from '../routes';

class MyProfile extends React.Component {
    static async getInitialProps({ query }) {
        return {
            pageName: query.slug,
            settingName: query.step,
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
        this.handleTab = this.handleTab.bind(this);
    }

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

    getPageIndexByName(pageName) {
        switch(pageName) {
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

    handleTab(event, data) {
        switch(data.activeIndex){
            case 0:
                Router.pushRoute('/user/profile/basic');
            break;
            case 1:
                Router.pushRoute('/user/profile/charitableinterest');
            break;
            case 2:
                Router.pushRoute('/user/profile/friends');
            break;
            case 3:
                Router.pushRoute('/user/profile/settings');
            break;
            default:
                break;
        }
        this.setState({
            activeTabIndex: data.activeIndex
        });
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
                    <Settings settingName={this.props.settingName}/>
                </Tab.Pane>
            ),
        },
    ];

    render() {
        const {
            userProfileBasicData,
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
        return (
            <Layout authRequired>
                <BasicProfile userData={userData} />
                <div className="pb-3">
                    <Container>
                        <div className="charityTab n-border">
                            <Tab
                                activeIndex={activeTabIndex}
                                menu={{
                                    pointing: true,
                                    secondary: true,
                                }}
                                panes={this.panes}
                                onTabChange={this.handleTab}
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
