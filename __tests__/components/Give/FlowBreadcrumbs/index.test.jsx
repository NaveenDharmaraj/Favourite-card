
import React from 'react';
import {
    mount,
} from 'enzyme';

import { FlowBreadcrumbs } from '../../../../components/Give/FlowBreadcrumbs';

const initializeComponent = (props = {}) => mount(<FlowBreadcrumbs {...props} />);

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
    });

    it('Should give prop flowType equal to donations when component is rendered', () => {
        const props = {
            currentStep: 'new',
            flowType: 'donations',
            formatMessage: jest.fn(),
            steps: [
                "new",
                "review",
                "success",
                "error",
            ],
        };
        const component = initializeComponent(props);
        expect(component.find('FlowBreadcrumbs').prop('flowType')).toEqual('donations');
    });
})

