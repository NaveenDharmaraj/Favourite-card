import React from 'react';
import {
    shallow,
} from 'enzyme';

import PlaceholderGrid from '../../../../components/shared/PlaceHolder';

describe('Testing Placeholder section', () => {
    it('Should rendered default placeholder type', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType=""
            />,
        );
        expect(wrapper.find({ 'data-test': 'Shared_Placeholder_default' }).exists()).toBe(true);
    });
    it('Should rendered placeholder of type table', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType="table"
            />,
        );
        expect(wrapper.find({ 'data-test': 'Shared_Placeholder_table' }).exists()).toBe(true);
    });
    it('Should rendered placeholder of type singleCard', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType="singleCard"
            />,
        );
        expect(wrapper.find({ 'data-test': 'Shared_Placeholder_singlecard' }).exists()).toBe(true);
    });
    it('Should rendered placeholder of type multiLine', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType="multiLine"
            />,
        );
        expect(wrapper.find({ 'data-test': 'Shared_Placeholder_multiLine' }).exists()).toBe(true);
    });
});
