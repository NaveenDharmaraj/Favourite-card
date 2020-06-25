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

describe('Testing Doneelist Component', () => {
    const props = getProps();
    it('Should render Doneelist modal', () => {
        const wrapper = mount(
            <ReceivingOrganisations
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_doneeListModal' }).exists()).toBe(true);
    });
    it('Should call getBeneficiaryDoneeList on ComponentDidMount', () => {
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
