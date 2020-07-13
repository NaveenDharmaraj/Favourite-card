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
    charityDetails: {
        id: '87',
    },
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
    it('Should show Chart using api data', () => {
        const wrapper = mount(
            <Charts
                {...props}
                isAUthenticated
                chartLoader={false}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_Charts_graph' }).exists()).toBe(true);
    });
    it('Should show loader at chart section while calling api', () => {
        const wrapper = mount(
            <Charts
                chartLoader
                charityDetails={charityDetails}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_Charts_Loader' }).exists()).toBe(true);
    });
    it('Should show No Data at chart section for empty api response', () => {
        const wrapper = mount(
            <Charts
                chartLoader={false}
                charityDetails={charityDetails}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_CharityNoDataState_noData' }).exists()).toBe(true);
    });
    it('Should call ComponentDidUpdate after getting api data', () => {
        const wrapper = shallow(
            <Charts
                charityDetails={charityDetails}
                chartLoader={false}
            />,
        );
        wrapper.setProps({ beneficiaryFinance });
        expect(wrapper.state('chartIndex')).toEqual(8);
    });
    describe('Testing "view gifts" button functionality', () => {
        it('Should open donee list popup on click of "view gifts" button', () => {
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
            expect(wrapper.find({ 'data-test': 'Charity_ReceivingOrganisations_doneeListModal' }).exists()).toBe(true);
        });
        it('Should close donee list popup on click of close icon', () => {
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
