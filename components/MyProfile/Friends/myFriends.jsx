/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Header,
    Image,
    List,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    getMyFriendsList,
    getFriendsInvitations,
} from '../../../actions/userProfile';

class MyFriends extends React.Component {
    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getMyFriendsList(dispatch, currentUser.attributes.email, 1);
        getFriendsInvitations(dispatch, currentUser.attributes.email, 1);
    }

    renderFriendsInvitations() {
        const {
            userFriendsInvitationsList,
        } = this.props;
        let friendsList = 'No Data';
        if (!_.isEmpty(userFriendsInvitationsList)) {
            friendsList = userFriendsInvitationsList.data.map((friend) => {
                const name = `${friend.attributes.first_name} ${friend.attributes.last_name}`;
                const avatar = ((typeof friend.attributes.avatar) === 'undefined' || friend.attributes.avatar === null) ? 'https://react.semantic-ui.com/images/avatar/small/daniel.jpg' : friend.attributes.avatar;
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button className="blue-bordr-btn-round-def c-small">Accept</Button>
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

    renderMyFriendsList() {
        const {
            userMyFriendsList,
        } = this.props;
        let friendsList = 'No Data';
        if (!_.isEmpty(userMyFriendsList)) {
            friendsList = userMyFriendsList.data.map((friend) => {
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
                        <Header className="mb-1" as="h4">Invitations </Header>
                        {this.renderFriendsInvitations()}
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
        userFriendsInvitationsList: state.userProfile.userFriendsInvitationsList,
        userMyFriendsList: state.userProfile.userMyFriendsList,
    };
}

export default (connect(mapStateToProps)(MyFriends));
