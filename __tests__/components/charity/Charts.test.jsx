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

// import { ReceivingOrganisations } from '../../../components/charity/ReceivingOrganisations';

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

describe('Testing Chart Component', () => {
    const props = getProps();
    test('Testing Component rendered', () => {
        const wrapper = mount(
            <Charts
                {...props}
                isAUthenticated
                chartLoader={false}
            />,
        );
        expect(wrapper.find('Bar').exists()).toBe(true);
        // console.log('Wrap--->', wrapper.debug());
    });
    test('Testing Loader is rendered', () => {
        const wrapper = mount(
            <Charts
                chartLoader
            />,
        );
        expect(wrapper.find('Loader').exists()).toBe(true);
    });
    test('Testing No Data scenario', () => {
        const wrapper = mount(
            <Charts
                chartLoader={false}
            />,
        );
        expect(wrapper.find('CharityNoDataState').exists()).toBe(true);
    });
    test('Testing ComponentDidUpdate', () => {
        const wrapper = shallow(
            <Charts
                charityDetails={charityDetails}
                chartLoader={false}
            />,
        );
        wrapper.setProps({ beneficiaryFinance });
        expect(wrapper.state('chartIndex')).toEqual(8);
    });

    test('Testing ReceivingOrganisations render on view button click', () => {
        const wrapper = mount(
            <Provider store={store}>
                <Charts
                    {...props}
                    isAUthenticated
                    chartLoader={false}
                />
            </Provider>,
        );
        // wrapper.setState({ showDoneeListModal: true });
        // wrapper.find('.blue-bordr-btn-round-def').at(1).simulate('click');
        wrapper.find({ 'data-test': 'profile_charity_giftButton' }).at(1).simulate('click');
        expect(wrapper.find('ReceivingOrganisations').exists()).toBe(true);
        // console.log('state--->', wrapper.state('showDoneeListModal'));
    });

    test('Testing ReceivingOrganisations modal to close on close button click', () => {
        const wrapper = mount(
            <Provider store={store}>
                <Charts
                    {...props}
                    isAUthenticated
                    chartLoader={false}
                />
            </Provider>,
        );
        // wrapper.setState({ showDoneeListModal: true });
        // wrapper.find('.blue-bordr-btn-round-def').at(1).simulate('click');
        wrapper.find({ 'data-test': 'profile_charity_giftButton' }).at(1).simulate('click');
        wrapper.find('Portal').find('Icon').simulate('click');
        expect(wrapper.find('ReceivingOrganisations').exists()).toBe(false);
        // console.log('click 2--->', wrapper.debug());
        // console.log('state--->', wrapper.state('showDoneeListModal'));
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
