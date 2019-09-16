/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Header,
    Checkbox,
    List,
    Form,
    Radio,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    updateUserPreferences,
} from '../../../actions/userProfile';

const givingColumnName = {
    charitiesGiveAnonymously: 'charities_give_anonymously',
    charitiesShareMyName: 'charities_share_my_name',
    charitiesShareMyNameAddress: 'charities_share_my_name_address',
    charitiesShareMyNameEmail: 'charities_share_my_name_email',
    givingGroupAdminsShareMyNameEmail: 'giving_group_admins_share_my_name_email',
    givingGroupMembersGiveAnonymously: 'giving_group_members_give_anonymously',
    givingGroupMembersShareMyGiftamount: 'giving_group_members_share_my_giftamount',
    givingGroupMembersShareMyName: 'giving_group_members_share_my_name',
    isCharityShareInfo: 'charities_dont_share',
};

class ManageGiving extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            charitiesGiveAnonymously: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_give_anonymously : false,
            charitiesShareMyName: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_share_my_name : false,
            charitiesShareMyNameAddress: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_share_my_name_address : false,
            charitiesShareMyNameEmail: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.charities_share_my_name_email : false,
            givingGroupAdminsShareMyNameEmail: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_admins_share_my_name_email : false,
            givingGroupMembersGiveAnonymously: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_members_give_anonymously : false,
            givingGroupMembersShareMyGiftamount: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_members_share_my_giftamount : false,
            givingGroupMembersShareMyName: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.preferences.giving_group_members_share_my_name : false,
            userName: (!_.isEmpty(props.currentUser)) ? `${props.currentUser.attributes.firstName} ${props.currentUser.attributes.lastName}` : '',
            userNameEmail: (!_.isEmpty(props.currentUser)) ? props.currentUser.attributes.email : '',
            userNameAddress: '', //(!_.isEmpty(props.currentUser)) && typeof props.currentUser.preferences.address !== 'undefined' ? props.currentUser.preferences.address : '',
            isCharityShareInfo: (props.currentUser.attributes.preferences.charities_share_my_name || props.currentUser.attributes.preferences.charities_share_my_name_address || props.currentUser.attributes.preferences.charities_share_my_name_email) ? true : false,
        };
        this.handleUserPreferenceChange = this.handleUserPreferenceChange.bind(this);
        this.handleCharityInfoShare = this.handleCharityInfoShare.bind(this);
    }

    handleUserPreferenceChange(event, data) {
        const {
            checked,
            id,
        } = data;
        const {
            currentUser,
            dispatch,
        } = this.props;
        this.setState({ [id]: checked });
        const columnName = givingColumnName[id];
        if (columnName !== null) {
            updateUserPreferences(dispatch, currentUser.id, columnName, checked);
        }
    }

    handleCharityInfoShare(event, data) {
        const {
            checked,
            id,
        } = data;
        const {
            currentUser,
            dispatch,
        } = this.props;
        let {
            charitiesShareMyName,
            charitiesShareMyNameAddress,
            charitiesShareMyNameEmail,
        } = this.state;
        this.setState({ [id]: checked });
        const columnName = givingColumnName[id];
        if (columnName === 'charities_dont_share' && checked === false) {
            updateUserPreferences(dispatch, currentUser.id, columnName, checked);
        } else {
            charitiesShareMyName = true;
            charitiesShareMyNameAddress = false;
            charitiesShareMyNameEmail = false;
            this.setState({ 
                charitiesShareMyName,
                charitiesShareMyNameAddress,
                charitiesShareMyNameEmail,
            });
            updateUserPreferences(dispatch, currentUser.id, columnName, true);
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
            userNameEmail,
            userNameAddress,
            isCharityShareInfo,
        } = this.state;
        const userInfoEmail = `${userName}, ${userNameEmail}`;
        const userInfoAddress = `${userName}, ${userNameAddress}`;
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
                                    <List.Description>
                                        Share my name
                                        (
                                        {userInfoEmail}
                                        )
                                    </List.Description>
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
                                        id="isCharityShareInfo"
                                        name="isCharityShareInfo"
                                        checked={isCharityShareInfo}
                                        onChange={this.handleCharityInfoShare}
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Description>Share my information</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                        {
                            isCharityShareInfo && (
                                <div className="label-f-normal shareInfoRadio">
                                    <Form.Field>
                                        <Radio
                                            label={userName}
                                            checked={charitiesShareMyName}
                                            name="radioGroup"
                                            id="charitiesShareMyName"
                                            onChange={this.handleUserPreferenceChange}
                                            className="grnRadio"
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Radio
                                            label={userInfoEmail}
                                            checked={charitiesShareMyNameEmail}
                                            name="radioGroup"
                                            id="charitiesShareMyNameEmail"
                                            onChange={this.handleUserPreferenceChange}
                                            className="grnRadio"
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Radio
                                            label={userInfoAddress}
                                            checked={charitiesShareMyNameAddress}
                                            name="radioGroup"
                                            id="charitiesShareMyNameAddress"
                                            onChange={this.handleUserPreferenceChange}
                                            className="grnRadio"
                                        />
                                    </Form.Field>
                                </div>
                            )
                        }
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
