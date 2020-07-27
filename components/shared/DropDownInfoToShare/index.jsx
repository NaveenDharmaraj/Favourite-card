import React, {
    useState, useEffect,
} from 'react';
import {
    Dropdown,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { populateDropdownInfoToShare } from '../../../helpers/users/utils';


const DropDownInfoToShare = ({
    infoShareOptions, name, preferences, handleUserPreferenceChange, infoShareDropDownLoader,
}) => {
    const [
        options,
        setOptions,
    ] = useState([
        {
            text: 'Give anonymously',
            value: 'anonymous',
        },
    ]);
    const [
        dropDownValue,
        setDropDownValue,
    ] = useState('anonymous');
    useEffect(() => {
        const {
            infoToShareList,
            defaultValue,
        } = populateDropdownInfoToShare(infoShareOptions, preferences, name);
        setOptions(infoToShareList);
        setDropDownValue(defaultValue);
    }, [
        infoShareOptions,
        preferences,
    ]);
    const handleChange = (event, data) => {
        const {
            value,
        } = data;
        const {
            privacySetting,
            privacyData,
        } = data.options.find((opt) => opt.value === value);
        const preferenceObj = {
            [name]: privacySetting,
            ...(name !== 'giving_group_members_info_to_share') && { [`${name}_address`]: privacyData },
            ...(name === 'giving_group_members_info_to_share' && preferences.giving_group_admins_info_to_share === 'anonymous')
            && { giving_group_admins_info_to_share: 'name' },
        };
        setDropDownValue(value);
        handleUserPreferenceChange(preferenceObj);
    };
    return (
        <div className={`dropdownSearch ${infoShareDropDownLoader ? '' : 'dropdownWithArrowParent'} medium ArrowParentbtm`}>
            <Dropdown
                className="dropdownsearchField grouped medium"
                fluid
                selection
                name={name}
                options={options}
                onChange={handleChange}
                value={dropDownValue}
                loading={infoShareDropDownLoader}
            />
        </div>

    );
};
DropDownInfoToShare.defaultProps = {
    infoShareDropDownLoader: false,
    infoShareOptions: [
        {
            privacySetting: 'anonymous',
            text: 'Give anonymously',
            value: 'anonymous',
        },
    ],
    name: 'charities_info_to_share',
    preferences: {
        campaign_admins_info_to_share: '',
        campaign_admins_info_to_share_address: '',
        charities_info_to_share: '',
        charities_info_to_share_address: '',
        giving_group_admins_info_to_share: '',
        giving_group_admins_info_to_share_address: '',
        giving_group_members_info_to_share: '',
    },
};

DropDownInfoToShare.propTypes = {
    infoShareDropDownLoader: PropTypes.bool,
    infoShareOptions: PropTypes.arrayOf(PropTypes.shape({
        privacySetting: PropTypes.string,
    })),
    name: PropTypes.string,
    preferences: PropTypes.shape({
        campaign_admins_info_to_share: PropTypes.string,
        campaign_admins_info_to_share_address: PropTypes.string,
        charities_info_to_share: PropTypes.string,
        charities_info_to_share_address: PropTypes.string,
        giving_group_admins_info_to_share: PropTypes.string,
        giving_group_admins_info_to_share_address: PropTypes.string,
        giving_group_members_info_to_share: PropTypes.string,
    }),
};

export default DropDownInfoToShare;
