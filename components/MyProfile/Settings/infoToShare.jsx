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
import { withTranslation } from '../../../i18n';

const currentPreferenceValue = {
    campaign_admins_info_to_share: 'campaign_admins_info_to_share',
    charities_info_to_share: 'charities_info_to_share',
    giving_group_admins_info_to_share: 'giving_group_admins_info_to_share',
    giving_group_members_info_to_share: 'giving_group_members_info_to_share',
    giving_group_members_share_my_giftamount: 'giving_group_members_share_my_giftamount',
};
class InfoToShare extends React.Component {
    constructor(props) {
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
        const {
            currentUser,
            dispatch
        } = this.props;
        !_isEmpty(preferenceObj) && dispatch(updateInfoUserPreferences(currentUser.id, preferenceObj));
    }

    handleGiftAmountCheckboxClick = (event, data) => {
        const {
            name,
            checked
        } = data;
        this.handleUserPreferenceChange({ [name]: checked })
        this.setState(prevState => {
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
        const formatMessage = this.props.t;
        const {
            giftAmountCheckbox
        } = this.state;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer Informationshare">
                    <div className="settingsDetailWraper">
                        <Header as="h4">{formatMessage('infoToShare.infoToShareHeader')}</Header>
                        <p>
                            {formatMessage('infoToShare.infoToShareDesc')}
                        </p>
                    </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">{formatMessage('infoToShare.charityHeader')}</Header>
                        <p>
                            {formatMessage('infoToShare.shareDesc')}
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.charityShareInfoOptions}
                            name="charities_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.charities_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader={infoShareDropDownLoader}
                        />
                    </div>
                    <div className="settingsDetailWraper">
                        <p className="bold"> {formatMessage('infoToShare.givingGroupMemeberHeader')}</p>
                        <p>
                            {formatMessage('infoToShare.shareDesc')}
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.groupMemberShareInfoOptions}
                            name="giving_group_members_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.giving_group_members_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader={infoShareDropDownLoader}
                        />
                        <div className="cp_chkbx checkedGiftAmount checkbox-text f-weight-n">
                            <Checkbox
                                label={formatMessage('infoToShare.shareMyGiftAmount')}
                                checked={giftAmountCheckbox}
                                name="giving_group_members_share_my_giftamount"
                                onClick={this.handleGiftAmountCheckboxClick}
                            />
                        </div>
                    </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4"> {formatMessage('infoToShare.givingGroupAdminHeader')}</Header>
                        <p>
                            {formatMessage('infoToShare.shareDesc')}
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.groupAdminShareInfoOptions}
                            name="giving_group_admins_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.giving_group_admins_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader={infoShareDropDownLoader}
                        />
                    </div>
                    <div className="settingsDetailWraper">
                        <Header as="h4">{formatMessage('infoToShare.campaignHeader')}</Header>
                        <p>
                            {formatMessage('infoToShare.shareDesc')}
                        </p>
                        <DropDownInfoToShare
                            infoShareOptions={infoShareOptions.campaignAdminShareInfoOptions}
                            name="campaign_admins_info_to_share"
                            preferences={currentUser.attributes.preferences}
                            currentPreferenceValue={currentPreferenceValue.campaign_admins_info_to_share}
                            handleUserPreferenceChange={this.handleUserPreferenceChange}
                            infoShareDropDownLoader={infoShareDropDownLoader}
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
export default withTranslation('settings')(connect(mapStateToProps)(InfoToShare));