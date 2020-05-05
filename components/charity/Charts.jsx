import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    HorizontalBar,
    Doughnut,
} from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import {
    Grid,
    Divider,
} from 'semantic-ui-react';

import { formatCurrency } from '../../helpers/give/utils';

import CharityNoDataState from './CharityNoDataState';

class Charts extends React.Component {
    static getChartData(type, values) {
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
                    [
                        'Tax Receipted',
                        'Cash Gifts',
                    ],
                    [
                        'Tax Receipted',
                        'Non-cash Gifts',
                    ],
                    [
                        'Gifts from',
                        'Other Charities',
                    ],
                    [
                        'Non-tax',
                        'Receipted Gifts',
                    ],
                    [
                        'Revenue',
                        'from Government',
                    ],
                    'Other',
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
                    backgroundColor: (_.isEmpty(bgColor) ? '#00BBA7' : bgColor),
                    borderColor: (_.isEmpty(bgColor) ? '#00BBA7' : bgColor),
                    borderWidth: 1,
                    data: actualData,
                    hoverBackgroundColor: '#7fddd3',
                    hoverBorderColor: '#7fddd3',
                },
            ],
            labels: labelsData,
        };
        return data;
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
            <Grid stackable columns="2">
                <Grid.Row>
                    {showCharts
                        ? (
                            <Fragment>
                                {status.revenue
                                && (
                                    <Grid.Column style={{ marginBottom: '30px' }}>
                                        <HorizontalBar
                                            data={Charts.getChartData('revenue', values)}
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
                                                    text: `${yearData} Revenues: ${(values) && formatCurrency(values.graphValues.revenue_total, language, currency)}`,
                                                },
                                                tooltips: false,
                                            }}
                                        />
                                    </Grid.Column>
                                )
                                }
                                {status.expenditure
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
                                )}
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
    };
}

export default connect(mapStateToProps)(Charts);
