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

describe('Testing Program Areas section', () => {
    it('Should render program areas section', () => {
        const wrapper = mount(
            <ProgramAreas
                charityDetails={charityDetails}
                t={jest.fn()}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ProgramAreas_programs_section' }).exists()).toBe(true);
        expect(wrapper.find({ 'data-test': 'Charity_CharityNoDataState_noData' }).exists()).toBe(false);
    });
    it('Should show No data at Program Area section', () => {
        const wrapper = mount(
            <ProgramAreas
                charityDetails={emptyPrograms}
                t={jest.fn()}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_CharityNoDataState_noData' }).exists()).toBe(true);
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
