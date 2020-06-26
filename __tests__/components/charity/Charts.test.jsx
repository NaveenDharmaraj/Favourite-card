import React from 'react';
import {
    shallow,
    mount,
} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import {
    Charts,
    mapStateToProps,
} from '../../../components/charity/Charts';

import {
    charityDetails,
    beneficiaryFinance,
    donationDetails,
} from './Data';

const getProps = () => ({
    beneficiaryFinance,
    charityDetails,
    currentPage: 1,
    dispatch: jest.fn(),
    donationDetails: donationDetails._embedded.donee_list,
    showButtonLoader: false,
    showPlaceholder: false,
    totalPages: 6,
    transactionsLoader: false,
    year: 2018,
});

const middlewares = [
    thunk,
];
const mockStore = configureMockStore(middlewares);
const newProps = getProps();
const store = mockStore({
    charity: {
        ...newProps,
    },
});

describe('Testing Chart Section', () => {
    const props = getProps();
    it('Should show Chart', () => {
        const wrapper = mount(
            <Charts
                {...props}
                isAUthenticated
                chartLoader={false}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_Charts_graph' }).exists()).toBe(true);
    });
    it('Should show Loader at chart section', () => {
        const wrapper = mount(
            <Charts
                chartLoader
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_Charts_Loader' }).exists()).toBe(true);
    });
    it('Should show No Data at chart section', () => {
        const wrapper = mount(
            <Charts
                chartLoader={false}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_CharityNoDataState_noData' }).exists()).toBe(true);
    });
    it('Should call ComponentDidUpdate on props change', () => {
        const wrapper = shallow(
            <Charts
                charityDetails={charityDetails}
                chartLoader={false}
            />,
        );
        wrapper.setProps({ beneficiaryFinance });
        expect(wrapper.state('chartIndex')).toEqual(8);
    });
    describe('Testing view button functionality', () => {
        it('Should open donee list Modal on click of view button', () => {
            const wrapper = mount(
                <Provider store={store}>
                    <Charts
                        {...props}
                        isAUthenticated
                        chartLoader={false}
                    />
                </Provider>,
            );
            wrapper.find({ 'data-test': 'Charity_ChartSummary_viewGiftButton' }).at(1).simulate('click');
            expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_doneeListModal'}).exists()).toBe(true);
        });
        it('Should close donee list modal on click of close icon', () => {
            const wrapper = mount(
                <Provider store={store}>
                    <Charts
                        {...props}
                        isAUthenticated
                        chartLoader={false}
                    />
                </Provider>,
            );
            wrapper.find({ 'data-test': 'Charity_ChartSummary_viewGiftButton' }).at(1).simulate('click');
            wrapper.find('Portal').find('Icon').simulate('click');
            expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_doneeListModal'}).exists()).toBe(false);
        });
    });

    test('Testing mapStateToProps', () => {
        const initialState = {
            charity: {
                beneficiaryFinance,
                charityDetails,
                chartLoader: false,
            },
        };
        expect(mapStateToProps(initialState).charityDetails.id).toEqual('87');
    });
});
