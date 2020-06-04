import React from 'react';
import {
    shallow,
    mount,
} from 'enzyme';

import {
    ReceivingOrganisations,
    mapStateToProps,
} from '../../../components/charity/ReceivingOrganisations';
import * as charityActions from '../../../actions/charity';

import {
    charityDetails,
    donationDetails,
} from './Data';

const getProps = () => ({
    charityDetails,
    currentPage: 1,
    dispatch: jest.fn(),
    donationDetails: donationDetails._embedded.donee_list,
    showButtonLoader: false,
    totalPages: 6,
    transactionsLoader: false,
    year: 2018,
});

describe('Testing ReceivingOrganisation Component', () => {
    const props = getProps();
    test('Testing component render', () => {
        const wrapper = mount(
            <ReceivingOrganisations
                {...props}
            />,
        );
        expect(wrapper.find('.ScrollData').exists()).toBe(true);
    });
    test('Testing ComponentDidMount', () => {
        const spyFunc = jest.spyOn(charityActions, 'getBeneficiaryDoneeList');
        const wrapper = mount(
            <ReceivingOrganisations
                dispatch= {jest.fn()}
                donationDetails={[]}
                charityDetails
                year={2018}
            />,
        );
        expect(spyFunc).toHaveBeenCalledTimes(1);
    });
    test('Testing load more donee list', () => {
        const spyFunc = jest.spyOn(charityActions,'getBeneficiaryDoneeList')
        const wrapper = mount(
            <ReceivingOrganisations
                {...props}
            />,
        );
        wrapper.find({'data-test': 'profile_charity_load_more_button'}).at(1).simulate('click');
        expect(spyFunc).toHaveBeenCalledTimes(2);
    });
    test('Testing Loader', () => {
        const wrapper = mount(
            <ReceivingOrganisations
                {...props}
                showButtonLoader
            />,
        );
        // console.log('loader--->', wrapper.debug());
        expect(wrapper.find('Icon').find('.spinner').exists()).toBe(true);
    });
    test('Testing mapStateToProps', () => {
        const initialState = {
            charity: {
                ...props,
            },
        };
        expect(mapStateToProps(initialState).totalPages).toEqual(6);
    });
});
