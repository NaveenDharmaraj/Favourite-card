import React from 'react';
import {
    mount,
} from 'enzyme';

import {
    ProgramAreas,
    mapStateToProps,
} from '../../../components/charity/ProgramAreas';

import {
    charityDetails,
    emptyPrograms,
} from './Data';

describe('Testing ProgramAreas Component', () => {
    test('Testing component rendered', () => {
        const wrapper = mount(
            <ProgramAreas
                charityDetails={charityDetails}
                t={jest.fn()}
            />,
        );
        expect(wrapper.find({ 'data-test': 'ProgramAreas_programs_section_div' }).exists()).toBe(true);
        expect(wrapper.find({ 'data-test': 'CharityNoDataState_no_data_table' }).exists()).toBe(false);
    });
    test('Testing No data', () => {
        const wrapper = mount(
            <ProgramAreas
                charityDetails={emptyPrograms}
                t={jest.fn()}
            />,
        );
        expect(wrapper.find({ 'data-test': 'CharityNoDataState_no_data_table' }).exists()).toBe(true);
    });
    test('Testing mapStateToProps', () => {
        const initialState = {
            charity: {
                charityDetails,
            },
        };
        expect(mapStateToProps(initialState).charityDetails.id).toEqual('87');
    });
});
