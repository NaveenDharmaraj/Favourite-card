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
        } = populateDropdownInfoToShare(infoShareOptions, preferences);
        setOptions(infoToShareList);
        setDropDownValue(defaultValue);
    }, [
        infoShareOptions,
    ]);
    const handleChange = (event, data) => {
        const {
            value,
        } = data;
        const {
            key,
            privacyData,
        } = data.options.find((opt) => opt.value === value);
        const preferenceObj = {
            [name]: key,
            ...(name !== 'giving_group_members_info_to_share') && { [`${name}_address`]: privacyData },
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
    name: '',
    preferences: '',
};

DropDownInfoToShare.propTypes = {
    infoShareDropDownLoader: PropTypes.bool,
    infoShareOptions: PropTypes.arrayOf(PropTypes.shape({
        privacySetting: PropTypes.string,
    })),
    name: PropTypes.string,
    preferences: PropTypes.string,
};

export default DropDownInfoToShare;
