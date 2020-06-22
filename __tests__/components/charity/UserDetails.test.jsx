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
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInfoWrapper_div' }).exists()).toBe(true);
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
        expect(wrapper.find({ 'data-test': 'UserDetails_claimCharitybutton_button' }).exists()).toBe(true);
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
                'href': 'undefined/send/to/charity/the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge/gift/new',
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
        expect(wrapper.find({ 'data-test': 'UserDetails_giveButton_button' }).exists()).toBe(false);
    });
    test('Testing contactName', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    contactName: 'test contact name',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInformation_user' }).at(1).text()).toEqual('undefined: test contact name');
    });
    test('Testing phone number', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    phone: '12345 67890',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInformation_phone' }).at(1).text()).toEqual('12345 67890');
    });
    test('Testing email address', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    email: 'test@charitableimpact.com',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInformation_mail' }).at(1).text()).toEqual('test@charitableimpact.com');
    });
    test('Testing website address', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    website: 'charitableimpact.com',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInformation_linkify' }).at(1).text()).toEqual('charitableimpact.com');
    });
    test('Testing Staff Count', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    staffCount: 42,
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInformation_users' }).at(1).text()).toEqual('42');
    });
    test('Testing Business Number', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    businessNumber: '1234 5678',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInformation_briefcase' }).at(1).text()).toEqual('1234 5678');
    });
    test('testing Headquarter Address', () => {
        const modifiedProps = {
            ...props,
            charityDetails: {
                ...props.charityDetails,
                attributes: {
                    ...props.charityDetails.attributes,
                    headQuarterAddress: 'Vancover BC',
                },
            },
        };
        const wrapper = mount(
            <UserDetails
                {...modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'UserDetails_charityInformation_marker' }).at(1).text()).toEqual('Vancover BC');
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
