import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import _orderBy from 'lodash/orderBy';
import {
    Bar,
} from 'react-chartjs-2';
import {
    Grid,
} from 'semantic-ui-react';

import {
    formatCurrency,
    formatAmount,
} from '../../helpers/give/utils';

import Data from './Data';
import CharityNoDataState from './CharityNoDataState';
import ChartSummary from './ChartSummary';

class Charts extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.renderSummary = this.renderSummary.bind(this);
        this.highlightBar = this.highlightBar.bind(this);
        this.chartReference = React.createRef();
        this.state = {
            chartIndex: 4,
            graphData: this.createGraphData(),
        };
    }

    componentDidMount() {
        this.highlightBar();
    }

    componentDidUpdate() {
        this.highlightBar();
    }

    getChartData(type, values) {
        const {
            graphData: {
                yearLabel,
                revenueData,
                firstData,
                secondData,
                thirdData,
                fourthData,
                fifthData,
            },
        } = this.state;
        const {
            graphValues,
            otherGraphValues,
        } = values;
        let percentageData = [];
        const actualData = [];
        let totalAmount = null;
        let labelsData = [];
        let bgColor = [];
        // To show label in next line we pass single label into array.
        switch (type) {
            case 'revenue':
                labelsData = [
                    2011,
                    2012,
                    2013,
                    2014,
                    2015,
                    2016,
                    2017,
                    2018,
                    2019,
                    2020,
                ];
                percentageData = [
                    graphValues.revenue_tax_receipted_cash,
                    graphValues.revenue_tax_receipted_non_cash,
                    graphValues.revenue_other_charities,
                    graphValues.revenue_non_tax_receipted,
                    graphValues.revenue_government,
                    otherGraphValues.revenue_other,
                ];
                totalAmount = graphValues.revenue_total;
                break;
            case 'expenditure':
                labelsData = [
                    'Programs',
                    'Fundraising',
                    [
                        'Management',
                        'and Admin',
                    ],
                    [
                        'Gifts to',
                        'Qualified Donees',
                    ],
                    'Other',
                ];
                percentageData = [
                    graphValues.expenditure_programs,
                    graphValues.expenditure_fundraising,
                    graphValues.expenditure_mgmt_admin,
                    graphValues.expenditure_qualified_donees,
                    otherGraphValues.expenditure_other,
                ];
                totalAmount = graphValues.expenditure_total;
                break;
            case 'assets':
                labelsData = [
                    'Cash',
                    'Receivables',
                    'Investments',
                    [
                        'Land, Buildings',
                        'and Capital,Assets',
                    ],
                    'Other',
                ];
                percentageData = [
                    graphValues.assets_cash,
                    graphValues.assets_receivable,
                    graphValues.assets_invested,
                    graphValues.assets_land_buildings_capital,
                    otherGraphValues.assets_other,
                ];
                totalAmount = graphValues.assets_total;
                break;
            case 'liabilities':
                labelsData = [
                    [
                        'Short term,',
                        'arm’s length',
                    ],
                    'Non-arm’s length',
                    'Other',
                ];
                percentageData = [
                    graphValues.liabilities_short_term_arms_length,
                    graphValues.liabilities_non_arms_length,
                    otherGraphValues.liabilities_other,
                ];
                totalAmount = graphValues.liabilities_total;
                break;
            case 'breakdown_of_Programs':
                bgColor = [
                    '#009585',
                    '#00bba7',
                    '#32c8b8',
                ];
                values.charityPrograms.map((program) => {
                    labelsData.push(program.name);
                    actualData.push(program.percentage);
                });
                break;
            default:
                break;
        }
        if (_.isEmpty(actualData)) {
            percentageData.map((data) => {
                actualData.push(Math.round((data * 100) / totalAmount));
            });
        }
        const data = {
            datasets: [
                {
                    label: 'Revenue',
                    type: 'line',
                    data: revenueData, // [10,20,30,40,50,60,70,80,90,15],
                    fill: false,
                    lineTension: 0,
                    borderColor: '#055CE5',
                    backgroundColor: '#055CE5',
                    pointBorderColor: '#055CE5',
                    pointBackgroundColor: '#055CE5',
                    pointHoverBackgroundColor: '#055CE5',
                    pointHoverBorderColor: '#055CE5',
                },
                {
                    backgroundColor: '#C995D370',
                    barThickness: 6,
                    data: firstData, // [15,25,35,45,55,65,75,85,95,105],
                    fill: false,
                },
                {
                    backgroundColor: '#DF005F70',
                    barThickness: 6,
                    data: secondData, // [10,20,30,40,50,60,70,80,90,100],
                    fill: false,
                },
                {
                    barThickness: 6,
                    backgroundColor: '#FEC7A970',
                    data: thirdData, // [20,40,60,80,100,20,40,60,80,100],
                    fill: false,
                },
                {
                    backgroundColor: '#00CCD470',
                    barThickness: 6,
                    data: fourthData, // [12,24,36,48,60,72,84,96,108,120],
                    fill: false,
                },
                {
                    backgroundColor: '#0D00FF70',
                    barThickness: 6,
                    data: fifthData, // [10,20,30,40,100,20,40,60,80,100],
                    fill: false,
                },
            ],
            labels: yearLabel,
        };
        return data;
    }

    handleClick (event) {
        if (!_.isEmpty(event)) {
            this.setState({
                chartIndex: event[0]._index,
            });
        }
    }

    highlightBar() {
        const {
            current: {
                chartInstance,
            },
        } = this.chartReference;
        const {
            chartIndex,
        } = this.state;
        chartInstance.reset();
        chartInstance.update();

        chartInstance.getDatasetMeta(1).data[chartIndex]._model.backgroundColor = '#C995D3';
        chartInstance.getDatasetMeta(2).data[chartIndex]._model.backgroundColor = '#DF005F';
        chartInstance.getDatasetMeta(3).data[chartIndex]._model.backgroundColor = '#FEC7A9';
        chartInstance.getDatasetMeta(4).data[chartIndex]._model.backgroundColor = '#00CCD4';
        chartInstance.getDatasetMeta(5).data[chartIndex]._model.backgroundColor = '#0D00FF';
    }

    createGraphData() {
        const {
            chartData,
        } = this.props;
        const sortedData = _orderBy(chartData, [
            (data) => data.returns_year,
        ], [
            'asc',
        ]);
        const totalData = [];
        const yearLabel = [];
        const yearData = [];
        const revenueData = [];
        let firstData = [];
        let secondData = [];
        let thirdData = [];
        let fourthData = [];
        let fifthData = [];
        let graphData = {};
        // const mapping = {
        //     charitable_activities_programs: 'Charitable activities / programs',
        //     expenditure_charity_activites: 'Expenditures on charitable activities',
        //     fundraising: 'Fundraising',
        //     management_admin: 'Management and administration',
        //     other: 'Other',
        //     poilitical_activities: 'Political activities',
        //     prof_consult_fees: 'Professional and consulting fees',
        //     travel_vehicle_expense: 'Travel and vehicle expenses',
        // };
        sortedData.map((year) => {
            yearLabel.push(year.returns_year);
            totalData.push({
                revenue_total: year.revenues[0].value,
                total_expense: year.expenses[0].value,
            });
            revenueData.push(year.revenues[0].value);
            firstData.push(year.expenses[1].value);
            secondData.push(year.expenses[2].value);
            thirdData.push(year.expenses[3].value);
            fourthData.push(year.expenses[4].value);
            fifthData.push(year.expenses[5].value);
            if (year.expenses[0].value > 100000) {
                yearData.push([
                    {
                        color: '#C995D3',
                        text: 'Charitable activities / programs',
                        value: year.expenses[1].value,
                    },
                    {
                        color: '#DF005F',
                        text: 'Management and administration',
                        value: year.expenses[2].value,
                    },
                    {
                        color: '#FEC7A9',
                        text: 'Fundraising',
                        value: year.expenses[3].value,
                    },
                    {
                        color: '#00CCD4',
                        text: 'Political activities',
                        value: year.expenses[4].value,
                    },
                    {
                        color: '#0D00FF',
                        text: 'Other',
                        value: year.expenses[5].value,
                    },
                ]);
            } else {
                yearData.push([
                    {
                        color: '#C995D3',
                        text: 'Professional and consulting fees',
                        value: year.expenses[1].value,
                    },
                    {
                        color: '#DF005F',
                        text: 'Travel and vehicle expenses',
                        value: year.expenses[2].value,
                    },
                    {
                        color: '#FEC7A9',
                        text: 'Expenditures on charitable activities',
                        value: year.expenses[3].value,
                    },
                    {
                        color: '#00CCD4',
                        text: 'Management and administration',
                        value: year.expenses[4].value,
                    },
                    {
                        color: '#0D00FF',
                        text: 'Other',
                        value: year.expenses[5].value,
                    },
                ]);
            }
        });
        graphData = {
            expenseData: {
                revenueData,
                yearData,
            },
            revenueData,
            totalData,
            yearData,
            yearLabel,
            firstData,
            secondData,
            thirdData,
            fourthData,
            fifthData,
        };
        return graphData;
    }

    validateData() {
        const {
            values: {
                graphValues,
                otherGraphValues,
                charityPrograms,
            },
        } = this.props;
        const status = {
            assets: false,
            breakdown_of_Programs: false,
            expenditure: false,
            liabilities: false,
            revenue: false,
        };
        const revenueChart = [];
        const expenditureChart = [];
        const assetsChart = [];
        const liabilitiesChart = [];
        const charityProgramsChart = [];
        if (!_.isEmpty(graphValues)) {
            revenueChart.push(graphValues.revenue_tax_receipted_cash,
                graphValues.revenue_tax_receipted_non_cash,
                graphValues.revenue_other_charities,
                graphValues.revenue_non_tax_receipted,
                graphValues.revenue_government);
            expenditureChart.push(
                graphValues.expenditure_programs,
                graphValues.expenditure_fundraising,
                graphValues.expenditure_mgmt_admin,
                graphValues.expenditure_qualified_donees,
            );
            assetsChart.push(
                graphValues.assets_cash,
                graphValues.assets_receivable,
                graphValues.assets_invested,
                graphValues.assets_land_buildings_capital,
            );
            liabilitiesChart.push(
                graphValues.liabilities_short_term_arms_length,
                graphValues.liabilities_non_arms_length,
            );
        }
        if (!_.isEmpty(otherGraphValues)) {
            revenueChart.push(otherGraphValues.revenue_other);
            expenditureChart.push(otherGraphValues.expenditure_other);
            assetsChart.push(otherGraphValues.assets_other);
            liabilitiesChart.push(otherGraphValues.liabilities_other);
        }
        if (!_.isEmpty(charityPrograms)) {
            charityPrograms.map((program) => (
                charityProgramsChart.push(program.percentage)
            ));
        }

        if (!_.isEmpty(revenueChart) && Math.max(...revenueChart) > 0) {
                status.revenue = true;
        }
        if (!_.isEmpty(expenditureChart) && Math.max(...expenditureChart) > 0) {
                status.expenditure = true;
        }
        if (!_.isEmpty(assetsChart) && Math.max(...assetsChart) > 0) {
                status.assets = true;
        }
        if (!_.isEmpty(liabilitiesChart) && Math.max(...liabilitiesChart) > 0) {
                status.liabilities = true;
        }
        if (!_.isEmpty(charityProgramsChart) && Math.max(...charityProgramsChart) > 0) {
                status.breakdown_of_Programs = true;
        }
        return status;
    }

    renderSummary() {
        const {
            graphData,
            chartIndex,
        } = this.state;
        const selectedData = graphData.yearData[chartIndex];
        return (
            selectedData.map((summary) => (
                <ChartSummary
                    color={summary.color}
                    text={summary.text}
                    value={summary.value}
                />
            ))
        );
    }

    render() {
        const {
            values,
        } = this.props;
        const currency = 'USD';
        const language = 'en';
        const yearData = (values && values.year) ? values.year : '';
        let showCharts = false;
        const status = this.validateData();
        if (status.revenue || status.expenditure || status.assets || status.liabilities || status.breakdown_of_Programs) {
            showCharts = true;
        }
        // TODO 'language' from withTranslation
        return (
            <Grid stackable columns="1">
                <Grid.Row>
                    {showCharts
                        ? (
                            <Fragment>
                                {status.revenue
                                && (
                                    <Grid.Column>
                                        <Bar
                                            // onClick={this.getElementAtEvent}
                                            // getDatasetAtEvent={this.handleClick}
                                            onElementsClick={this.handleClick}
                                            ref={this.chartReference}
                                            data={this.getChartData('revenue', values)}
                                            width={100}
                                            height={400}
                                            options={{
                                                events: [
                                                    'click',
                                                ],
                                                legend: false,
                                                maintainAspectRatio: false,
                                                // plugins: {
                                                //     datalabels: {
                                                //         align: 'end',
                                                //         anchor: 'end',
                                                //     },
                                                // },
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            stacked: true,
                                                            display: true,
                                                            // ticks: {
                                                            //     beginAtZero: true,
                                                            //     max: 100,
                                                            //     steps: 10,
                                                            //     stepValue: 5,
                                                            // },
                                                            gridLines: {
                                                                display: false,
                                                            },
                                                            categoryPercentage: 0.5,
                                                        },
                                                    ],
                                                    yAxes: [
                                                        {
                                                            stacked: true,
                                                            // type: 'linear',
                                                            // display: true,
                                                            // position: 'left',
                                                            // gridLines: {
                                                            //     display: true,
                                                            // },
                                                            // labels: {
                                                            //     show: true,
                                                            // },

                                                            // ticks: {
                                                            //     // Include a dollar sign in the ticks
                                                            //     callback: (value, index, values) => {
                                                            //         return `$${value}K`;
                                                            //     },
                                                            // }
                                                        },
                                                    ],
                                                },
                                                title: {
                                                    display: true,
                                                    text: `${yearData} Revenues: ${(values) && formatCurrency(values.graphValues.revenue_total, language, currency)}`,
                                                },
                                                tooltips: false,
                                            }}
                                        />
                                    </Grid.Column>
                                )
                                }
                                <div>
                                    {this.renderSummary()}
                                </div>
                                {/* {status.expenditure
                                && (
                                    <Grid.Column style={{ marginBottom: '30px' }}>
                                        <HorizontalBar
                                            data={Charts.getChartData('expenditure', values)}
                                            width={100}
                                            height={400}
                                            options={{
                                                legend: false,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    datalabels: {
                                                        align: 'end',
                                                        anchor: 'end',
                                                    },
                                                },
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            display: true,
                                                            ticks: {
                                                                beginAtZero: true,
                                                                max: 100,
                                                                steps: 10,
                                                                stepValue: 5,
                                                            },
                                                        },
                                                    ],
                                                },
                                                title: {
                                                    display: true,
                                                    text: `${yearData} Expenditures: ${(values) && formatCurrency(values.graphValues.expenditure_total, language, currency)}`,
                                                },
                                                tooltips: false,
                                            }}
                                        />
                                    </Grid.Column>
                                )}
                                <Divider />
                                {status.assets
                                && (
                                    <Grid.Column style={{ marginBottom: '30px' }}>
                                        <HorizontalBar
                                            data={Charts.getChartData('assets', values)}
                                            width={100}
                                            height={400}
                                            options={{
                                                legend: false,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    datalabels: {
                                                        align: 'end',
                                                        anchor: 'end',
                                                    },
                                                },
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            display: true,
                                                            ticks: {
                                                                beginAtZero: true,
                                                                max: 100,
                                                                steps: 10,
                                                                stepValue: 5,
                                                            },
                                                        },
                                                    ],
                                                    yAxes: [
                                                        {
                                                            labelMaxWidth: 10,
                                                        },
                                                    ],
                                                },
                                                title: {
                                                    display: true,
                                                    text: `${yearData} Assets: ${(values) && formatCurrency(values.graphValues.assets_total, language, currency)}`,
                                                },
                                                tooltips: false,
                                            }}
                                        />
                                    </Grid.Column>
                                )}
                                {status.liabilities
                                && (
                                    <Grid.Column style={{ marginBottom: '30px' }}>
                                        <HorizontalBar
                                            data={Charts.getChartData('liabilities', values)}
                                            width={100}
                                            height={400}
                                            options={{
                                                legend: false,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    datalabels: {
                                                        align: 'end',
                                                        anchor: 'end',
                                                    },
                                                },
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            display: true,
                                                            ticks: {
                                                                beginAtZero: true,
                                                                max: 100,
                                                                steps: 10,
                                                                stepValue: 5,
                                                            },
                                                        },
                                                    ],
                                                },
                                                title: {
                                                    display: true,
                                                    text: `${yearData} Liabilities: ${(values) && formatCurrency(values.graphValues.liabilities_total, language, currency)}`,
                                                },
                                                tooltips: false,
                                            }}
                                        />
                                    </Grid.Column>
                                )}
                                {status.breakdown_of_Programs
                                && (
                                    <Grid.Column style={{ marginBottom: '30px' }}>
                                        <Doughnut
                                            data={Charts.getChartData('breakdown_of_Programs', values)}
                                            options={{
                                                legend: {
                                                    display: true,
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Breakdown of Programs',
                                                },
                                                tooltips: false,
                                            }}
                                        />
                                    </Grid.Column>
                                )} */}
                            </Fragment>
                        )
                        : <CharityNoDataState />
                    }
                </Grid.Row>
            </Grid>

        );
    }
}

function mapStateToProps(state) {
    return {
        values: state.charity.charityDetails.charityDetails.attributes,
        chartData: Data.beneficiaryFinanceList,
    };
}

export default connect(mapStateToProps)(Charts);
