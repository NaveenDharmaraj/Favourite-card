
import React from 'react';
import {
    shallow,
} from 'enzyme';

import { FlowBreadcrumbs } from '../../../../components/Give/FlowBreadcrumbs';

const initializeComponent = (props = {}) => shallow(<FlowBreadcrumbs {...props} />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const props = {
            currentStep: 'pot-bellied-pals/new',
            flowType: 'give/to/group',
            formatMessage: jest.fn(),
            steps: [
                "pot-bellied-pals/new",
                "review",
                "success",
                "error",
            ],
        };
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    })
})

