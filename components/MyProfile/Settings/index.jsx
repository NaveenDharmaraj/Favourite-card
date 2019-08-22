import React from 'react';
import {
    Button,
    Header,
    Image,
    Grid,
    List,
    Checkbox,
    Responsive,
    Tab,
} from 'semantic-ui-react';

import pswdicon from '../../../static/images/icons/icon-home.svg';
import privacyicon from '../../../static/images/icons/icon-home.svg';
import notifyicon from '../../../static/images/icons/icon-home.svg';
import supporticon from '../../../static/images/icons/icon-home.svg';
import legalicon from '../../../static/images/icons/icon-home.svg';

import ManagePassword from './managePassword';

const panes1 = [
    { menuItem: { key: 'Manage password', icon: 'privacy', iconPosition:'left', content: 'Manage password' }, render: () => <Tab.Pane><ManagePassword /></Tab.Pane> },
    { menuItem: { key: 'Privacy & Security', icon: 'privacy', iconPosition:'left', content: 'Privacy & Security' }, render: () => <Tab.Pane>
        <div className="remove-gutter">
            <div className="userSettingsContainer">
                <div className="settingsDetailWraper">
                    <Header as="h4">Discoverability <Checkbox toggle defaultChecked className="c-chkBox right"/></Header>
                    <p>You can manage your discoverability settings - manage whether you show up on searches or your name appears on Giving Group profiles. </p>
                </div>
                <div className="settingsDetailWraper">
                    <Header as="h4">Blocked users</Header>
                    <List divided verticalAlign='middle' className="userList">
                        <List.Item>
                            <List.Content floated='right'>
                                <span className="date">Blocked on January 9, 2019</span>
                                <Button className="blue-bordr-btn-round-def c-small">Unblock</Button>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                            <List.Content>
                                <List.Header>Daniel Louise</List.Header>
                                <List.Description>Vancouver, BC</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content floated='right'>
                                <span className="date">Blocked on January 9, 2019</span>
                                <Button className="blue-bordr-btn-round-def c-small">Unblock</Button>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
                            <List.Content>
                                <List.Header>Daniel Louise</List.Header>
                                <List.Description>Vancouver, BC</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content floated='right'>
                                <span className="date">Blocked on January 9, 2019</span>
                                <Button className="blue-bordr-btn-round-def c-small">Unblock</Button>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                            <List.Content>
                                <List.Header>Daniel Louise</List.Header>
                                <List.Description>Vancouver, BC</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content floated='right'>
                                <span className="date">Blocked on January 9, 2019</span>
                                <Button className="blue-bordr-btn-round-def c-small">Unblock</Button>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/tom.jpg' />
                            <List.Content>
                                <List.Header>Daniel Louise</List.Header>
                                <List.Description>Vancouver, BC</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content floated='right'>
                                <span className="date">Blocked on January 9, 2019</span>
                                <Button className="blue-bordr-btn-round-def c-small">Unblock</Button>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                            <List.Content>
                                <List.Header>Daniel Louise</List.Header>
                                <List.Description>Vancouver, BC</List.Description>
                            </List.Content>
                        </List.Item>

                    </List>
                </div>
            </div>
        </div>
    </Tab.Pane> },
    { menuItem: { key: 'Notifications', icon: 'bell outline', iconPosition:'left', content: 'Notifications' }, render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
    { menuItem: { key: 'Support', icon: 'question circle outline', iconPosition:'left', content: 'Support' }, render: () => <Tab.Pane>Tab 4 Content</Tab.Pane> },
    { menuItem: { key: 'Legal', icon: 'legal', iconPosition:'left', content: 'Legal' }, render: () => <Tab.Pane>Tab 5 Content</Tab.Pane> },
    ]

class UserSettings extends React.Component {
    render() {
        return (
            <div>
                 <Responsive minWidth={768}>
                    <div className="settingsTab">
                    <Tab grid={{paneWidth: 11, tabWidth: 5}} menu={{ fluid: true, vertical: true, tabular: true }} panes={panes1} />
                    </div>
                </Responsive>
                <Responsive maxWidth={768}>
                    <div className="charityTab n-border">
                        <Tab menu={{ secondary: true, pointing: true }} panes={panes1} />
                    </div>
                </Responsive>
            </div>
        );
    }
}

export default UserSettings;
