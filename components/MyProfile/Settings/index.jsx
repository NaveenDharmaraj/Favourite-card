/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Responsive,
    Tab,
} from 'semantic-ui-react';

import { Router } from '../../../routes';

import ManagePassword from './managePassword';
import Privacy from './privacy';
import CreditCard from './creditCard';
import Notifications from './notifications';
import Support from './support';
import Legal from './legal';
import EmailList from './emailList';
import InfoToShare from './infoToShare';

const panes1 = [
    {
        menuItem: {
            content: 'Email addresses',
            icon: 'user',
            iconPosition: 'left',
            key: 'Email',
        },
        render: () => (
            <Tab.Pane attached={false}>
                <EmailList />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Change password',
            icon: 'edit',
            iconPosition: 'left',
            key: 'Change password',
        },
        render: () => {
            return (
                <Tab.Pane attached={false}>
                    <ManagePassword />
                </Tab.Pane>
            );
        },
    },
    {
        menuItem: {
            content: 'Info to share',
            icon: 'group',
            iconPosition: 'left',
            key: 'Information to share',
        },
        render: () => (
            <Tab.Pane>
                <InfoToShare />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Privacy & security',
            icon: 'privacy',
            iconPosition: 'left',
            key: 'Privacy and security',
        },
        render: () => (
            <Tab.Pane>
                <Privacy />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Payment methods',
            icon: 'credit',
            iconPosition: 'left',
            key: 'Payment methods',
        },
        render: () => (
            <Tab.Pane>
                <CreditCard />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Notifications',
            icon: 'bell',
            iconPosition: 'left',
            key: 'Notifications',
        },
        render: () => (
            <Tab.Pane>
                <Notifications />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Support',
            icon: 'support',
            iconPosition: 'left',
            key: 'Support',
        },
        render: () => (
            <Tab.Pane>
                <Support />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Legal',
            icon: 'legal',
            iconPosition: 'left',
            key: 'Legal',
        },
        render: () => (
            <Tab.Pane>
                <Legal />
            </Tab.Pane>
        ),
    },
];

// eslint-disable-next-line react/prefer-stateless-function
class UserSettings extends React.Component {
    constructor(props) {
        super(props);
        const {
            settingName,
        } = props;
        const activeTabIndex = _.isEmpty(settingName) ? 0 : this.getPageIndexByName(settingName);
        this.state = {
            activeTabIndex,
        };
        this.handleTab = this.handleTab.bind(this);
    }

    // eslint-disable-next-line react/sort-comp
    handleTab(event, data) {
        switch (data.activeIndex) {
            case 0:
                Router.pushRoute('/user/profile/settings/email');
                break;
            case 1:
                Router.pushRoute('/user/profile/settings/managepassword');
                break;
            case 2:
                Router.pushRoute('/user/profile/settings/managegiving');
                break;
            case 3:
                Router.pushRoute('/user/profile/settings/privacy');
                break;
            case 4:
                Router.pushRoute('/user/profile/settings/creditcard');
                break;
            case 5:
                Router.pushRoute('/user/profile/settings/notifications');
                break;
            case 6:
                Router.pushRoute('/user/profile/settings/support');
                break;
            case 7:
                Router.pushRoute('/user/profile/settings/legal');
                break;
            default:
                break;
        }
        this.setState({
            activeTabIndex: data.activeIndex,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getPageIndexByName(pageName) {
        switch (pageName) {
            case 'email':
                return 0;
            case 'managepassword':
                return 1;
            case 'managegiving':
                return 2;
            case 'privacy':
                return 3;
            case 'creditcard':
                return 4;
            case 'notifications':
                return 5;
            case 'support':
                return 6;
            case 'legal':
                return 7;
            default:
                break;
        }
    }

    render() {
        const {
            activeTabIndex,
        } = this.state;
        return (
            <div>
                <Responsive minWidth={768}>
                    <div className="settingsTab">
                        <Tab
                            grid={{
                                paneWidth: 11,
                                tabWidth: 5,
                            }}
                            menu={{
                                fluid: true,
                                tabular: true,
                                vertical: true,
                            }}
                            panes={panes1}
                            activeIndex={activeTabIndex}
                            onTabChange={this.handleTab}
                        />
                    </div>
                </Responsive>
                <Responsive maxWidth={767}>
                    <div className="charityTab n-border">
                        <Tab
                            menu={{
                                pointing: true,
                                secondary: true,
                            }}
                            panes={panes1}
                            activeIndex={activeTabIndex}
                            onTabChange={this.handleTab}
                        />
                    </div>
                </Responsive>
            </div>
        );
    }
}

export default UserSettings;
