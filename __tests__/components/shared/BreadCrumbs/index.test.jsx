import React from 'react';
import {
    shallow,
} from 'enzyme';

import BreadcrumbDetails from '../../../../components/shared/BreadCrumbs';

describe('Testing BreadcrumbDetails component', () => {
    test('Testing component rendered', () => {
        const pathArr = [
            'Explore',
            'Charities',
            'Canadian red cross',
        ];
        const wrapper = shallow(
            <BreadcrumbDetails
                pathDetails={pathArr}
            />,
        );
        expect(wrapper.find('Breadcrumb').exists()).toBe(true);
    });
});
