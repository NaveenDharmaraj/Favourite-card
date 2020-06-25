import React from 'react';
import {
    shallow,
} from 'enzyme';

import BreadcrumbDetails from '../../../../components/shared/BreadCrumbs';

describe('Testing Breadcrumb section', () => {
    it('Should render Breadcrumb section', () => {
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
        expect(wrapper.find({ 'data-test': 'Shared_BreadcrumbDetails_Breadcrumbsection' }).exists()).toBe(true);
    });
});
