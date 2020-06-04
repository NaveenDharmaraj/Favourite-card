import React from 'react';
import {
    shallow,
    mount,
} from 'enzyme';

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
    totalPages: 6,
    transactionsLoader: false,
    year: 2018,
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
    // test('Testing ComponentDidUpdate', () => {
    //     const wrapper = mount(
    //         <Charts
    //             charityDetails={charityDetails}
    //             chartLoader={false}
    //         />,
    //     );
    //     wrapper.setProps({ beneficiaryFinance: beneficiaryFinance});
    //     console.log('CONSOLE--->', wrapper.state('chartIndex'));
    // });

    // test('Testing Doneelist Modal status', () => {
    //     const wrapper = mount(
    //         <Charts
    //             {...props}
    //             isAUthenticated
    //             chartLoader={false}
    //         />,
    //     );
    //     console.log('click--->', wrapper.debug());
    //     // wrapper.find('.blue-bordr-btn-round-def').at(1).simulate('click');
    //     wrapper.find({'data-test': 'giftButton'}).at(1).simulate('click');
    //     console.log('state--->', wrapper.state('showDoneeListModal'));
    // });

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
