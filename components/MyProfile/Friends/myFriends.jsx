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
import Link from 'next/link';

import {
    acceptFriendRequest,
    getMyFriendsList,
    getFriendsInvitations,
} from '../../../actions/userProfile';
import Pagination from '../../shared/Pagination';

class MyFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMyFriendsActivePage: 1,
        };
        this.onMyFriendsPageChanged = this.onMyFriendsPageChanged.bind(this);
        this.handleFriendAcceptClick = this.handleFriendAcceptClick.bind(this);
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getMyFriendsList(dispatch, currentUser.attributes.email, 1);
        getFriendsInvitations(dispatch, currentUser.attributes.email, 1);
    }

    onMyFriendsPageChanged(e, data) {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getMyFriendsList(dispatch, currentUser.attributes.email, data.activePage);
        this.setState({
            currentMyFriendsActivePage: data.activePage,
        });
    }

    handleFriendAcceptClick(email) {
        console.log(email);
        if (email !== null) {
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            acceptFriendRequest(dispatch, id, email);
        }
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
                const email = Buffer.from(friend.attributes.email_hash, 'base64').toString('ascii');
                const location = (typeof friend.attributes.city === 'undefined' || friend.attributes.province === '') ? email : `${friend.attributes.city}, ${friend.attributes.province}`;
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button
                                className="blue-bordr-btn-round-def c-small"
                                onClick={() => this.handleFriendAcceptClick(friend.attributes.email_hash)}
                            >
                                Accept
                            </Button>
                        </List.Content>
                        <Image avatar src={avatar} />
                        <List.Content>
                            <List.Header>
                                <Link className="lnkChange" href={`/users/profile/${friend.attributes.user_id}`}>
                                    {name}
                                </Link>
                            </List.Header>
                            <List.Description>{location}</List.Description>
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
                            <List.Header>
                                <Link className="lnkChange" href={`/users/profile/${friend.attributes.user_id}`}>
                                    {name}
                                </Link>
                            </List.Header>
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
        const {
            userMyFriendsList,
        } = this.props;
        const {
            currentMyFriendsActivePage,
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <Header className="mb-1" as="h4">Invitations </Header>
                        {this.renderFriendsInvitations()}
                        <Header className="mb-1 mt-3" as="h4">Friends </Header>
                        {this.renderMyFriendsList()}
                        <div className="db-pagination right-align pt-2">
                        {
                            !_.isEmpty(userMyFriendsList) && userMyFriendsList.pageCount > 1 && (
                                <Pagination
                                    activePage={currentMyFriendsActivePage}
                                    totalPages={userMyFriendsList.pageCount}
                                    onPageChanged={this.onMyFriendsPageChanged}
                                />
                            )
                        }
                        </div>
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
