/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Header,
    List,
    Checkbox,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    updateUserPreferences,
} from '../../../actions/userProfile';

const notificationColumnName = {
    emailGivingGroupActivity: 'email_giving_group_activity',
    emailGivingGroupAdminUpdates: 'email_giving_group_admin_updates',
    emailNewsAndStories: 'email_news_and_stories_from_charitable_impact',
    emailRemindersCompanyMatch: 'email_reminders_amount_within_company_match',
    inAppFriendsActivity: 'in_app_friends_activity_update_and_giving_goals',
    inAppGivingGroupActivity: 'in_app_giving_group_activity',
    // inAppGivingGroupMessagesLikes: 'in_app_giving_group_messages_likes_for_you',
    inAppNewsAndStories: 'in_app_news_and_stories_from_charitable_impact',
};

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailGivingGroupActivity: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.email_giving_group_activity : false,
            emailGivingGroupAdminUpdates: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.email_giving_group_admin_updates : false,
            emailNewsAndStories: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.email_news_and_stories_from_charitable_impact : false,
            emailRemindersCompanyMatch: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.email_reminders_amount_within_company_match : false,
            inAppFriendsActivity: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.in_app_friends_activity_update_and_giving_goals : false,
            inAppGivingGroupActivity: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.in_app_giving_group_activity : false,
            // inAppGivingGroupMessagesLikes: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.in_app_giving_group_messages_likes_for_you : false,
            inAppNewsAndStories: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.in_app_news_and_stories_from_charitable_impact : false,
        };
        this.handleUserPreferenceChange = this.handleUserPreferenceChange.bind(this);
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
        const columnName = notificationColumnName[name];
        updateUserPreferences(dispatch, currentUser.id, columnName, checked, null);
    }

    render() {
        const {
            inAppNewsAndStories,
            inAppFriendsActivity,
            inAppGivingGroupActivity,
            // inAppGivingGroupMessagesLikes,
            emailGivingGroupActivity,
            emailGivingGroupAdminUpdates,
            emailNewsAndStories,
            emailRemindersCompanyMatch,
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper heading">
                        <Header as="h4" className="mb-0">Notifications </Header>
                    </div>
                    <div className="settingsDetailWraper">
                        <p className="bold">On Charitable Impact</p>
                        <p>Shown on Charitable Impact's website and app.</p>
                        <List divided verticalAlign="middle" className="userList">
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="inAppNewsAndStories"
                                        name="inAppNewsAndStories"
                                        checked={inAppNewsAndStories}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>
                                        News and stories from Charitable Impact
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="inAppFriendsActivity"
                                        name="inAppFriendsActivity"
                                        checked={inAppFriendsActivity}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>
                                        Friend activity, updates and giving goals
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="inAppGivingGroupActivity"
                                        name="inAppGivingGroupActivity"
                                        checked={inAppGivingGroupActivity}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Giving Group activity</List.Description>
                                </List.Content>
                            </List.Item>
                            {/* CPP-204_hide this option in notification settings until P3 notifications are implemented. */}
                            {/* <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="inAppGivingGroupMessagesLikes"
                                        name="inAppGivingGroupMessagesLikes"
                                        checked={inAppGivingGroupMessagesLikes}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>
                                        Giving Group messages and likes for you
                                    </List.Description>
                                </List.Content>
                            </List.Item> */}
                        </List>
                        <p className="bold mt-2">Email</p>
                        <p>Updates sent to your primary email address.</p>
                        <List divided verticalAlign="middle" className="userList">
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="emailNewsAndStories"
                                        name="emailNewsAndStories"
                                        checked={emailNewsAndStories}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>
                                        News and stories from Charitable Impact
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="emailRemindersCompanyMatch"
                                        name="emailRemindersCompanyMatch"
                                        checked={emailRemindersCompanyMatch}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>
                                        Reminders about amount remaining in company match
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="emailGivingGroupAdminUpdates"
                                        name="emailGivingGroupAdminUpdates"
                                        checked={emailGivingGroupAdminUpdates}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Giving Group admin updates</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="emailGivingGroupActivity"
                                        name="emailGivingGroupActivity"
                                        checked={emailGivingGroupActivity}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Giving Group activity</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(Notifications));
