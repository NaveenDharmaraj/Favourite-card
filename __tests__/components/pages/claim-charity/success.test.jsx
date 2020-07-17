import React from 'react';
import {
    shallow,
} from 'enzyme';
import ClaimSuccess from '../../../../pages/claim-charity/success';

const initializeComponent = (props = {}) => shallow(<ClaimSuccess {...props} />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', async() => {
        const props = await ClaimSuccess.getInitialProps({
            query: {
                slug: 'abcd'
            },
        });
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    });
})
