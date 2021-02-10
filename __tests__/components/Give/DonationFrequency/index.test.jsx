
import React from 'react';
import {
    shallow,
} from 'enzyme';

import { DonationFrequency } from '../../../../components/Give/DonationFrequency';

const initializeComponent = (props = {}) => shallow(<DonationFrequency {...props} />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const props = {
            formatMessage: jest.fn(),
            giftType: {
                value: 0,
            },
            handlegiftTypeButtonClick: jest.fn(),
            handleInputChange: jest.fn(),
            isGiveFlow: true,
            language: "en",
            recurringDisabled: false,
        };
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    });

    it('Should give giving info text when recurringDisabled prop is set to true', () => {
        const props = {
            formatMessage: jest.fn(),
            giftType: {
                value: 0,
            },
            handlegiftTypeButtonClick: jest.fn(),
            handleInputChange: jest.fn(),
            isGiveFlow: true,
            language: "en",
            recurringDisabled: true,
        };
        const component = initializeComponent(props);
        expect(component.find({ 'data-test': 'Give_DonationFrequency_givingInfoText' }).text()).toEqual('This Giving Group does not accept monthly gifts.');
    });

    it('Should give true when giftType value is greater than 0', () => {
        const props = {
            formatMessage: jest.fn(),
            giftType: {
                value: 1,
            },
            handlegiftTypeButtonClick: jest.fn(),
            handleInputChange: jest.fn(),
            isGiveFlow: true,
            language: "en",
            recurringDisabled: true,
        };
        const component = initializeComponent(props);
        expect(component.find({ 'data-test': 'Give_DonationFrequency_gifttype' }).exists()).toBe(true);
    });
})
