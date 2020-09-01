
import React from 'react';
import {
    shallow,
} from 'enzyme';

import { FlowBreadcrumbs } from '../../../../components/Give/FlowBreadcrumbs';

const initializeComponent = (props = {}) => shallow(<FlowBreadcrumbs {...props} />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const props = {
            currentStep: 'new',
            flowType: 'give/to/friend',
            formatMessage: jest.fn(),
            steps: [
                "new",
                "review",
                "success",
                "error",
            ],
        };
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    })
})

