import React from 'react';
import {
    shallow,
    mount,
} from 'enzyme';

import ChartSummary from '../../../components/charity/ChartSummary';

describe('Testing chart summary component', () => {
    test('Testing component rendered', () => {
        const wrapper = mount(
            <ChartSummary
                color="#C995D3"
                text="Fundraising"
                value={10000}
                hideGift={false}
                handleClick={() => {}}
                showViewButton={false}
                t={() => {}}
            />,
        );
        expect(wrapper.find('.expenseRow').exists()).toBe(true);
    });
    test('Testing hide summary', () => {
        const wrapper = mount(
            <ChartSummary
                color="#C995D3"
                text="Fundraising"
                value={10000}
                hideGift
                handleClick={() => {}}
                showViewButton={false}
                t={() => {}}
            />,
        );
        expect(wrapper.find('.expenseRow').exists()).toBe(false);
    });
    test('Testing gift summary', () => {
        const wrapper = mount(
            <ChartSummary
                color="#C995D3"
                text="Fundraising"
                value={10000}
                hideGift={false}
                handleClick={() => {}}
                showViewButton
                t={() => {}}
            />,
        );
        expect(wrapper.find({ 'data-test': 'giftButton' }).exists()).toBe(true);
    });
});
