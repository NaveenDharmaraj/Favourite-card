/* eslint-disable react/prop-types */
import React from 'react';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import {
    Button,
    Header,
    Image,
    List,
    Checkbox,
    Table,
    Form,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { withTranslation } from '../../../i18n';

import {
    getBlockedFriends,
    unblockFriend,
    updateUserPreferences,
    savePrivacySetting,
    updateUserProfileToastMsg,
} from '../../../actions/userProfile';
import PlaceHolderGrid from '../../shared/PlaceHolder';
import { fullMonthNames } from '../../../helpers/give/utils';

class Privacy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blockedUserListLoader: !props.userBlockedFriendsList,
            currentButtonClicked: null,
            discoverability: (!_isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.discoverability : false,
            privacyValues: {
                friends_visibility: '',
                giving_goal_visibility: '',
                causes_visibility: '',
                giving_group_manage_visibility: '',
                giving_group_member_visibility: '',
                favourites_visibility: '',
            },
        };
        this.handleUserPreferenceChange = this.handleUserPreferenceChange.bind(this);
        this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
        this.renderBlockedDate = this.renderBlockedDate.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: currentUserId,
            },
            dispatch,
            userProfileBasicData,
        } = this.props;
        dispatch(getBlockedFriends(currentUserId));
        if (!_isEmpty(userProfileBasicData)) {
            this.setState({
                privacyValues: {
                    friends_visibility: userProfileBasicData.data[0].attributes.friends_visibility,
                    giving_goal_visibility: userProfileBasicData.data[0].attributes.giving_goal_visibility,
                    causes_visibility: userProfileBasicData.data[0].attributes.causes_visibility,
                    giving_group_manage_visibility: userProfileBasicData.data[0].attributes.giving_group_manage_visibility,
                    giving_group_member_visibility: userProfileBasicData.data[0].attributes.giving_group_member_visibility,
                    favourites_visibility: userProfileBasicData.data[0].attributes.favourites_visibility,
                }
            })
        }
    }

    componentDidUpdate(prevProps) {
        const {
            userBlockedFriendsList,
            userProfileBasicData,
            userFriendProfileData,
        } = this.props;
        let {
            blockedUserListLoader,
        } = this.state;
        if (!_isEqual(userBlockedFriendsList, prevProps.userBlockedFriendsList)) {
            blockedUserListLoader = false;
            this.setState({ blockedUserListLoader });
        }
        if (!_isEqual(userProfileBasicData, prevProps.userProfileBasicData)) {
            this.setState({
                privacyValues: {
                    friends_visibility: userProfileBasicData.data[0].attributes.friends_visibility,
                    giving_goal_visibility: userProfileBasicData.data[0].attributes.giving_goal_visibility,
                    causes_visibility: userProfileBasicData.data[0].attributes.causes_visibility,
                    giving_group_manage_visibility: userProfileBasicData.data[0].attributes.giving_group_manage_visibility,
                    giving_group_member_visibility: userProfileBasicData.data[0].attributes.giving_group_member_visibility,
                    favourites_visibility: userProfileBasicData.data[0].attributes.favourites_visibility,
                }
            });
        }
        if (!_isEqual(userFriendProfileData, prevProps.userFriendProfileData)) {
            this.setState({
                privacyValues: {
                    friends_visibility: userFriendProfileData.attributes.friends_visibility,
                    giving_goal_visibility: userFriendProfileData.attributes.giving_goal_visibility,
                    causes_visibility: userFriendProfileData.attributes.causes_visibility,
                    giving_group_manage_visibility: userFriendProfileData.attributes.giving_group_manage_visibility,
                    giving_group_member_visibility: userFriendProfileData.attributes.giving_group_member_visibility,
                    favourites_visibility: userFriendProfileData.attributes.favourites_visibility,
                }
            });
        }
    }

    handleFriendUnblockClick(userId) {
        this.setState({
            currentButtonClicked: userId,
        });
        if (userId !== null) {
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            unblockFriend(dispatch, id, userId).then(() => {
                const statusMessageProps = {
                    message: 'User unblocked.',
                    type: 'success',
                };
                dispatch(updateUserProfileToastMsg(statusMessageProps));
                this.setState({
                    currentButtonClicked: null,
                });
            }).catch((err) => {
                const statusMessageProps = {
                    message: 'Error in Unblocking user.',
                    type: 'error',
                };
                dispatch(updateUserProfileToastMsg(statusMessageProps));
                this.setState({
                    currentButtonClicked: null,
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

    renderBlockedDate(milliSeconds) {
        const {
            i18n: {
                language,
            },
            t: formatMessage,
        } = this.props;
        const date = new Date(milliSeconds);
        const year = date.getFullYear();
        const day = date.getDate();
        const month = date.getMonth();
        const months = fullMonthNames(formatMessage);
        return (language === 'fr')
            ? `Blocked on ${day}er ${months[month]} ${year}`
            : `Blocked on ${months[month]} ${day}, ${year}`;
    }
    renderBlockedFriendsList() {
        const {
            userBlockedFriendsList,
        } = this.props;
        const {
            currentButtonClicked,
        } = this.state;
        let friendsBlockedList = 'Users you block will appear here.';
        if (!_isEmpty(userBlockedFriendsList) && _size(userBlockedFriendsList.data) > 0) {
            friendsBlockedList = userBlockedFriendsList.data.map((data) => {
                const name = `${data.attributes.first_name} ${data.attributes.last_name}`;
                const avatar = ((typeof data.attributes.avatar) === 'undefined' || data.attributes.avatar === null) ? 'https://react.semantic-ui.com/images/avatar/small/daniel.jpg' : data.attributes.avatar;
                let locationDetails = '';
                const locationDetailsCity = (!_isEmpty(data.attributes.city)) && data.attributes.city !== 'null' ? data.attributes.city : '';
                const locationDetailsProvince = (!_isEmpty(data.attributes.province)) && data.attributes.province !== 'null' ? data.attributes.province : '';
                if (locationDetailsCity === '' && locationDetailsProvince !== '') {
                    locationDetails = locationDetailsProvince;
                } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
                    locationDetails = locationDetailsCity;
                } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
                    locationDetails = `${data.attributes.city}, ${data.attributes.province}`;
                }
                return (
                    <List.Item>
                        <List.Content floated="right" className='blockDateSec'>
                            <span>{!_isEmpty(data.attributes.relationship_created_on) && this.renderBlockedDate(data.attributes.relationship_created_on)}</span>
                            <Button
                                className="blue-bordr-btn-round-def c-small"
                                onClick={() => this.handleFriendUnblockClick(data.attributes.user_id)}
                                disabled={currentButtonClicked === data.attributes.user_id}
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

    handlePrivacyChange(event, data) {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: userId,
            },
            dispatch,
        } = this.props;
        const {
            id: fieldName,
            value,
        } = data;
        savePrivacySetting(dispatch, userId, email, fieldName, value);
    }

    render() {
        const {
            blockedUserListLoader,
            discoverability,
            privacyValues: {
                friends_visibility,
                giving_goal_visibility,
                causes_visibility,
                giving_group_manage_visibility,
                giving_group_member_visibility,
                favourites_visibility,
            },
        } = this.state;
        const options = [
            { key: 'Public', text: 'Public', value: 0 },
            { key: 'Friends', text: 'Friends', value: 1 },
            { key: 'Only me', text: 'Only me', value: 2 },
        ]
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div class="settingsDetailWraper heading"><h4 class="ui header mb-0">Privacy & security </h4></div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">Discoverability </Header>
                        <p>Choose whether people can search for your personal profile on Charitable Impact.</p>
                        <List divided verticalAlign="middle" className="userList shownamecheck">
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
                    <div className="settingsDetailWraper privacyWraper ">
                        <Header as="h4">Profile settings</Header>
                        <p>Choose what to share on your personal profile.</p>
                        <div className='privacyDropdown'>
                            <label>Your friends list</label>
                            <Form.Select
                                options={options}
                                placeholder='Text entered'
                                id='friends_visibility'
                                onChange={this.handlePrivacyChange}
                                value={friends_visibility}
                            />
                        </div>
                        <div className='privacyDropdown'>
                            <label>Giving goal</label>
                            <Form.Select
                                options={options}
                                placeholder='Text entered'
                                id='giving_goal_visibility'
                                onChange={this.handlePrivacyChange}
                                value={giving_goal_visibility}
                            />
                        </div>
                        <div className='privacyDropdown'>
                            <label>Causes</label>
                            <Form.Select
                                options={options}
                                placeholder='Text entered'
                                id='causes_visibility'
                                onChange={this.handlePrivacyChange}
                                value={causes_visibility}
                            />
                        </div>
                        <div className='privacyDropdown'>
                            <label>Managed Giving Groups</label>
                            <Form.Select
                                options={options}
                                placeholder='Text entered'
                                id='giving_group_manage_visibility'
                                onChange={this.handlePrivacyChange}
                                value={giving_group_manage_visibility}
                            />
                        </div>
                        <div className='privacyDropdown'>
                            <label>Joined Giving Groups</label>
                            <Form.Select
                                options={options}
                                placeholder='Text entered'
                                id='giving_group_member_visibility'
                                onChange={this.handlePrivacyChange}
                                value={giving_group_member_visibility}
                            />
                        </div>
                        <div className='privacyDropdown'>
                            <label>Favourites</label>
                            <Form.Select
                                options={options}
                                placeholder='Text entered'
                                id='favourites_visibility'
                                onChange={this.handlePrivacyChange}
                                value={favourites_visibility}
                            />
                        </div>
                    </div>
                    <div className="settingsDetailWraper privacyWraper">
                        <Header as="h4">Blocked users</Header>
                        {blockedUserListLoader
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
        userProfileBasicData: state.userProfile.userProfileBasicData,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userBlockedFriendsList: state.userProfile.userBlockedFriendsList,
    };
}

export default withTranslation([''])(connect(mapStateToProps)(Privacy));
