import React from 'react';
import {
    Responsive,
    Tab,
} from 'semantic-ui-react';


import ManagePassword from './managePassword';
import Privacy from './privacy';
import CreditCard from './creditCard';
import Notifications from './notifications';
import Support from './support';
import Legal from './legal';

const panes1 = [
    {
        menuItem: {
            content: 'Manage password',
            icon: 'privacy',
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
            icon: 'credit card outline',
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
            icon: 'bell outline',
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
            icon: 'question circle outline',
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
    render() {
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
                        />
                    </div>
                </Responsive>
            </div>
        );
    }
}

export default UserSettings;
