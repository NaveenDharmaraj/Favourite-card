import _orderBy from 'lodash/orderBy';
import _isEmpty from 'lodash/isEmpty';

const getSelectedYear = (beneficiaryFinance) => {
    let selectedYear = null;
    beneficiaryFinance.some((year) => {
        if (year.expenses.find((o) => o.name === 'total_expense').value > 0) {
            selectedYear = year.returns_year;
            return true;
        }
    });
    return selectedYear;
};

const getChartIndex = (beneficiaryFinance) => {
    const yearLabel = [];
    let selectedYear = null;
    if (!_isEmpty(beneficiaryFinance)) {
        selectedYear = getSelectedYear(beneficiaryFinance);
        const sortedData = _orderBy(beneficiaryFinance, [
            (data) => data.returns_year,
        ], [
            'asc',
        ]);
        sortedData.map((year) => {
            yearLabel.push(year.returns_year);
        });
        return yearLabel.indexOf(selectedYear);
    }
    return null;
};

const formatGraphData = (beneficiaryFinance, lang) => {
    const totalData = [];
    const yearLabel = [];
    const yearData = [];
    const revenueData = [];
    const firstData = [];
    const secondData = [];
    const thirdData = [];
    const fourthData = [];
    const fifthData = [];
    let graphData = {};
    if (!_isEmpty(beneficiaryFinance)) {
        const selectedYear = getSelectedYear(beneficiaryFinance);
        const sortedData = _orderBy(beneficiaryFinance, [
            (data) => data.returns_year,
        ], [
            'asc',
        ]);
        sortedData.map((year) => {
            yearLabel.push(year.returns_year);
            totalData.push({
                revenue_total: year.revenues[0].value,
                total_expense: year.expenses[0].value,
            });
            revenueData.push(year.revenues[0].value);
            if (year.expenses.find((o) => o.name === 'total_expense').value > 100000) {
                firstData.push(year.expenses.find((o) => o.name === 'charitable_activities_programs').value);
                secondData.push(year.expenses.find((o) => o.name === 'management_admin').value);
                thirdData.push(year.expenses.find((o) => o.name === 'fundraising').value);
                fourthData.push(year.expenses.find((o) => o.name === 'poilitical_activities').value);
                fifthData.push(year.expenses.find((o) => o.name === 'other').value);
                yearData.push([
                    {
                        color: '#C995D3',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.charitable_activities_programs,
                        value: year.expenses.find((o) => o.name === 'charitable_activities_programs').value,
                    },
                    {
                        color: '#DF005F',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.management_admin,
                        value: year.expenses.find((o) => o.name === 'management_admin').value,
                    },
                    {
                        color: '#FEC7A9',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.fundraising,
                        value: year.expenses.find((o) => o.name === 'fundraising').value,
                    },
                    {
                        color: '#00CCD4',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.poilitical_activities,
                        value: year.expenses.find((o) => o.name === 'poilitical_activities').value,
                    },
                    {
                        color: '#0D00FF',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.other,
                        value: year.expenses.find((o) => o.name === 'other').value,
                    },
                    {
                        color: '#8DEDAE',
                        hideGift: !(year.gifts_total > 0),
                        showViewButton: (year.gifts_total > 0),
                        text: lang.gifts_to_charities_donees,
                        value: year.expenses.find((o) => o.name === 'gifts_to_charities_donees').value,
                    },
                ]);
            } else {
                firstData.push(year.expenses.find((o) => o.name === 'prof_consult_fees').value);
                secondData.push(year.expenses.find((o) => o.name === 'travel_vehicle_expense').value);
                thirdData.push(year.expenses.find((o) => o.name === 'expenditure_charity_activites').value);
                fourthData.push(year.expenses.find((o) => o.name === 'management_admin').value);
                fifthData.push(year.expenses.find((o) => o.name === 'other').value);
                yearData.push([
                    {
                        color: '#C995D3',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.prof_consult_fees,
                        value: year.expenses.find((o) => o.name === 'prof_consult_fees').value,
                    },
                    {
                        color: '#DF005F',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.travel_vehicle_expense,
                        value: year.expenses.find((o) => o.name === 'travel_vehicle_expense').value,
                    },
                    {
                        color: '#FEC7A9',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.expenditure_charity_activites,
                        value: year.expenses.find((o) => o.name === 'expenditure_charity_activites').value,
                    },
                    {
                        color: '#00CCD4',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.management_admin,
                        value: year.expenses.find((o) => o.name === 'management_admin').value,
                    },
                    {
                        color: '#0D00FF',
                        hideGift: false,
                        showViewButton: false,
                        text: lang.other,
                        value: year.expenses.find((o) => o.name === 'other').value,
                    },
                    {
                        color: '#8DEDAE',
                        hideGift: !(year.gifts_total > 0),
                        showViewButton: (year.gifts_total > 0),
                        text: lang.gifts_to_charities_donees,
                        value: year.expenses.find((o) => o.name === 'gifts_to_charities_donees').value,
                    },
                ]);
            }
        });
        graphData = {
            fifthData,
            firstData,
            fourthData,
            revenueData,
            secondData,
            selectedYear,
            thirdData,
            totalData,
            yearData,
            yearLabel,
        };
    }
    return graphData;
};

export {
    formatGraphData,
    getChartIndex,
};
