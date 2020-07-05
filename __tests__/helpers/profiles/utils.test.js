import {
    createChartData,
    formatGraphData,
    getChartIndex,
    getSelectedYear,
} from '../../../helpers/profiles/utils';

import * as utilData from './Data';

describe('Testing profile pages util functions', () => {
    describe('Testing Charity profile util functions', () => {
        const {
            beneficiaryFinance,
            langMapping,
            colorArr,
            graphData,
            yearData,
            expensesArr,
            finalData,
        } = utilData;
        it('Should return formatted data of all years for charts using api data', () => {
            expect(formatGraphData(beneficiaryFinance, langMapping, colorArr)).toEqual(graphData);
        });
        it('Should return empty data if api data is empty', () => {
            expect(formatGraphData([], langMapping, colorArr)).toEqual({});
        });
        it('Should return summary section data using api data', () => {
            expect(createChartData(yearData, expensesArr, langMapping, colorArr)).toEqual(finalData);
        });
        it('Should return year to be highlighted in chart using api data', () => {
            expect(getSelectedYear(beneficiaryFinance)).toEqual(2019);
        });
        it('Should return index of initial year to be highlighted in chart using api data', () => {
            expect(getChartIndex(beneficiaryFinance)).toEqual(8);
        });
        it('Should return null if api data is empty', () => {
            expect(getChartIndex([])).toEqual(null);
        });
    });
});
