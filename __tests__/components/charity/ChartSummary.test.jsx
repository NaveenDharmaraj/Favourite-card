import React from 'react';
import {
    mount,
} from 'enzyme';

import ChartSummary from '../../../components/charity/ChartSummary';

const getProps = () => ({
    color: "#C995D3",
    text: "Fundraising",
    value: 10000,
    hideGift: false,
    handleClick: jest.fn(),
    showViewButton: false,
    t: jest.fn()
});

describe('Testing chart summary component', () => {
    const props = getProps();
    test('Testing component rendered', () => {
        const wrapper = mount(
            <ChartSummary
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ChartSummary_expenses_summary' }).exists()).toBe(true);
    });
    test('Testing hide summary', () => {
        const wrapper = mount(
            <ChartSummary
                {...props}
                hideGift
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ChartSummary_expenses_summary' }).exists()).toBe(false);
    });
    test('Testing gift summary', () => {
        const wrapper = mount(
            <ChartSummary
                {...props}
                showViewButton
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ChartSummary_viewGiftButton' }).exists()).toBe(true);
    });
});
