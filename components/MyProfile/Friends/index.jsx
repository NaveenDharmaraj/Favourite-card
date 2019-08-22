import React from 'react';
import {
    Button,
    Header,
    Image,
    Form,
    Input,
    Modal,
    Icon,
    Grid,
    List,
} from 'semantic-ui-react';

import frndicon from '../../../static/images/icons/icon-home.svg';

class Friends extends React.Component {
    render() {
        return (
            <div>
                <div className="inviteSettings">
                    <Grid centered columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as='h3' icon>
                                    <Icon name='settings' />
                                    Find friends and give together
                                    <Header.Subheader className="mb-1">
                                        Give the gift of charitable dollars!  From birthday gifts to children’s allowances… to gifts sent ‘just because.’  Rally friends and family to give with you and create change together.
                                    </Header.Subheader>
                                    <Modal className="chimp-modal" closeIcon trigger={<Button className="blue-bordr-btn-round-def">Invite friends</Button>} centered={false}> 
                                        <Modal.Header>Share Charitable Impact with friends and family</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <Form className="mb-2 inviteForm">
                                                    <label>Enter as many email addresses as you like, separated by comma</label>
                                                    <Grid verticalAlign="middle">
                                                        <Grid.Row>
                                                            <Grid.Column mobile={16} tablet={12} computer={13}>
                                                                <Form.Field>
                                                                    <input placeholder='First Name' />
                                                                </Form.Field>
                                                            </Grid.Column>
                                                            <Grid.Column mobile={16} tablet={4} computer={3}>
                                                                <Button className="blue-btn-rounded-def c-small">Add friend</Button>
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
                                                <div className="profile-social-wraper pl-0">
                                                    <div className="profile-social-links small">
                                                        <List horizontal>
                                                            <List.Item as="a">
                                                                <Icon name="twitter"/>
                                                            </List.Item>
                                                            <List.Item as="a">
                                                                <Icon name="facebook"/>
                                                            </List.Item>
                                                        </List>
                                                    </div>
                                                </div>
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="border-top">
            <Grid stretched>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={5} computer={5}>
                        <div className="remove-gutter user-left-menu">
                            <div className="">
                                <List selection verticalAlign='middle'>
                                    <List.Item>
                                        <Image src={frndicon} />
                                        <List.Content>
                                            <List.Header>Find friends</List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item className="active">
                                        <Image src={frndicon} />
                                        <List.Content>
                                            <List.Header>Your friends</List.Header>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={11} computer={11}>
                        <div className="remove-gutter">
                            <div className="userSettingsContainer">
                                <div className="settingsDetailWraper">
                                    <div className="searchbox no-padd">
                                        <Input fluid  placeholder='Find friends on Charitable Impact...' />
                                        <a href="" className="search-btn">
                                            <Icon name="search"/>
                                        </a>
                                    </div>
                                    <Header className="mb-2" as="h4">Invitations  </Header>
                                    <List divided verticalAlign='middle' className="userList pt-1">
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-bordr-btn-round-def c-small">Accept</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-bordr-btn-round-def c-small">Accept</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-bordr-btn-round-def c-small">Accept</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-bordr-btn-round-def c-small">Accept</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/tom.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>

                                    <Header className="mt-3 mb-2" as="h4">Friends  </Header>
                                    <List divided verticalAlign='middle' className="userList pt-1">
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-btn-rounded-def c-small">Message</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-btn-rounded-def c-small">Message</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-btn-rounded-def c-small">Message</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <span className="date"></span>
                                                <Button className="blue-btn-rounded-def c-small">Message</Button>
                                            </List.Content>
                                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/tom.jpg' />
                                            <List.Content>
                                                <List.Header>Daniel Louise</List.Header>
                                                <List.Description>Vancouver, BC</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </div>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
            </div>
        );
    }
}

export default Friends;
