import React from 'react';
import {
    shallow,
} from 'enzyme';
import ClaimCharity from '../../../../pages/claim-charity/index';

const initializeComponent = () => shallow(<ClaimCharity />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const component = initializeComponent();
        expect(component.exists()).toBe(true);
    });
})
