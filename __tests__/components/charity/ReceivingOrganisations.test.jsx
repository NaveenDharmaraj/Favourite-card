import React from 'react';
import {
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
    dispatch: jest.fn(),
    donationDetails: donationDetails._embedded.donee_list,
    remainingAmount: 1000,
    remainingElements: 22,
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
        expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_doneeListModal' }).exists()).toBe(true);
    });
    test('Testing ComponentDidMount', () => {
        const spyFunc = jest.spyOn(charityActions, 'getBeneficiaryDoneeList');
        const wrapper = mount(
            <ReceivingOrganisations
                dispatch={jest.fn()}
                donationDetails={[]}
                charityDetails
                year={2018}
            />,
        );
        expect(spyFunc).toHaveBeenCalledTimes(1);
    });
    test('Testing total amount rendered', () => {
        const wrapper = mount(
            <ReceivingOrganisations
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_totalAmount' }).exists()).toBe(true);
    });
    test('Testing mapStateToProps', () => {
        const initialState = {
            charity: {
                ...props,
            },
        };
        expect(mapStateToProps(initialState).remainingElements).toEqual(22);
    });
});
