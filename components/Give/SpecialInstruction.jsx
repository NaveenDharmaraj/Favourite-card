/* eslint-disable no-else-return */
import React, {
    Fragment,
    useState,
    useEffect,
} from 'react';
import {
    Form,
    Icon,
    Popup,
    Select,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CharityFrequency from '../Give/DonationFrequency';
import { populateDropdownInfoToShare } from '../../helpers/users/utils';
import { populateInfoToShareAccountName } from '../../helpers/give/utils';

const SpecialInstruction = (props) => {
    const {
        charityShareInfoOptions,
        formatMessage,
        giftType,
        giveFrom,
        handleInputChange,
        infoDefaultValue,
        language,
        handlegiftTypeButtonClick,
    } = props;
    let repeatGift = null;
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
        defautlDropDownValue,
        setDefaultDropDownValue,
    ] = useState(infoDefaultValue);
    useEffect(() => {
        if (giveFrom.type === 'user') {
            const {
                infoToShareList,
                defaultValue,
            } = populateDropdownInfoToShare(charityShareInfoOptions, infoDefaultValue);
            setOptions(infoToShareList);
            setDefaultDropDownValue(defaultValue);
        } else {
            const infoToShareList = populateInfoToShareAccountName(giveFrom.name, formatMessage);
            setOptions(infoToShareList);
            setDefaultDropDownValue(infoDefaultValue);
        }
    }, [
        giveFrom,
        charityShareInfoOptions,
    ]);

    if (giveFrom.type === 'user' || giveFrom.type === 'companies') {
        repeatGift = (
            <Fragment>
                <CharityFrequency
                    isGiveFlow={true}
                    formatMessage={formatMessage}
                    giftType={giftType}
                    handlegiftTypeButtonClick={handlegiftTypeButtonClick}
                    handleInputChange={handleInputChange}
                    language={language}
                />
            </Fragment>
        );
    }
    const handleSpecialInstructionInputChange = (event, data) => {
        const {
            value,
        } = data;
        setDefaultDropDownValue(value);
        handleInputChange(event, data);
    };
    return (
        <Fragment>
            {repeatGift}
            <Form.Field className="give_flow_field">
                <label htmlFor="infoToShare">
                    {formatMessage('specialInstruction:infoToShareLabel')}
                </label>
                <Popup
                    content={formatMessage('specialInstruction:infotoSharePopup')}
                    position="top center"
                    trigger={(
                        <Icon
                            color="blue"
                            name="question circle"
                            size="large"
                        />
                    )}
                />
                <Form.Field
                    control={Select}
                    className="dropdownWithArrowParent icon"
                    id="infoToShare"
                    name="infoToShare"
                    options={options}
                    onChange={handleSpecialInstructionInputChange}
                    value={defautlDropDownValue}
                />
            </Form.Field>
        </Fragment>
    );
};
SpecialInstruction.defaultProps = {
    charityShareInfoOptions: [
        {
            privacySetting: 'anonymous',
            text: 'Give anonymously',
            value: 'anonymous',
        },
    ],
    giftType: {
        value: null,
    },
    giveFrom: {
        name: '',
    },
    infoDefaultValue: 'anonymous',
};
SpecialInstruction.propTypes = {
    charityShareInfoOptions: PropTypes.arrayOf(PropTypes.shape({
        privacySetting: PropTypes.string,
    })),
    giftType: PropTypes.shape({
        value: PropTypes.number,
    }),
    giveFrom: PropTypes.shape({
        name: PropTypes.string,
    }),
    infoDefaultValue: PropTypes.string,
};

export default SpecialInstruction;
