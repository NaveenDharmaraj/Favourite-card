/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Image,
    Input,
    Icon,
    List,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';

import {
    acceptFriendRequest,
    getFriendsByText,
    sendFriendRequest,
} from '../../../actions/userProfile';
import { Link } from '../../../routes';
import Pagination from '../../shared/Pagination';
import NoFriendAvatar from '../../../static/images/no-data-avatar-user-profile.png';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});
import { Router } from '../../../routes';

class FindFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentActivePage: 1,
            buttonClicked: false,
            errorMessage: null,
            paginationCount: 1,
            searchWord: '',
            statusMessage: false,
            successMessage: '',
        };
        this.handleFriendSearch = this.handleFriendSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onPageChanged = this.onPageChanged.bind(this);
        this.handleAddFriendClick = this.handleAddFriendClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            userFindFriendsList,
        } = this.props;
        const {
            paginationCount,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userFindFriendsList, prevProps.userFindFriendsList)) {
                this.setState({
                    paginationCount: Math.round(userFindFriendsList.count / 10),
                });
            }
        }
    }

    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
            },
            type: 'USER_PROFILE_FIND_FRIENDS',
        });
    }

    onPageChanged(e, data) {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const {
            searchWord,
        } = this.state;
        getFriendsByText(dispatch, id, searchWord, data.activePage);
        this.setState({
            currentActivePage: data.activePage,
        });
    }

    handleInputChange(event) {
        const {
            target: {
                value,
            },
        } = event;
        this.setState({
            searchWord: value,
        });
    }

    handleFriendSearch() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const {
            searchWord,
            currentActivePage,
        } = this.state;
        this.setState({ currentActivePage: 1 });
        getFriendsByText(dispatch, id, searchWord, currentActivePage);
    }

    handleAddFriendClick(userData, btnData) {
        this.setState({
            buttonClicked: true,
            statusMessage: false,
        });
        const {
            currentUser: {
                id,
                attributes: {
                    avatar,
                    email,
                    firstName,
                },
            },
            dispatch,
            userFindFriendsList,
        } = this.props;
        const {
            currentActivePage,
            searchWord,
        } = this.state;
        if (btnData === 'addfriend') {
            sendFriendRequest(dispatch, id, email, avatar, firstName, userData, searchWord, currentActivePage, userFindFriendsList).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'Add Friend request sent successfully.',
                    statusMessage: true,
                    buttonClicked: false,
                });
            }).catch((err) => {
                this.setState({
                    errorMessage: 'Error in sending the friend request.',
                    statusMessage: true,
                    buttonClicked: false,
                });
            });
        } else if (btnData === 'accept') {
            acceptFriendRequest(dispatch, id, email, avatar, firstName, userData.attributes.email_hash, userData.attributes.user_id, currentActivePage, 'FINDFRIENDS', searchWord).then(() => {
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
        } else if(btnData === 'message') {
            Router.pushRoute(`/chats/${userData.attributes.user_id}`);
        }
    }

    renderFriendList() {
        const {
            userFindFriendsList,
        } = this.props;
        const {
            buttonClicked,
        } = this.state;
        let friendsList = '';
        if (!_.isEmpty(userFindFriendsList)) {
            friendsList = userFindFriendsList.data.map((data) => {
                const name = `${data.attributes.first_name} ${data.attributes.last_name}`;
                const avatar = ((typeof data.attributes.avatar) === 'undefined' || data.attributes.avatar === null) ? NoFriendAvatar : data.attributes.avatar;
                let locationDetails = '';
                const locationDetailsCity = (!_.isEmpty(data.attributes.city)) && data.attributes.city !== 'null' ? data.attributes.city : '';
                const locationDetailsProvince = (!_.isEmpty(data.attributes.province)) && data.attributes.province !== 'null' ? data.attributes.province : '';
                if (locationDetailsCity === '' && locationDetailsProvince !== '') {
                    locationDetails = locationDetailsProvince;
                } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
                    locationDetails = locationDetailsCity;
                } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
                    locationDetails = `${data.attributes.city}, ${data.attributes.province}`;
                }                
                let btnClass = 'blue-bordr-btn-round-def c-small';
                let friendStatus = '';
                let btnData = '';
                let isButtonDisabled = false;
                if (data.attributes.friend_status === '') {
                    friendStatus = 'Add Friend';
                    btnData = 'addfriend';
                } else if (data.attributes.friend_status.toLowerCase() === 'accepted') {
                    friendStatus = 'Message';
                    btnData = 'message';
                    btnClass = 'blue-btn-rounded-def c-small';
                } else if (data.attributes.friend_status.toLowerCase() === 'pending_out') {
                    friendStatus = 'Pending';
                    btnData = 'pendingout';
                    isButtonDisabled = true;
                } else if (data.attributes.friend_status.toLowerCase() === 'blocked') {
                    friendStatus = 'Blocked';
                    btnData = 'blocked';
                    isButtonDisabled = true;
                } else {
                    friendStatus = 'Accept';
                    btnData = 'accept';
                }
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button
                                className={btnClass}
                                onClick={() => this.handleAddFriendClick(data, btnData)}
                                disabled={buttonClicked || isButtonDisabled}
                            >
                                {friendStatus}
                            </Button>
                        </List.Content>
                        <Image avatar src={avatar} />
                        <List.Content>
                            <List.Header>
                                <Link className="lnkChange" route={`/users/profile/${data.attributes.user_id}`}>
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
            <List divided verticalAlign="middle" className="userList pt-1">
                {friendsList}
            </List>
        );
    }


    render() {
        const {
            errorMessage,
            statusMessage,
            successMessage,
            searchWord,
            currentActivePage,
            paginationCount,
        } = this.state;
        const {
            userFindFriendsList,
        } = this.props;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <div className="searchbox no-padd">
                            <Input
                                fluid
                                placeholder="Find friends already on Charitable Impact"
                                onChange={this.handleInputChange}
                                value={searchWord}
                                onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleFriendSearch() : null; }}
                            />
                            <a
                                className="search-btn"
                            >
                                <Icon
                                    name="search"
                                    onClick={this.handleFriendSearch}
                                />
                            </a>
                        </div>
                        {
                            statusMessage && (
                                <div className="mt-1">
                                    <ModalStatusMessage 
                                        message = {!_.isEmpty(successMessage) ? successMessage : null}
                                        error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                                    />
                                </div>
                            )
                        }
                        {this.renderFriendList()}
                        <div className="db-pagination right-align pt-2">
                            {
                                !_.isEmpty(userFindFriendsList) && paginationCount > 1 && (
                                    <Pagination
                                        activePage={currentActivePage}
                                        totalPages={paginationCount}
                                        onPageChanged={this.onPageChanged}
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
        userFindFriendsList: state.userProfile.userFindFriendsList,
    };
}

export default (connect(mapStateToProps)(FindFriends));
