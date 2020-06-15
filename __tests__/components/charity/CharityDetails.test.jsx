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
        expect(wrapper.find('.charity_profileWrap').exists()).toBe(true);
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
        expect(wrapper.find('.badge').exists()).toBe(false);
    });
    test('Testing component with causes', () => {
        const wrapper = shallow(
            <CharityDetails
                {...props}
            />,
        );
        expect(wrapper.find('.badge').exists()).toBe(true);
    });
    test('Testing component with formattedDescription and formattedDescriptionNew', () => {
        const wrapper = shallow(
            <CharityDetails
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'profile_charity_description' }).exists()).toBe(true);
        expect(wrapper.find({ 'data-test': 'profile_charity_new-description' }).exists()).toBe(true);
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
        expect(wrapper.find({ 'data-test': 'profile_charity_description' }).exists()).toBe(false);
        expect(wrapper.find({ 'data-test': 'profile_charity_new-description' }).exists()).toBe(false);
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
