/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Button,
    Header,
    Image,
    List,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import Link from 'next/link';

import PlaceHolderGrid from '../../shared/PlaceHolder';
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
            currentMyInvitaionsActivePage: 1,
            myFriendInvitationLoader: !props.userFriendsInvitationsList,
            myFriendListLoader: !props.userMyFriendsList,
        };
        this.onMyFriendsPageChanged = this.onMyFriendsPageChanged.bind(this);
        this.onMyFriendsInvitaionsPageChanged = this.onMyFriendsInvitaionsPageChanged.bind(this);
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

    componentDidUpdate(prevProps) {
        const {
            userMyFriendsList,
        } = this.props;
        let {
            myFriendInvitationLoader,
            myFriendListLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userMyFriendsList, prevProps.userMyFriendsList)) {
                myFriendListLoader = false;
            }
            if (!_.isEqual(userMyFriendsList, prevProps.userMyFriendsList)) {
                myFriendInvitationLoader = false;
            }
            this.setState({
                myFriendInvitationLoader,
                myFriendListLoader,
            });
        }
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

    onMyFriendsInvitaionsPageChanged(e, data) {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getFriendsInvitations(dispatch, currentUser.attributes.email, data.activePage);
        this.setState({
            currentMyInvitaionsActivePage: data.activePage,
        });
    }

    handleFriendAcceptClick(email) {
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
        const {
            currentMyInvitaionsActivePage,
        } = this.state;
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
            <Fragment>
                <List divided verticalAlign="middle" className="userList pt-1">
                    {friendsList}
                </List>
                <div className="db-pagination right-align pt-2">
                    {
                        !_.isEmpty(userFriendsInvitationsList) && userFriendsInvitationsList.pageCount > 1 && (
                            <Pagination
                                activePage={currentMyInvitaionsActivePage}
                                totalPages={userFriendsInvitationsList.pageCount}
                                onPageChanged={this.onMyFriendsInvitaionsPageChanged}
                            />
                        )
                    }
                </div>
            </Fragment>
        );
    }

    renderMyFriendsList() {
        const {
            userMyFriendsList,
        } = this.props;
        const {
            currentMyFriendsActivePage,
        } = this.state;
        let friendsList = 'No Data';
        if (!_.isEmpty(userMyFriendsList)) {
            friendsList = userMyFriendsList.data.map((friend) => {
                const name = `${friend.attributes.first_name} ${friend.attributes.last_name}`;
                const email = Buffer.from(friend.attributes.email_hash, 'base64').toString('ascii');
                const location = (typeof friend.attributes.city !== 'undefined') ? `${friend.attributes.city}, ${friend.attributes.province}` : email;
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
                            <List.Description>{location}</List.Description>
                        </List.Content>
                    </List.Item>
                );
            });
        }
        return (
            <Fragment>
                <List divided verticalAlign="middle" className="userList pt-1">
                    {friendsList}
                </List>
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
            </Fragment>
        );
    }

    render() {
        const {
            myFriendInvitationLoader,
            myFriendListLoader,
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <Header className="mb-1" as="h4">Invitations </Header>
                        { myFriendInvitationLoader ? <PlaceHolderGrid row={2} column={2} placeholderType="table" /> : (
                            this.renderFriendsInvitations()
                        )}
                        <div className="pt-2">
                            <Header className="mb-1 mt-3" as="h4">Friends </Header>
                            { myFriendListLoader ? <PlaceHolderGrid row={2} column={2} placeholderType="table" /> : (
                                this.renderMyFriendsList()
                            )}
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
