/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Header,
    Image,
    List,
    Checkbox,
    Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import Link from 'next/link';

import {
    getBlockedFriends,
    unblockFriend,
    updateUserPreferences,
} from '../../../actions/userProfile';
import PlaceHolderGrid from '../../shared/PlaceHolder';

class Privacy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blockedUserListLoader: !props.userBlockedFriendsList,
            discoverability: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.discoverability : false,
        };
        this.handleUserPreferenceChange = this.handleUserPreferenceChange.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getBlockedFriends(dispatch, id);
    }

    componentDidUpdate(prevProps) {
        const {
            userBlockedFriendsList,
        } = this.props;
        let {
            blockedUserListLoader,
        } = this.state;
        if (!_.isEqual(userBlockedFriendsList, prevProps.userBlockedFriendsList)) {
            blockedUserListLoader = false;
            this.setState({ blockedUserListLoader });
        }
    }

    handleFriendUnblockClick(userId) {
        if (userId !== null) {
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            unblockFriend(dispatch, id, userId);
        }
    }

    handleUserPreferenceChange(event, data) {
        const {
            checked,
            name,
        } = data;
        const {
            currentUser,
            dispatch,
        } = this.props;
        this.setState({ [name]: checked });
        const columnName = 'discoverability';
        updateUserPreferences(dispatch, currentUser.id, columnName, checked, null);
    }

    renderBlockedFriendsList() {
        const {
            userBlockedFriendsList,
        } = this.props;
        let friendsBlockedList = 'Users you block will appear here.';
        if (!_.isEmpty(userBlockedFriendsList) && _.size(userBlockedFriendsList.data) > 0) {
            friendsBlockedList = userBlockedFriendsList.data.map((data) => {
                const name = `${data.attributes.first_name} ${data.attributes.last_name}`;
                const avatar = ((typeof data.attributes.avatar) === 'undefined' || data.attributes.avatar === null) ? 'https://react.semantic-ui.com/images/avatar/small/daniel.jpg' : data.attributes.avatar;
                const email = Buffer.from(data.attributes.email_hash, 'base64').toString('ascii');
                const location = (typeof data.attributes.city !== 'undefined') ? `${data.attributes.city}, ${data.attributes.province}` : email;
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button
                                className="blue-bordr-btn-round-def c-small"
                                onClick={() => this.handleFriendUnblockClick(data.attributes.user_id)}
                            >
                                Unblock
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
            <List divided verticalAlign="middle" className="userList">
                {friendsBlockedList}
            </List>
        );
    }

    render() {
        const {
            blockedUserListLoader,
            discoverability,
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <Header as="h4">
                            Discoverability
                            <Checkbox
                                toggle
                                className="c-chkBox right"
                                id="discoverability"
                                name="discoverability"
                                checked={discoverability}
                                onChange={this.handleUserPreferenceChange}
                            />
                        </Header>
                        <p>
                            You can manage your discoverability settings -manage
                            whether you show up on searches or your
                            name appears on Giving Group profiles.
                        </p>
                    </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">Blocked users</Header>
                        { blockedUserListLoader
                            ? (
                                <Table padded unstackable className="no-border-table">
                                    <PlaceHolderGrid row={2} column={2} placeholderType="table" />
                                </Table>
                            )
                            : (
                                this.renderBlockedFriendsList()
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userBlockedFriendsList: state.userProfile.userBlockedFriendsList,
    };
}

export default (connect(mapStateToProps)(Privacy));
