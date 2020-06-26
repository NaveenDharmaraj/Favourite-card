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

describe('Testing Doneelist popup', () => {
    const props = getProps();
    it('Should show donee list popup', () => {
        const wrapper = mount(
            <ReceivingOrganisations
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_doneeListModal' }).exists()).toBe(true);
    });
    it('Should show donee lists', () => {
        const wrapper = mount(
            <ReceivingOrganisations
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_donee' }).exists()).toBe(true);
    });
    it('Should call api action to get donee list', () => {
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
    describe('Testing total amount of remaining organisations section', () => {
        it('Should show remaining organisations', () => {
            const wrapper = mount(
                <ReceivingOrganisations
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_totalAmount' }).exists()).toBe(true);
        });
        it('Should not show remaining organisations', () => {
            const wrapper = mount(
                <ReceivingOrganisations
                    {...props}
                    remainingElements={19}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_totalAmount' }).exists()).toBe(false);
        });
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
