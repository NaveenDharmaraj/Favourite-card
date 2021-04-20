import _orderBy from 'lodash/orderBy';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import { Button } from 'semantic-ui-react';

const getSelectedYear = (beneficiaryFinance) => {
    let selectedYear = null;
    beneficiaryFinance.some((year) => {
        if ((year.expenses.find((o) => o.name === 'total_expense').value > 0)
            || (year.revenues.find((o) => o.name === 'revenue_total').value > 0)) {
            selectedYear = year.returns_year;
            return true;
        }
    });
    return selectedYear;
};

const getChartIndex = (beneficiaryFinance) => {
    let selectedYear = null;
    if (!_isEmpty(beneficiaryFinance)) {
        selectedYear = getSelectedYear(beneficiaryFinance);
        const sortedData = _orderBy(beneficiaryFinance, [
            (data) => data.returns_year,
        ], [
            'asc',
        ]);
        return sortedData.findIndex((obj) => obj.returns_year === selectedYear);
    }
    return null;
};

const createChartData = (yearData, expensesArr, langMapping, colorArr) => {
    let finalData = {};
    const summaryData = [];
    const colorData = [];
    expensesArr.map((expense, index) => {
        const isGift = (expense === 'gifts_total');
        const expenseValue = !isGift ? yearData.expenses.find((o) => o.name === expense).value : yearData.gifts_total;
        colorData.push(expenseValue);
        summaryData.push(
            {
                color: colorArr[index],
                hideGift: isGift ? !(yearData.gifts_total > 0) : false,
                showViewButton: isGift ? (yearData.gifts_total > 0) : false,
                text: langMapping[expense],
                value: expenseValue,
            },
        );
    });
    finalData = {
        colorData,
        summaryData,
    };
    return finalData;
};

const formatGraphData = (beneficiaryFinance, langMapping, colorArr) => {
    const totalData = [];
    const yearLabel = [];
    const yearData = [];
    const revenueData = [];
    const firstData = [];
    const secondData = [];
    const thirdData = [];
    const fourthData = [];
    const fifthData = [];
    const sixthData = [];
    let graphData = {};
    if (!_isEmpty(beneficiaryFinance)) {
        const selectedYear = getSelectedYear(beneficiaryFinance);
        if (selectedYear) {
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
                let expensesArr = [];
                let chartData = [];
                revenueData.push(year.revenues[0].value);
                if (year.expenses.find((o) => o.name === 'total_expense').value > 100000) {
                    expensesArr = [
                        'charitable_activities_programs',
                        'management_admin',
                        'fundraising',
                        'poilitical_activities',
                        'other',
                        'gifts_total',
                    ];
                    chartData = createChartData(year, expensesArr, langMapping, colorArr);
                } else {
                    expensesArr = [
                        'prof_consult_fees',
                        'travel_vehicle_expense',
                        'expenditure_charity_activites',
                        'management_admin',
                        'other',
                        'gifts_total',
                    ];
                    chartData = createChartData(year, expensesArr, langMapping, colorArr);
                }
                firstData.push(chartData.colorData[0]);
                secondData.push(chartData.colorData[1]);
                thirdData.push(chartData.colorData[2]);
                fourthData.push(chartData.colorData[3]);
                fifthData.push(chartData.colorData[4]);
                sixthData.push(chartData.colorData[5]);
                yearData.push(chartData.summaryData);
            });
            graphData = {
                fifthData,
                firstData,
                fourthData,
                revenueData,
                secondData,
                selectedYear,
                sixthData,
                thirdData,
                totalData,
                yearData,
                yearLabel,
            };
        }
    }
    return graphData;
};

const formatChartAmount = (value, language, currencyType) => {
    const currencyFormat = {
        currency: currencyType,
        minimumFractionDigits: 0,
        style: 'currency',
    };
    const amountFormatter = new Intl.NumberFormat(language, currencyFormat);
    const val = value > 999
        ? `${amountFormatter.format((value / 1000).toFixed(0))}K`
        : amountFormatter.format(value);
    return val;
};

const getLocation = (city, province) => {
    let location = '';
    if (_isEmpty(city) && !_isEmpty(province)) {
        location = province;
    } else if (!_isEmpty(city) && _isEmpty(province)) {
        location = city;
    } else if (!_isEmpty(city) && !_isEmpty(province)) {
        location = `${city}, ${province}`;
    }
    return location;
};

const getPrivacyType = (visibility) => {
    let type = '';
    switch (visibility) {
        case 0:
            type = 'globe';
            break;
        case 1:
            type = 'users';
            break;
        case 2:
            type = 'lock';
            break;
        default:
            break;
    }
    return type;
};

/**
 * Displaying see more button for pagination
 * @param {boolean} loader
 * @param {handleSeeMore} cb - The callback that handles the onClick event of see more.
 * @return {HTMLElement} returns a see more button
 */
const displaySeeMoreButton = (loader = false, handleSeeMore = () => { }) => {
    return (
        <div className="text-centre">
            <Button
                className="blue-bordr-btn-round-def"
                onClick={handleSeeMore}
                loading={loader}
                disabled={loader}
                content="See more"
            />
        </div>
    )
};
/**
 * Display the record counts in the array
 * @param {Array} dataArr total length of the data array loaded
 * @param { number } totalRecordCount total number of records present
 * @return {HTMLElement} returns the count of records and total records
 */
const displayRecordCount = (dataArr = [], totalRecordCount = 0) => {
    const countText = `Showing ${_size(dataArr)} of ${totalRecordCount}`;
    return (
        <div className="result">{countText}</div>
    );
}
export {
    createChartData,
    displayRecordCount,
    displaySeeMoreButton,
    formatGraphData,
    getChartIndex,
    getSelectedYear,
    formatChartAmount,
    getLocation,
    getPrivacyType,
};
