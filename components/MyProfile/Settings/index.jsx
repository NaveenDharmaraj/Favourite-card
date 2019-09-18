/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Responsive,
    Tab,
} from 'semantic-ui-react';

import { Router } from '../../../routes';

import ManagePassword from './managePassword';
import ManageGiving from './manageGiving';
import Privacy from './privacy';
import CreditCard from './creditCard';
import Notifications from './notifications';
import Support from './support';
import Legal from './legal';

const panes1 = [
    {
        menuItem: {
            content: 'Manage password',
            icon: 'edit',
            iconPosition: 'left',
            key: 'Manage password',
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
            content: 'Manage Giving',
            icon: 'group',
            iconPosition: 'left',
            key: 'Manage Giving',
        },
        render: () => (
            <Tab.Pane>
                <ManageGiving />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Privacy & Security',
            icon: 'privacy',
            iconPosition: 'left',
            key: 'Privacy & Security',
        },
        render: () => (
            <Tab.Pane>
                <Privacy />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Credit Cards',
            icon: 'credit',
            iconPosition: 'left',
            key: 'Credit Cards',
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
                Router.pushRoute('/user/profile/settings/managepassword');
                break;
            case 1:
                Router.pushRoute('/user/profile/settings/managegiving');
                break;
            case 2:
                Router.pushRoute('/user/profile/settings/privacy');
                break;
            case 3:
                Router.pushRoute('/user/profile/settings/creditcard');
                break;
            case 4:
                Router.pushRoute('/user/profile/settings/notifications');
                break;
            case 5:
                Router.pushRoute('/user/profile/settings/support');
                break;
            case 6:
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
            case 'managepassword':
                return 0;
            case 'managegiving':
                return 1;
            case 'privacy':
                return 2;
            case 'creditcard':
                return 3;
            case 'notifications':
                return 4;
            case 'support':
                return 5;
            case 'legal':
                return 6;
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
                <Responsive maxWidth={768}>
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
