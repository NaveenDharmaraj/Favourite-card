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

import {
    getFriendsByText,
} from '../../../actions/userProfile';

class FindFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            searchWord: '',
        };
        this.handleFriendSearch = this.handleFriendSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
            activePage,
        } = this.state;
        getFriendsByText(dispatch, id, searchWord, activePage);
    }


    renderFriendList() {
        const {
            userFindFriendsList,
        } = this.props;
        let friendsList = 'No Data';
        if (!_.isEmpty(userFindFriendsList)) {
            friendsList = userFindFriendsList.data.map((data) => {
                const name = `${data.attributes.first_name} ${data.attributes.last_name}`;
                const avatar = ((typeof data.attributes.avatar) === 'undefined' || data.attributes.avatar === null) ? 'https://react.semantic-ui.com/images/avatar/small/daniel.jpg' : data.attributes.avatar;
                const location = `${data.attributes.city}, ${data.attributes.province}`;
                let friendStatus = '';
                let btnData = '';
                if (data.attributes.friend_status === '') {
                    friendStatus = 'Add Friend';
                    btnData = 'addfriend';
                } else if (data.attributes.friend_status.toLowerCase() === 'accepted') {
                    friendStatus = 'Message';
                    btnData = 'message';
                } else {
                    friendStatus = 'Accept';
                    btnData = 'accept';
                }
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button className="blue-bordr-btn-round-def c-small">{friendStatus}</Button>
                        </List.Content>
                        <Image avatar src={avatar} />
                        <List.Content>
                            <List.Header>{name}</List.Header>
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
        } = this.state;
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
