/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Header,
    Checkbox,
    List,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    updateUserPreferences,
} from '../../../actions/userProfile';

const givingColumnName = {
    charitiesGiveAnonymously: 'charities_give_anonymously',
    givingGroupAdminsShareMyNameEmail: 'giving_group_admins_share_my_name_e_mail',
    givingGroupMembersGiveAnonymously: 'giving_group_members_give_anonymously',
    givingGroupMembersShareMyGiftamount: 'giving_group_members_share_my_giftamount',
    givingGroupMembersShareMyName: 'giving_group_members_share_my_name',
};

class ManageGiving extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            charitiesGiveAnonymously: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_give_anonymously : false,
            charitiesShareMyName: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_share_my_name : false,
            charitiesShareMyNameAddress: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_share_my_name_address : false,
            charitiesShareMyNameEmail: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_share_my_name_email : false,
            givingGroupAdminsShareMyNameEmail: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_admins_share_my_name_e_mail : false,
            givingGroupMembersGiveAnonymously: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_members_give_anonymously : false,
            givingGroupMembersShareMyGiftamount: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_members_share_my_giftamount : false,
            givingGroupMembersShareMyName: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_members_share_my_name : false,
            userName: (!_.isEmpty(props.currentUser)) ? `${props.currentUser.attributes.firstName} ${props.currentUser.attributes.lastName}` : '',
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
        const columnName = givingColumnName[name];
        if (columnName !== null) {
            updateUserPreferences(dispatch, currentUser.id, columnName, checked);
        }
    }

    render() {
        const {
            givingGroupMembersGiveAnonymously,
            givingGroupMembersShareMyGiftamount,
            givingGroupMembersShareMyName,
            givingGroupAdminsShareMyNameEmail,
            charitiesGiveAnonymously,
            charitiesShareMyName,
            charitiesShareMyNameAddress,
            charitiesShareMyNameEmail,
            userName,
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <Header as="h4">Manage Giving </Header>
                        <p>
                            Choose the default options for information
                            you’d like to share when you send gifts.
                        </p>
                    </div>
                    <div className="settingsDetailWraper">
                        <p className="bold">Giving Groups members</p>
                        <List divided verticalAlign="middle" className="userList">
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="givingGroupMembersGiveAnonymously"
                                        name="givingGroupMembersGiveAnonymously"
                                        checked={givingGroupMembersGiveAnonymously}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Give anonymously</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="givingGroupMembersShareMyName"
                                        name="givingGroupMembersShareMyName"
                                        checked={givingGroupMembersShareMyName}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>
                                        Share my name
                                        (
                                        {userName}
                                        )
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="givingGroupMembersShareMyGiftamount"
                                        name="givingGroupMembersShareMyGiftamount"
                                        checked={givingGroupMembersShareMyGiftamount}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Share my gift amount</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                        <p className="bold mt-2">Giving Group admins</p>
                        <List divided verticalAlign="middle" className="userList">
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="givingGroupAdminsShareMyNameEmail"
                                        name="givingGroupAdminsShareMyNameEmail"
                                        checked={givingGroupAdminsShareMyNameEmail}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Give anonymously</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                        <p className="bold mt-2">Charities</p>
                        <List divided verticalAlign="middle" className="userList">
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="charitiesGiveAnonymously"
                                        name="charitiesGiveAnonymously"
                                        checked={charitiesGiveAnonymously}
                                        onChange={this.handleUserPreferenceChange}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Give anonymously</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    <Checkbox
                                        toggle
                                        className="c-chkBox"
                                        id="charitiesShareMyName"
                                        name="charitiesShareMyName"
                                        checked={charitiesShareMyName}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Share my information</List.Description>
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

export default (connect(mapStateToProps)(ManageGiving));
