import React from 'react';
import {
    shallow,
    mount,
} from 'enzyme';
import {
    charityDetails,
    emptyPrograms,
} from './Data';
import {
    ProgramAreas,
    mapStateToProps,
} from '../../../components/charity/ProgramAreas';

describe('Testing ProgramAreas Component', () => {
    test('Testing component rendered', () => {
        const wrapper = mount(
            <ProgramAreas
                charityDetails={charityDetails}
                t= {jest.fn()}
            />
        );
        expect(wrapper.find('.ch_program').exists()).toBe(true);
        expect(wrapper.find('CharityNoDataState').exists()).toBe(false);
    });
    test('Testing No data', () => {
        const wrapper = mount(
            <ProgramAreas
                charityDetails={emptyPrograms}
                t= {jest.fn()}
            />
        );
        expect(wrapper.find('CharityNoDataState').exists()).toBe(true);
    });
    test('Testing mapStateToProps', () => {
        const initialState = {
            charity: {
                charityDetails,
            },
        };
        expect(mapStateToProps(initialState).charityDetails.id).toEqual("87");
    });
});