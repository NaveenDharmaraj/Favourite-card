import React, {
    useState, useEffect,
} from 'react';
import {
    Dropdown,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { populateDropdownInfoToShare } from '../../../helpers/users/utils';


const DropDownInfoToShare = ({
    currentPreferenceValue, infoShareOptions, name, preferences, handleUserPreferenceChange, infoShareDropDownLoader,
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
        } = populateDropdownInfoToShare(infoShareOptions, preferences, currentPreferenceValue);
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
            [`${name}_address`]: privacyData,
        };
        setDropDownValue(value);
        handleUserPreferenceChange(preferenceObj);
    };
    return (
        <div className="dropdownSearch dropdownWithArrowParentnotbg medium">
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
    currentPreferenceValue: '',
    infoShareDropDownLoader: false,
    infoShareOptions: [
        {
            privacySetting: 'anonymous',
            text: 'Give anonymously',
            value: 'anonymous',
        },
    ],
    name: '',
};

DropDownInfoToShare.propTypes = {
    currentPreferenceValue: PropTypes.string,
    infoShareDropDownLoader: PropTypes.bool,
    infoShareOptions: PropTypes.arrayOf(PropTypes.shape({
        privacySetting: PropTypes.string,
    })),
    name: PropTypes.string,
};

export default DropDownInfoToShare;
