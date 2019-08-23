import React from 'react';
import {
    Button,
    Header,
    Image,
    Input,
    Icon,
    List,
} from 'semantic-ui-react';

class FindFriends extends React.Component {
    render() {
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <div className="searchbox no-padd">
                            <Input fluid  placeholder='Find friends on Charitable Impact...' />
                            <a href="" className="search-btn">
                                <Icon name="search"/>
                            </a>
                        </div>
                        <Header className="mb-2" as="h4">Add friends </Header>
                        <List divided verticalAlign='middle' className="userList pt-1">
                            <List.Item>
                                <List.Content floated='right'>
                                    <span className="date">21 mutual friends</span>
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
                                </List.Content>
                                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                                <List.Content>
                                    <List.Header>Daniel Louise</List.Header>
                                    <List.Description>Vancouver, BC</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated='right'>
                                    <span className="date">18 mutual friends</span>
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
                                </List.Content>
                                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
                                <List.Content>
                                    <List.Header>Daniel Louise</List.Header>
                                    <List.Description>Vancouver, BC</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated='right'>
                                    <span className="date">2 mutual friends</span>
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
                                </List.Content>
                                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                <List.Content>
                                    <List.Header>Daniel Louise</List.Header>
                                    <List.Description>Vancouver, BC</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated='right'>
                                    <span className="date">1 mutual friend</span>
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
                                </List.Content>
                                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/tom.jpg' />
                                <List.Content>
                                    <List.Header>Daniel Louise</List.Header>
                                    <List.Description>Vancouver, BC</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated='right'>
                                    <span className="date"></span>
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
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
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
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
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
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
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
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
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
                                </List.Content>
                                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/tom.jpg' />
                                <List.Content>
                                    <List.Header>Daniel Louise</List.Header>
                                    <List.Description>Vancouver, BC</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated='right'>
                                    <span className="date"></span>
                                    <Button className="blue-bordr-btn-round-def c-small">Add friend</Button>
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

export default FindFriends;
