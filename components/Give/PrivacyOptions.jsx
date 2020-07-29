import React, {
    Fragment,
    useState,
    useEffect,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Checkbox,
    Form,
    Select,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { populateDropdownInfoToShare } from '../../helpers/users/utils';
import { populateInfoToShareAccountName } from '../../helpers/give/utils';

const PrivacyOptions = (props) => {
    const {
        formatMessage,
        giveFrom,
        giveToType,
        nameToShare,
        privacyNameOptions,
        privacyShareAmount,
        handleInputChange,
        hasCampaign,
        infoToShare,
        groupCampaignAdminShareInfoOptions,
    } = props;
    const privacyShareAmountLabel = formatMessage(`privacyOptions:sharePrivacyGiftAmount`);
    const [
        infoToShareAdminOption,
        setInfoToShareAdminOption,
    ] = useState([
        {
            text: 'Give anonymously',
            value: 'anonymous',
        },
    ]);
    useEffect(() => {
        if (giveFrom && giveFrom.type === 'user' && !_isEmpty(groupCampaignAdminShareInfoOptions)) {
            const name = hasCampaign ? 'campaign_admins_info_to_share' : 'giving_group_admins_info_to_share';
            const customPreferenceObj = {
                giving_group_members_info_to_share: nameToShare.value === 'name' ? 'name' : '',
            };
            const {
                infoToShareList,
            } = populateDropdownInfoToShare(groupCampaignAdminShareInfoOptions, customPreferenceObj, name);
            setInfoToShareAdminOption(infoToShareList);
        } else {
            const disable = nameToShare.value === 'name';
            const infoToShareList = populateInfoToShareAccountName(giveFrom.name, formatMessage, disable);
            setInfoToShareAdminOption(infoToShareList);
        }
    }, [
        giveFrom,
        groupCampaignAdminShareInfoOptions,
        nameToShare,
    ]);
    return (
        <Fragment>
            {!hasCampaign && (
                <Form.Field className="give_flow_field">
                    <label
                        className="privacy-header"
                        htmlFor="privacyShareName"
                    >
                        {formatMessage('privacyOptions:forGivingGroupLabel')}
                    </label>
                    <br />
                    <Form.Field
                        className="dropdownWithArrowParent"
                        control={Select}
                        id="nameToShare"
                        name="nameToShare"
                        onChange={handleInputChange}
                        options={privacyNameOptions}
                        value={nameToShare.value}

                    />
                    <Form.Field
                        checked={privacyShareAmount}
                        className="ui checkbox checkbox-text f-weight-n cp_chkbx"
                        control={Checkbox}
                        id="privacyShareAmount"
                        label={privacyShareAmountLabel}
                        name="privacyShareAmount"
                        onChange={handleInputChange}
                    />
                </Form.Field>
            )}
            <Form.Field className="give_flow_field">
                <label htmlFor="infoToShare">
                    {formatMessage(`privacyOptions:${hasCampaign ? 'forGivingCampaignLabel' : 'selectNameAndAddressLabel'}`)}
                </label>
                <Form.Field
                    className="dropdownWithArrowParent"
                    control={Select}
                    id="infoToShare"
                    name="infoToShare"
                    options={infoToShareAdminOption}
                    onChange={handleInputChange}
                    value={infoToShare.value}
                />
            </Form.Field>
        </Fragment>
    );
};

PrivacyOptions.defaultProps = {
    formatMessage: () => {},
    groupCampaignAdminShareInfoOptions: [
        {
            privacySetting: 'anonymous',
            text: 'Give anonymously',
            value: 'anonymous',
        },
    ],
    handleInputChange: () => {},
    hasCampaign: null,
    infoToShare: {
        value: 'anonymous',
    },
    nameToShare: {
        value: 'anonymous',
    },
};

PrivacyOptions.propTypes = {
    formatMessage: PropTypes.func,
    groupCampaignAdminShareInfoOptions: PropTypes.arrayOf(PropTypes.shape({
        privacySetting: PropTypes.string,
    })),
    handleInputChange: PropTypes.func,
    hasCampaign: PropTypes.bool,
    infoToShare: PropTypes.shape({
        value: PropTypes.string,
    }),
    nameToShare: PropTypes.shape({
        value: PropTypes.string,
    }),
};

export default PrivacyOptions;
