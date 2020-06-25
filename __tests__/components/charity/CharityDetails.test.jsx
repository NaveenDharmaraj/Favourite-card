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
    it('Should render Charity page', () => {
        const wrapper = shallow(
            <CharityDetails
                {...props}
                isAUthenticated
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_wrapper' }).exists()).toBe(true);
    });
    describe('Testing Causes section', () => {
        it('Should not render causes', () => {
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
        it('Should render causes', () => {
            const wrapper = shallow(
                <CharityDetails
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_causes' }).length).toEqual(3);
        });
    });
    describe('Testing description section', () => {
        it('Should render description', () => {
            const wrapper = shallow(
                <CharityDetails
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_description' }).exists()).toBe(true);
            expect(wrapper.find({ 'data-test': 'Charity_CharityDetails_new_description' }).exists()).toBe(true);
        });
        it('Should not render description', () => {
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
