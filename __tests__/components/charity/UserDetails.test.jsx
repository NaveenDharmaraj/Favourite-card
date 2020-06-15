import React from 'react';
import {
    mount,
} from 'enzyme';

import {
    UserDetails,
    mapStateToProps,
} from '../../../components/charity/UserDetails';

import {
    charityDetails,
} from './Data';

const getProps = () => ({
    charityDetails,
    isAuthenticated: true,
});

describe('Testing UserDetails component', () => {
    const props = getProps();
    test('Testing component rendered', () => {
        const wrapper = mount(
            <UserDetails
                {...props}
            />,
        );
        expect(wrapper.find('.charityInfowrap').exists()).toBe(true);
    });
    test('Testing claimed charity scenario', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    isClaimed: false,
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find('.charityInfoClaim').exists()).toBe(true);
    });
    test('Testing button url for Login user', () => {
        const wrapper = mount(
            <UserDetails
                {...props}
            />,
        );
        expect(wrapper.find('Link').find(
            {
                'href': '/charities?slug=the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge&gift=gift&step=new'
            },
        ).exists()).toBe(true);
    });
    test('Testing button url for Public user', () => {
        const wrapper = mount(
            <UserDetails
                {...props}
                isAuthenticated={false}
            />,
        );
        expect(wrapper.find('a').find(
            {
                'href': 'undefined/send/to/charity/the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge/gift/new'
            },
        ).exists()).toBe(true);
    });
    test('Testing show Give button scenario', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    hideGive: true,
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'profile_charity_give_button' }).exists()).toBe(false);
    });
    test('Testing contactName does not exists', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    contactName: '',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find('i').find('.user').exists()).toBe(false);
    });
    test('testing phone number does not exists', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    phone: '',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find('i').find('.phone').exists()).toBe(false);
    });
    test('testing email address does not exists', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    email: '',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find('i').find('.mail').exists()).toBe(false);
    });
    test('testing website address does not exists', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    website: '',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find('i').find('.linkify').exists()).toBe(false);
    });
    test('testing staff does not exists', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    staffCount: 0,
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find('i').find('.users').exists()).toBe(false);
    });
    test('testing Business Number does not exists', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    businessNumber: '',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />
        );
        expect(wrapper.find('i').find('.briefcase').exists()).toBe(false);
    });
    test('testing Headquarter Address does not exists', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    headQuarterAddress: '',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find('i').find('.marker').exists()).toBe(false);
    });
    test('Testing mapStateToProps', () => {
        const initialState = {
            auth: {
                isAuthenticated: true,
            },
            charity: {
                charityDetails,
            },
        };
        expect(mapStateToProps(initialState).charityDetails.id).toEqual('87');
    });
});
