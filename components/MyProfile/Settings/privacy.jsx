import React from 'react';
import {
    Button,
    Container,
    Header,
    Radio,
    Image,
    Responsive,
    Tab,
    Form,
    Input,
    Modal,
    Icon,
    Popup,
    Grid,
    List,
    Checkbox,
    Dropdown,
    Pagination,
    CardContent,
  } from 'semantic-ui-react'

class Privacy extends React.Component {
    render() {
        return (
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
        );
    }
}

export default Privacy;