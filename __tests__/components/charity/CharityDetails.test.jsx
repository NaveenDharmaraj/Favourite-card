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
    currentUser: {
        id: 888000,
    },
});

describe('Testing CharityDetails section', () => {
    const props = getProps();
    it('Should show Charity page using api data', () => {
        const wrapper = shallow(
            <CharityDetails
                {...props}
                isAUthenticated
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_wrapper' }).exists()).toBe(true);
    });
    describe('Testing Causes section', () => {
        it('Should not show causes if "causes" field is empty in the api response', () => {
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
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_causes' }).length).toEqual(0);
        });
        it('Should show causes if "causes" field is having data in api response', () => {
            const wrapper = shallow(
                <CharityDetails
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_causes' }).length).toEqual(3);
        });
    });
    describe('Testing description section', () => {
        it('Should show description if "formattedDescription" and "formattedDescriptionNew" fields are having data in api response', () => {
            const wrapper = shallow(
                <CharityDetails
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_description' }).exists()).toBe(true);
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_new_description' }).exists()).toBe(true);
        });
        it('Should not show description if "formattedDescription" and "formattedDescriptionNew" fields are null in api response', () => {
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
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_description' }).exists()).toBe(false);
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_new_description' }).exists()).toBe(false);
        });
        it('Should show only one description if "formattedDescription" field has data and "formattedDescriptionNew" field is null in api response', () => {
            const modifiedProps = {
                ...props,
                charityDetails: {
                    ...props.charityDetails,
                    attributes: {
                        ...props.charityDetails.attributes,
                        formattedDescriptionNew: null,
                    },
                },
            };
            const wrapper = shallow(
                <CharityDetails
                    {...modifiedProps}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_description' }).exists()).toBe(true);
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_new_description' }).exists()).toBe(false);
        });
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
