
import React from 'react';
import {
    shallow,
} from 'enzyme';

import { DedicateGift } from '../../../components/Give/DedicateGift';

const initializeComponent = (props = {}) => shallow(<DedicateGift {...props} />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const props = {
            dedicateType: 'inHonorOf',
            dedicateValue: '',
            handleInputChange: jest.fn(),
            handleInputOnBlur: jest.fn(),
            validity: {
                doesAmountExist: true,
                isAmountCoverGive: true,
                isAmountLessThanOneBillion: true,
                isAmountMoreThanOneDollor: true,
                isDedicateGiftEmpty: true,
                isNoteToCharityInLimit: true,
                isNoteToSelfInLimit: true,
                isReloadRequired: true,
                isValidDecimalAmount: true,
                isValidGiveAmount: true,
                isValidGiveFrom: true,
                isValidGiveTo: true,
                isValidNoteSelfText: true,
                isValidNoteToCharity: true,
                isValidNoteToCharityText: true,
                isValidNoteToSelf: true,
                isValidPositiveNumber: true,
            }
        };
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    });
})

describe('Test state changes on click functionality', () => {
    const props = {
        dedicateType: 'inMemoryOf',
        dedicateValue: '',
        handleInputChange: jest.fn(),
        handleInputOnBlur: jest.fn(),
        validity: {
            doesAmountExist: true,
            isAmountCoverGive: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isDedicateGiftEmpty: true,
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isReloadRequired: true,
            isValidDecimalAmount: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidGiveTo: true,
            isValidNoteSelfText: true,
            isValidNoteToCharity: true,
            isValidNoteToCharityText: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
        }
    };

    it('Should give activeIndex state equal to -1 when both activeIndex & index are equal, on dedicate type click', () => {
        const component = initializeComponent(props);
        const e = {};
        const data = {
            index: 1,
            value: 'abc', 
        };
        component.find({ 'data-test': 'Give_DedicateGift_accordian_inhonor' }).simulate('click', e, data);
        expect(component.state('activeIndex')).toEqual(-1);
    });

    it('Should give activeIndex state equal to  index value when both activeIndex & index are not equal, on dedicate type click', () => {
        const component = initializeComponent(props);
        const e = {};
        const data = {
            index: 0,
            value: 'abc', 
        };
        component.find({ 'data-test': 'Give_DedicateGift_accordian_inhonor' }).simulate('click', e, data);
        expect(component.state('activeIndex')).toEqual(0);
    });
})
