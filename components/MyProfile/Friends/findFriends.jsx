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
import Link from 'next/link';

import {
    acceptFriendRequest,
    getFriendsByText,
    sendFriendRequest,
} from '../../../actions/userProfile';
import Pagination from '../../shared/Pagination';
import NoFriendAvatar from '../../../static/images/no-data-avatar-user-profile.png';

class FindFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentActivePage: 1,
            paginationCount: 1,
            searchWord: '',
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
        getFriendsByText(dispatch, id, searchWord, currentActivePage);
    }

    handleAddFriendClick(userData, btnData) {
        const {
            currentUser: {
                id,
                attributes,
            },
            dispatch,
        } = this.props;
        const {
            currentActivePage,
            searchWord,
        } = this.state;
        if (btnData === 'addfriend') {
            sendFriendRequest(dispatch, id, userData.attributes.email_hash, searchWord, currentActivePage);
        } else if (btnData === 'accept') {
            acceptFriendRequest(dispatch, id, userData.attributes.email_hash, currentActivePage, attributes.email, 'FINDFRIENDS', searchWord);
        }
    }

    renderFriendList() {
        const {
            userFindFriendsList,
        } = this.props;
        let friendsList = 'No Data';
        if (!_.isEmpty(userFindFriendsList)) {
            friendsList = userFindFriendsList.data.map((data) => {
                const name = `${data.attributes.first_name} ${data.attributes.last_name}`;
                const avatar = ((typeof data.attributes.avatar) === 'undefined' || data.attributes.avatar === null) ? NoFriendAvatar : data.attributes.avatar;
                const email = Buffer.from(data.attributes.email_hash, 'base64').toString('ascii');
                const location = (typeof data.attributes.city === 'undefined' || data.attributes.province === '') ? email : `${data.attributes.city}, ${data.attributes.province}`;
                let btnClass = 'blue-bordr-btn-round-def c-small';
                let friendStatus = '';
                let btnData = '';
                if (data.attributes.friend_status === '') {
                    friendStatus = 'Add Friend';
                    btnData = 'addfriend';
                } else if (data.attributes.friend_status.toLowerCase() === 'accepted') {
                    friendStatus = 'Message';
                    btnData = 'message';
                    btnClass = 'blue-btn-rounded-def c-small';
                } else {
                    friendStatus = 'Accept';
                    btnData = 'accept';
                }
                console.log(data.attributes.first_name + data.attributes.friend_status);
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button
                                className={btnClass}
                                onClick={() => this.handleAddFriendClick(data, btnData)}
                            >
                                {friendStatus}
                            </Button>
                        </List.Content>
                        <Image avatar src={avatar} />
                        <List.Content>
                            <List.Header>
                                <Link className="lnkChange" href={`/users/profile/${data.attributes.user_id}`}>
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


    render() {
        const {
            searchWord,
            currentActivePage,
            paginationCount,
        } = this.state;
        const {
            userFindFriendsList,
        } = this.props;
        // co
        // if(!_.isEmpty(userFindFriendsList)) {
        //     paginationCount = Math.round(userFindFriendsList.count / 10);
        // }
        // console.log(paginationCount);
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <div className="searchbox no-padd">
                            <Input
                                fluid
                                placeholder="Find friends on Charitable Impact..."
                                onChange={this.handleInputChange}
                                value={searchWord}
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
