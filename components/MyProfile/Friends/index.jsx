/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
    Button,
    Header,
    Form,
    Modal,
    Icon,
    Grid,
    Responsive,
    Tab,
} from 'semantic-ui-react';

import FindFriends from './findFriends';
import MyFriends from './myFriends';


const panes2 = [
    {
        menuItem: {
            content: 'Find friends',
            icon: 'privacy',
            iconPosition: 'left',
            key: 'Find friends',
        },
        render: () => (
            <Tab.Pane attached={false}>
                <FindFriends />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Your friends',
            icon: 'privacy',
            iconPosition: 'left',
            key: 'Your friends',
        },
        render: () => (
            <Tab.Pane attached={false}>
                <MyFriends />
            </Tab.Pane>
        ),
    },
];

class Friends extends React.Component {
    render() {
        return (
            <div>
                <div className="inviteSettings">
                    <Grid centered columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h3" icon>
                                    <Icon name="settings" />
                                        Find friends and give together
                                    <Header.Subheader className="mb-1">
                                        Give the gift of charitable dollars!
                                        From birthday gifts to children’s allowances…
                                        to gifts sent ‘just because.’
                                        Rally friends and family to give with you
                                        and create change together.
                                    </Header.Subheader>
                                    <Modal
                                        className="chimp-modal"
                                        closeIcon
                                        trigger={<Button className="blue-bordr-btn-round-def">Invite friends</Button>}
                                        centered={false}
                                    >
                                        <Modal.Header>
                                            Share Charitable Impact with friends and family
                                        </Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <Form className="mb-2 inviteForm">
                                                    <label>
                                                        Enter as many email addresses as you like,
                                                        separated by comma
                                                    </label>
                                                    <Grid verticalAlign="middle">
                                                        <Grid.Row>
                                                            <Grid.Column mobile={16} tablet={12} computer={13}>
                                                                <Form.Field>
                                                                    <input placeholder="Email Address" />
                                                                </Form.Field>
                                                            </Grid.Column>
                                                            <Grid.Column mobile={16} tablet={4} computer={3}>
                                                                <Button className="blue-btn-rounded-def c-small">Invite</Button>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </Form>
                                                <Form className="inviteForm">
                                                    <label>Or share link</label>
                                                    <Grid verticalAlign="middle">
                                                        <Grid.Row>
                                                            <Grid.Column mobile={16} tablet={12} computer={13}>
                                                                <Form.Field>
                                                                    <input value="https://charitableimpact.com/share-this-awesome-link" />
                                                                </Form.Field>
                                                            </Grid.Column>
                                                            <Grid.Column mobile={16} tablet={4} computer={3}>
                                                                <Button className="blue-bordr-btn-round-def c-small">Copy link</Button>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </Form>
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="border-top">
                    <Responsive minWidth={768}>
                        <div className="settingsTab margin-0">
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
                                panes={panes2}
                            />
                        </div>
                    </Responsive>
                    <Responsive maxWidth={768}>
                        <div className="charityTab n-border margin-0">
                            <Tab
                                menu={{
                                    pointing: true,
                                    secondary: true,
                                }}
                                panes={panes2}
                            />
                        </div>
                    </Responsive>
                </div>
            </div>
        );
    }
}

export default Friends;
