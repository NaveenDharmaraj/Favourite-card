import React from 'react';
import _ from 'lodash';
import {
    Header, Checkbox,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    updateInfoUserPreferences,
    getInfoToShareDropdownOptions,
} from '../../../actions/userProfile';
import DropDownInfoToShare from '../../shared/DropDownInfoToShare';

const currentPreferenceValue = {
    campaign_admins_info_to_share: 'campaign_admins_info_to_share',
    charities_info_to_share: 'charities_info_to_share',
    giving_group_admins_info_to_share: 'giving_group_admins_info_to_share',
    giving_group_members_info_to_share: 'giving_group_members_info_to_share',
    giving_group_members_share_my_giftamount: 'giving_group_members_share_my_giftamount',
};
class InfoToShare extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            giftAmountCheckbox: props.currentUser.attributes.preferences.giving_group_members_share_my_giftamount,
        }
    }
    componentDidMount() {
        const {
            currentUser,
            dispatch,
            infoShareOptions,
        } = this.props;
        const infoShareDropDownLoader = !_isEmpty(infoShareOptions) ? false : true;

        dispatch(getInfoToShareDropdownOptions(currentUser.id, infoShareDropDownLoader));
    }

    handleUserPreferenceChange = (preferenceObj) => {
        const{
            currentUser,
            dispatch
        } = this.props;
        !_isEmpty(preferenceObj) && dispatch(updateInfoUserPreferences(currentUser.id, preferenceObj));
    }
    
    handleGiftAmountCheckboxClick = (event,data) => {
        const{
            name,
            checked
        } = data;
        this.handleUserPreferenceChange({[name]: checked})
        this.setState(prevState=>{
            return {
                giftAmountCheckbox: !prevState.giftAmountCheckbox
            }
        })
    }
    render() {
        const {
            currentUser,
            infoShareDropDownLoader,
            infoShareOptions,
        } = this.props;
        const {
            giftAmountCheckbox
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper">
                        <Header as="h4">Information to share </Header>
                        <p>
                            Choose the default options for information
                            you’d like to share when you send gifts.
                        </p>
                    </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">Charities</Header>
                        <p>
                            If you choose to share your name, your full name is used.
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.charityShareInfoOptions}
                            name="charities_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.charities_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader= {infoShareDropDownLoader}
                        />
                    </div>
                    <div className="settingsDetailWraper">
                        <p className="bold">Giving Groups members</p>
                        <p>
                            If you choose to share your name, your full name is used.
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.groupMemberShareInfoOptions}
                            name="giving_group_members_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.giving_group_members_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader= {infoShareDropDownLoader}
                        />
                        <div>
                            <Checkbox
                                label="Share my gift amount"
                                checked= {giftAmountCheckbox}
                                name="giving_group_members_share_my_giftamount"
                                onClick={this.handleGiftAmountCheckboxClick}
                            />
                        </div>
                    </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">Giving Group admins</Header>
                        <p>
                            If you choose to share your name, your full name is used.
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.groupAdminShareInfoOptions}
                            name="giving_group_admins_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.giving_group_admins_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader= {infoShareDropDownLoader}
                        />
                    </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">Campaign admins</Header>
                        <p>
                            If you choose to share your name, your full name is used.
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.campaignAdminShareInfoOptions}
                            name="campaign_admins_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.campaign_admins_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader= {infoShareDropDownLoader}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        infoShareDropDownLoader: state.userProfile.infoShareDropDownLoader,
        infoShareOptions: state.userProfile.infoShareOptions,
        userDefaultTaxReceipt: state.userProfile.userDefaultTaxReceipt,
    };
}
InfoToShare.defaultProps = {
    currentUser: {
        id: '',
    },
    dispatch: () => { },
    infoShareOptions: {
      
    },
};

InfoToShare.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.string,
    }),
    dispatch: PropTypes.func,
    infoShareOptions: PropTypes.shape({
        campaignAdminShareInfoOptions: PropTypes.arrayOf(PropTypes.shape({
            privacySetting: PropTypes.string,
        })),
        charityShareInfoOptions: PropTypes.arrayOf(PropTypes.shape({
            privacySetting: PropTypes.string,
        })),
        groupAdminShareInfoOptions: PropTypes.arrayOf(PropTypes.shape({
            privacySetting: PropTypes.string,
        })),
        groupMemberShareInfoOptions: PropTypes.arrayOf(PropTypes.shape({
            privacySetting: PropTypes.string,
        })),
    }),
};
export default (connect(mapStateToProps)(InfoToShare));
