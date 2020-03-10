/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Button,
    Header,
    Image,
    List,
    Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';

import PlaceHolderGrid from '../../shared/PlaceHolder';
import { Link } from '../../../routes';
import {
    acceptFriendRequest,
    getMyFriendsList,
    getFriendsInvitations,
} from '../../../actions/userProfile';
import Pagination from '../../shared/Pagination';
import NoFriendAvatar from '../../../static/images/no-data-avatar-user-profile.png';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});

class MyFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
            currentMyFriendsActivePage: 1,
            currentMyInvitaionsActivePage: 1,
            errorMessage: null,
            myFriendInvitationLoader: !props.userFriendsInvitationsList,
            myFriendListLoader: !props.userMyFriendsList,
            statusMessage: false,
            successMessage: '',
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

    handleFriendAcceptClick(destinationEmail, destinationUserId) {
        this.setState({
            buttonClicked: true,
            statusMessage: false,
        });
        if (destinationEmail !== null) {
            const {
                currentUser: {
                    id,
                    attributes: {
                        avatar,
                        email,
                        firstName,
                        displayName,
                    },
                },
                dispatch,
            } = this.props;
            const {
                currentMyInvitaionsActivePage,
            } = this.state;
            acceptFriendRequest(dispatch, id, email, avatar, firstName, displayName, destinationEmail, destinationUserId, currentMyInvitaionsActivePage, 'MYFRIENDS', null).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'Friend request accepted successfully.',
                    statusMessage: true,
                    buttonClicked: false,
                });
            }).catch((err) => {
                this.setState({
                    errorMessage: 'Error in accepting friend request.',
                    statusMessage: true,
                    buttonClicked: false,
                });
            });
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
    }

    renderFriendsInvitations() {
        const {
            userFriendsInvitationsList,
        } = this.props;
        const {
            currentMyInvitaionsActivePage,
            buttonClicked,
        } = this.state;
        let friendsList = 'No invitations yet ';
        if (!_.isEmpty(userFriendsInvitationsList) && _.size(userFriendsInvitationsList.data) > 0) {
            friendsList = userFriendsInvitationsList.data.map((friend) => {
                const name = `${friend.attributes.first_name} ${friend.attributes.last_name}`;
                const avatar = ((typeof friend.attributes.avatar) === 'undefined' || friend.attributes.avatar === null) ? NoFriendAvatar : friend.attributes.avatar;
                let locationDetails = '';
                const locationDetailsCity = (!_.isEmpty(friend.attributes.city)) && friend.attributes.city !== 'null' ? friend.attributes.city : '';
                const locationDetailsProvince = (!_.isEmpty(friend.attributes.province)) && friend.attributes.province !== 'null' ? friend.attributes.province : '';
                if (locationDetailsCity === '' && locationDetailsProvince !== '') {
                    locationDetails = locationDetailsProvince;
                } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
                    locationDetails = locationDetailsCity;
                } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
                    locationDetails = `${friend.attributes.city}, ${friend.attributes.province}`;
                }
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button
                                className="blue-bordr-btn-round-def c-small"
                                onClick={() => this.handleFriendAcceptClick(friend.attributes.email_hash, friend.attributes.user_id)}
                                disabled={buttonClicked}
                            >
                                Accept
                            </Button>
                        </List.Content>
                        <Image avatar src={avatar} />
                        <List.Content>
                            <List.Header>
                                <Link className="lnkChange" route={`/users/profile/${friend.attributes.user_id}`}>
                                    {name}
                                </Link>
                            </List.Header>
                            <List.Description>{locationDetails}</List.Description>
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
        let friendsList = 'Friends you connect with on Charitable Impact will appear here.';
        if (!_.isEmpty(userMyFriendsList) && _.size(userMyFriendsList.data) > 0) {
            friendsList = userMyFriendsList.data.map((friend) => {
                const name = `${friend.attributes.first_name} ${friend.attributes.last_name}`;                
                let locationDetails = '';
                const locationDetailsCity = (!_.isEmpty(friend.attributes.city)) && friend.attributes.city !== 'null' ? friend.attributes.city : '';
                const locationDetailsProvince = (!_.isEmpty(friend.attributes.province)) && friend.attributes.province !== 'null' ? friend.attributes.province : '';
                if (locationDetailsCity === '' && locationDetailsProvince !== '') {
                    locationDetails = locationDetailsProvince;
                } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
                    locationDetails = locationDetailsCity;
                } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
                    locationDetails = `${friend.attributes.city}, ${friend.attributes.province}`;
                }
                const avatar = (typeof friend.attributes.avatar) !== 'undefined' ? friend.attributes.avatar : NoFriendAvatar;
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Link route={`/chats/${friend.attributes.user_id}`}>
                                <Button className="blue-btn-rounded-def c-small">Message</Button>
                            </Link>
                        </List.Content>
                        <Image avatar src={avatar} />
                        <List.Content>
                            <List.Header>
                                <Link className="lnkChange" route={`/users/profile/${friend.attributes.user_id}`}>
                                    {name}
                                </Link>
                            </List.Header>
                            <List.Description>{locationDetails}</List.Description>
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
            errorMessage,
            statusMessage,
            successMessage,
            myFriendInvitationLoader,
            myFriendListLoader,
        } = this.state;
        const {
            userFriendsInvitationsList
        } = this.props;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        {
                            statusMessage && (
                                <div>
                                    <ModalStatusMessage 
                                        message = {!_.isEmpty(successMessage) ? successMessage : null}
                                        error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                                    />
                                </div>
                            )
                        }
                        {
                            !_.isEmpty(userFriendsInvitationsList) && _.size(userFriendsInvitationsList.data) > 0 && (
                                <div className="pt-2 mb-2">
                                    <Header className="mb-1" as="h4">Invitations </Header>
                                    <div>
                                    { myFriendInvitationLoader
                                        ? (
                                            <Table padded unstackable className="no-border-table">
                                                <PlaceHolderGrid row={2} column={2} placeholderType="table" />
                                            </Table>
                                        )
                                        : (
                                            this.renderFriendsInvitations()
                                        )}
                                    </div>
                                </div>
                            )
                        }
                        <div>
                            <Header className="mb-1 mt-1" as="h4">Friends </Header>
                            { myFriendListLoader
                                ? (
                                    <Table padded unstackable className="no-border-table">
                                        <PlaceHolderGrid row={2} column={2} placeholderType="table" />
                                    </Table>
                                )
                                : (
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
