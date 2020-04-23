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
import dynamic from 'next/dynamic';

import {
    getBlockedFriends,
    unblockFriend,
    updateUserPreferences,
} from '../../../actions/userProfile';
import PlaceHolderGrid from '../../shared/PlaceHolder';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});

class Privacy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
            blockedUserListLoader: !props.userBlockedFriendsList,
            discoverability: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.discoverability : false,
            errorMessage: null,
            statusMessage: false,
            successMessage: '',
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
        this.setState({
            buttonClicked: true,
            statusMessage: false,
        });
        if (userId !== null) {
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            unblockFriend(dispatch, id, userId).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'User unblocked.',
                    statusMessage: true,
                    buttonClicked: false,
                });
            }).catch((err) => {
                this.setState({
                    errorMessage: 'Error in Unblocking user.',
                    statusMessage: true,
                    buttonClicked: false,
                });
            });
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
        const {
            buttonClicked,
        } = this.state;
        let friendsBlockedList = 'Users you block will appear here.';
        if (!_.isEmpty(userBlockedFriendsList) && _.size(userBlockedFriendsList.data) > 0) {
            friendsBlockedList = userBlockedFriendsList.data.map((data) => {
                const name = `${data.attributes.first_name} ${data.attributes.last_name}`;
                const avatar = ((typeof data.attributes.avatar) === 'undefined' || data.attributes.avatar === null) ? 'https://react.semantic-ui.com/images/avatar/small/daniel.jpg' : data.attributes.avatar;
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
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Button
                                className="blue-bordr-btn-round-def c-small"
                                onClick={() => this.handleFriendUnblockClick(data.attributes.user_id)}
                                disabled={buttonClicked}
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
                            <List.Description>{locationDetails}</List.Description>
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
            errorMessage,
            statusMessage,
            successMessage,
            blockedUserListLoader,
            discoverability,
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                        <div className="settingsDetailWraper">
                            <Header as="h4">Discoverability </Header>
                             <p>Choose whether people can search for your personal profile on Charitable Impact.</p>
                        </div>
                        <div className="settingsDetailWraper">
                            <List divided verticalAlign="middle" className="userList">
                                <List.Item>
                                    <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox right"
                                        id="discoverability"
                                        name="discoverability"
                                        checked={discoverability}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                    </List.Content>
                                    <List.Content>
                                    <List.Description>
                                        Show name and appear in search results
                                    </List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">Blocked users</Header>
                        {
                            statusMessage && (
                                <div className="mt-1 mb-2">
                                    <ModalStatusMessage 
                                        message = {!_.isEmpty(successMessage) ? successMessage : null}
                                        error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                                    />
                                </div>
                            )
                        }
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
