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

describe('Testing Charity Information section', () => {
    const props = getProps();
    it('Should show charity information section using api data', () => {
        const wrapper = mount(
            <UserDetails
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInfoWrapper' }).exists()).toBe(true);
    });
    describe('Testing "claim charity" button behaviour', () => {
        it('Should show "claim charity" button if "isClaimed" field value is false in api data', () => {
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
            expect(wrapper.find({ 'data-test': 'Charity_UserDetails_claimCharitybutton' }).exists()).toBe(true);
        });
        it('Should not show "claim charity" button if "isClaimed" field value is true in api data', () => {
            const modifiedProps = {
                ...props,
                charityDetails: {
                    ...props.charityDetails,
                    attributes: {
                        ...props.charityDetails.attributes,
                        isClaimed: true,
                    },
                },
            };
            const wrapper = mount(
                <UserDetails
                    {...modifiedProps}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_UserDetails_claimCharitybutton' }).exists()).toBe(false);
        });
    });
    describe('Testing "Give" button behaviour', () => {
        it('Should match "Give" button url which redirect to give to charity for Login user', () => {
            const wrapper = mount(
                <UserDetails
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_UserDetails_giveButton_loggedInUser' }).at(0).prop('route'))
                .toEqual('/give/to/charity/the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge/gift/new');
        });
        it('Should match "Give" button url which redirect to OTD for Public user', () => {
            const wrapper = mount(
                <UserDetails
                    {...props}
                    isAuthenticated={false}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_UserDetails_giveButton_publicUser' }).prop('href'))
                .toContain('/send/to/charity/the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge/gift/new');
        });
        it('Should not show "Give" button if "hideGive" value is true in api response', () => {
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
            expect(wrapper.find({ 'data-test': 'Charity_UserDetails_giveButton' }).exists()).toBe(false);
        });
        it('Should show "Give" button if "hideGive" value is false in api response', () => {
            const modifiedProps = {
                ...props,
            };
            const wrapper = mount(
                <UserDetails
                    {...modifiedProps}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_UserDetails_giveButton' }).exists()).toBe(true);
        });
    });
    it('Should show contact name if "contactName" attibute has value in api data', () => {
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
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInformation_user' }).at(1).text()).toEqual('undefined: test contact name');
    });
    it('Should show phone number if "phone" attribute has value in api data', () => {
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
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInformation_phone' }).at(1).text()).toEqual('12345 67890');
    });
    it('Should show email address if "email" attribute has value in api data', () => {
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
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInformation_mail' }).at(1).text()).toEqual('test@charitableimpact.com');
    });
    it('Should show website address if "website" attribute has value in api data', () => {
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
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInformation_linkify' }).at(1).text()).toEqual('charitableimpact.com');
    });
    it('Should show Staff Count if "staffCount" attribute has value in api data', () => {
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
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInformation_users' }).at(1).text()).toEqual('42');
    });
    it('Should show Business Number if "businessNumber" attribute has value in api data', () => {
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
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInformation_briefcase' }).at(1).text()).toEqual('1234 5678');
    });
    it('Should show Headquarter Address if "headQuarterAddress" attribute has value in api data', () => {
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
        expect(wrapper.find({ 'data-test': 'Charity_UserDetails_charityInformation_marker' }).at(1).text()).toEqual('Vancover BC');
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
