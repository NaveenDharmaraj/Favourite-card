import React from 'react';
import _ from 'lodash';
import {
    Button,
    Header,
    Image,
    Input,
    Icon,
    List,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    getMyFriendsList,
} from '../../../actions/userProfile';

class MyFriends extends React.Component {
    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        console.log(currentUser);
        getMyFriendsList(dispatch, currentUser.attributes.email, 1);
    }

    renderMyFriendsList() {
        const {
            userMyFriendsList,
        } = this.props;
        let friendsList = 'No Data';
        if (!_.isEmpty(userMyFriendsList)) {
            friendsList = userMyFriendsList.data.map((friend, index) => {
                const name = `${friend.attributes.first_name} ${friend.attributes.last_name}`;
                const avatar = (typeof friend.attributes.avatar) !== 'undefined' ? friend.attributes.avatar : 'https://react.semantic-ui.com/images/avatar/small/daniel.jpg';
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button className="blue-btn-rounded-def c-small">Message</Button>
                        </List.Content>
                        <Image avatar src={avatar} />
                        <List.Content>
                            <List.Header>{name}</List.Header>
                            <List.Description>Vancouver, BC</List.Description>
                        </List.Content>
                    </List.Item>
                );
            });
        }
        return (
            <List divided verticalAlign="middle" className="userList pt-1">
                {friendsList}
            </List>
        );
    }

    render() {
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <div className="searchbox no-padd">
                            <Input fluid placeholder="Find friends on Charitable Impact..." />
                            <a href="" className="search-btn">
                                <Icon name="search" />
                            </a>
                        </div>
                        <Header className="mb-1" as="h4">Invitations </Header>
                        <List divided verticalAlign='middle' className="userList pt-1">
                            <List.Item>
                                <List.Content floated='right'>
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
                                    <Button className="blue-bordr-btn-round-def c-small">Accept</Button>
                                </List.Content>
                                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/tom.jpg' />
                                <List.Content>
                                    <List.Header>Daniel Louise</List.Header>
                                    <List.Description>Vancouver, BC</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                        <Header className="mb-1 mt-3" as="h4">Friends </Header>
                        {this.renderMyFriendsList()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userMyFriendsList: state.userProfile.userMyFriendsList,
    };
}

export default (connect(mapStateToProps)(MyFriends));
