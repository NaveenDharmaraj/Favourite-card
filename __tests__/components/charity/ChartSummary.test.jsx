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

describe('Testing chart summary section', () => {
    const props = getProps();
    it('Should render summary section', () => {
        const wrapper = mount(
            <ChartSummary
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ChartSummary_expenses_summary' }).exists()).toBe(true);
    });
    it('Should hide gift in summary section', () => {
        const wrapper = mount(
            <ChartSummary
                {...props}
                hideGift
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ChartSummary_expenses_summary' }).exists()).toBe(false);
    });
    it('Should show view button for gift', () => {
        const wrapper = mount(
            <ChartSummary
                {...props}
                showViewButton
            />,
        );
        expect(wrapper.find({ 'data-test': 'Charity_ChartSummary_viewGiftButton' }).exists()).toBe(true);
    });
});
