import React from 'react';
import {
    shallow,
} from 'enzyme';

import {
    mapStateToProps,
    CharityProfileWrapper,
} from '../../../components/charity/index';

import { charityDetails } from './Data';

const getProps = () => ({
    charityDetails,
});

describe('Testing Charity Profile wrapper file', () => {
    const props = getProps();
    test('Testing component rendered', () => {
        const wrapper = shallow(
            <CharityProfileWrapper
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'CharityProfileWrapper_container_div' }).exists()).toBe(true);
    });

    test('testing mapstatetoprops', () => {
        const initialState = {
            charity: {
                ...props,
            },
        };
        expect(mapStateToProps(initialState).charityDetails.attributes.name).toEqual(
            'The Canadian Red Cross Society la Societe Canadienne de la Croix Rouge',
        );
    });
});
