
import React from 'react';
import {
    shallow,
} from 'enzyme';

import { DonationAmountField } from '../../../../components/Give/DonationAmountField';

const initializeComponent = (props = {}) => shallow(<DonationAmountField {...props} />);
const props = {
    amount: '2020',
    formatMessage: jest.fn(),
    fromP2p: true,
    handleInputChange: jest.fn(),
    handleInputOnBlur: jest.fn(),
    handlePresetAmountClick: jest.fn(),
    isGiveFlow: true,
    validity: {
        doesAmountExist: true,
        isAmountCoverGive: true,
        isAmountLessThanOneBillion: true,
        isAmountMoreThanOneDollor: true,
        isNoteToCharityInLimit: true,
        isNoteToSelfInLimit: true,
        isNumberOfEmailsLessThanMax: true,
        isRecepientSelected: true,
        isRecipientHaveSenderEmail: true,
        isRecipientListUnique: true,
        isReloadRequired: true,
        isValidDecimalAmount: true,
        isValidEmailList: true,
        isValidGiveAmount: true,
        isValidGiveFrom: true,
        isValidNoteSelfText: true,
        isValidNoteToCharityText: true,
        isValidNoteToRecipients: true,
        isValidNoteToSelf: true,
        isValidPositiveNumber: true,
    },
};

describe('Test input field change, onblur and button click functionality', () => {
    it('Should call handlePresetAmountClick function on handleDonationPresetAmountClick button click', () => {
        const component = initializeComponent(props);
        const event = {};
        const data = {
            index: 1,
        };
        component.find({ 'data-test': 'Give_DonationAmountField_presetamount_button' }).simulate('click', event, data);
        expect(props.handlePresetAmountClick).toHaveBeenCalledWith(event, data);
    });

    it('Should call handleInputChange function on handleDonationAmountFieldInputChange change', () => {
        const component = initializeComponent(props);
        const event = {};
        const data = {
            index: 1,
        };
        component.find({ 'data-test': 'Give_DonationAmountField_input' }).simulate('change', event, data);
        expect(props.handleInputChange).toHaveBeenCalledTimes(1);
    });

    it('Should call handleInputOnBlur function on amount field blur when name is empty', () => {
        const component = initializeComponent(props);
        const event = {
            relatedTarget: {
                name: '',
            }
        };
        const data = {
            index: 1,
        };
        component.find({ 'data-test': 'Give_DonationAmountField_input' }).simulate('blur', event, data);
        expect(props.handleInputOnBlur).toHaveBeenCalledTimes(1);
    });
})
