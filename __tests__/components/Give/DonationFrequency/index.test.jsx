
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
            recurringDisabled: true,
        };
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    })
})
