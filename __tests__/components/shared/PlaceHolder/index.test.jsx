import React from 'react';
import {
    shallow,
} from 'enzyme';

import PlaceholderGrid from '../../../../components/shared/PlaceHolder';

describe('Testing PlaceholderGrid Ccomponent', () => {
    test('Testing Component rendered for empty type', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType=""
            />,
        );
        expect(wrapper.find('Placeholder').exists()).toBe(true);
    });
    test('Testing Component rendered for table type', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType="table"
            />,
        );
        expect(wrapper.find('TableBody').exists()).toBe(true);
    });
    test('Testing Component rendered for singleCard type', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType="singleCard"
            />,
        );
        expect(wrapper.find('.groupSupportsWraper').exists()).toBe(true);
    });
    test('Testing Component rendered for multiLine type', () => {
        const wrapper = shallow(
            <PlaceholderGrid
                column={1}
                row={1}
                placeholderType="multiLine"
            />,
        );
        expect(wrapper.find('.ch_ModelPlaceholder').exists()).toBe(true);
    });
});
