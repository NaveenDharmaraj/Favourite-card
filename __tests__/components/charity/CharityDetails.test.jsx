import React from 'react';
import {
    shallow,
} from 'enzyme';

import {
    CharityDetails,
    mapStateToProps,
} from '../../../components/charity/CharityDetails';

import { charityDetails } from './Data';

const getProps = () => ({
    charityDetails,
});

describe('Testing CharityDetails component', () => {
    const props = getProps();
    test('Testing component rendered', () => {
        const wrapper = shallow(
            <CharityDetails
                {...props}
                isAUthenticated
            />,
        );
        expect(wrapper.find({ 'data-test': 'CharityDetails_wrapper_grid' }).exists()).toBe(true);
    });
    test('Testing component without causes', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    causes: [],
                },
            },
        };
        const wrapper = shallow(
            <CharityDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'CharityDetails_causes_span' }).length).toEqual(0);
    });
    test('Testing component with causes', () => {
        const wrapper = shallow(
            <CharityDetails
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'CharityDetails_causes_span' }).length).toEqual(3);
    });
    test('Testing component with formattedDescription and formattedDescriptionNew', () => {
        const wrapper = shallow(
            <CharityDetails
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'CharityDetails_description_p' }).exists()).toBe(true);
        expect(wrapper.find({ 'data-test': 'CharityDetails_new_description_p' }).exists()).toBe(true);
    });
    test('Testing component Without formattedDescription and formattedDescriptionNew', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    formattedDescription: null,
                    formattedDescriptionNew: null,
                },
            },
        };
        const wrapper = shallow(
            <CharityDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'CharityDetails_description_p' }).exists()).toBe(false);
        expect(wrapper.find({ 'data-test': 'CharityDetails_new_description_p' }).exists()).toBe(false);
    });
    test('Testing mapStateToProps', () => {
        const initialState = {
            auth: {
                isAuthenticated: false,
            },
            charity: {
                ...props,
            },
            user: {
                info: {
                    id: null,
                },
            },
        };
        expect(mapStateToProps(initialState).isAUthenticated).toBe(false);
    });
});
