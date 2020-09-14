import React from 'react';
import {
    shallow,
} from 'enzyme';
import OneLastStep from '../../../components/New/ClaimCharityFirstStep';

const initializeComponent = (props = {}) => shallow(<OneLastStep {...props} />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const props = {
            validity: {
                isFirstNameValid: true,
                isFirstNameNotNull: true,
                doesFirstNameHave2: true,
                isFirstnameLengthInLimit: true,
                isLastNameValid: true,
                isLastNameNotNull: true,
                isLastnameLengthInLimit: true,
            },
            isButtonDisabled: jest.fn(),
        };
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    });
})

