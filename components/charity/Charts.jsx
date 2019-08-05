import React from 'react';
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
import { compose } from 'redux';

class Charts extends React.Component {
    constructor(props) {
        super(props);
        console.log('Charts component');
    }

    static getChartData(type, values) {
        let graphValues = values.graphValues;
        let otherValues = values.otherGraphValues;
        let charityPrograms = values.charityPrograms;
        let percentageData = [];
        let actualData = [];
        let total_amount = null;
        let labels_data=[];
        let bgColor=[];
        switch (type) {
            case 'revenue':
                labels_data = [
                    'Tax Receipted Cash Gifts',
                    'Tax Receipted Non-cash Gifts',
                    'Gifts from Other Charities',
                    'Non-tax Receipted Gifts',
                    'Revenue from Government',
                    'Other',
                ],
                percentageData = [graphValues.revenue_tax_receipted_cash,
                    graphValues.revenue_tax_receipted_non_cash,
                    graphValues.revenue_other_charities,
                    graphValues.revenue_non_tax_receipted,
                    graphValues.revenue_government,
                    otherValues.revenue_other];
                    total_amount = graphValues.revenue_total;
                break;
            case 'expenditure':
                labels_data = [
                    'Programs',
                    'Fundraising',
                    'Management and Admin',
                    'Gifts to Qualified Donees',
                    'Other',
                ],  
                percentageData = [graphValues.expenditure_programs,
                    graphValues.expenditure_fundraising,
                    graphValues.expenditure_mgmt_admin,
                    graphValues.expenditure_qualified_donees,
                    otherValues.expenditure_other];
                    total_amount = graphValues.expenditure_total;
                break;
            case 'assets':
                    labels_data = [
                        'Cash',
                        'Receivables',
                        'Investments',
                        ['Land, Buildings, and Capital',' Assets'],
                        'Other',
                    ],  
                    percentageData = [graphValues.assets_cash,
                        graphValues.assets_receivable,
                        graphValues.assets_invested,
                        graphValues.assets_land_buildings_capital,
                        otherValues.assets_other];
                        total_amount = graphValues.assets_total;
                    break;
            case 'liabilities':
                    labels_data = [
                        'Short term, arm’s length',
                        'Non-arm’s length',
                        'Other',
                    ],
                    percentageData = [graphValues.liabilities_short_term_arms_length,
                        graphValues.liabilities_non_arms_length,
                        otherValues.liabilities_other],
                        total_amount = graphValues.liabilities_total;
                break;
            case 'breakdown_of_Programs':
                    bgColor = [
                        '#009585',
                        '#00bba7',
                        '#32c8b8'
                        ],
                    charityPrograms.map((program)=>{
                        labels_data.push(program.name);
                        actualData.push(program.percentage);
                });
                break;
            default:
                break;
        }
        if (_.isEmpty(actualData)) {
        percentageData.map((data) => {
                actualData.push(Math.round((data * 100) / total_amount));
            });
        }
        const data = {
            labels: labels_data,
            datasets: [
                {
                    backgroundColor: (_.isEmpty(bgColor) ? '#00BBA7' : bgColor),
                    borderColor: (_.isEmpty(bgColor) ? '#00BBA7' : bgColor),
                    borderWidth: 1,
                    hoverBackgroundColor: '#7fddd3',
                    hoverBorderColor: '#7fddd3',
                    data: actualData,
                },
            ],
        };
        return data;
    }

    render() {
        const {
            values,
        } = this.props;
    return (
        <Grid stackable columns="2">
            <Grid.Row>
                <Grid.Column style={{ marginBottom: '30px' }}>
                    <HorizontalBar
                        data={Charts.getChartData('revenue', values)}
                        width={100}
                        height={400}
                        options={{
                            plugins: {
                                datalabels: {
                                    align: 'end',
                                    anchor: 'end',
                                }
                            },
                            scales: {
                                xAxes: [
                                        {
                                            display: true,
                                            ticks: {
                                                beginAtZero: true,
                                                steps: 10,
                                                stepValue: 5,
                                                max: 100,
                                            },
                                        },
                                    ],
                                },
                                maintainAspectRatio: false,
                                tooltips: false,
                                legend: false,
                                title: {
                                    display: true,
                                    text: `2019 Revenues: $${(values) && (values.graphValues.revenue_total)}`
                                },
                            }}
                    />
                </Grid.Column>
                <Grid.Column style={{ marginBottom: '30px' }}>
                    <HorizontalBar
                        data={Charts.getChartData('expenditure', values)}
                        width={100}
                        height={400}
                        options={{
                            plugins: {
                                datalabels: {
                                    align: 'end',
                                    anchor: 'end',
                                }
                            },
                            scales: {
                                xAxes: [
                                        {
                                            display: true,
                                            ticks: {
                                                beginAtZero: true,
                                                steps: 10,
                                                stepValue: 5,
                                                max: 100,
                                            },
                                        },
                                    ],
                                },
                            maintainAspectRatio: false,
                            tooltips: false,
                            legend: false,
                            title: {
                                display: true,
                                text: `2019 Expenditures: $${(values) && (values.graphValues.expenditure_total)}`
                            }
                        }}
                    />
                </Grid.Column>
                <Divider/>
                <Grid.Column style={{ marginBottom: '30px' }}>
                    <HorizontalBar
                        data={Charts.getChartData('assets', values)}
                        width={100}
                        height={400}
                        options={{
                            plugins: {
                                datalabels: {
                                    align: 'end',
                                    anchor: 'end',
                                }
                            },
                            scales: {
                                xAxes: [
                                        {
                                            display: true,
                                            ticks: {
                                                beginAtZero: true,
                                                steps: 10,
                                                stepValue: 5,
                                                max: 100,
                                            },
                                        },
                                    ],
                                    yAxes: [
                                        {
                                            labelMaxWidth: 10,
                                        },
                                    ],
                                },
                                maintainAspectRatio: false,
                                tooltips: false,
                                legend: false,
                                title: {
                                    display: true,
                                    text: `2019 Assets: $${(values) && (values.graphValues.assets_total)}`
                                },
                            }}
                        />
                </Grid.Column>
                <Grid.Column style={{ marginBottom: '30px' }}>
                    <HorizontalBar
                        data={Charts.getChartData('liabilities', values)}
                        width={100}
                        height={400}
                        options={{
                            plugins: {
                                datalabels: {
                                    align: 'end',
                                    anchor: 'end',
                                }
                            },
                            scales: {
                                xAxes: [
                                        {
                                            display: true,
                                            ticks: {
                                                beginAtZero: true,
                                                steps: 10,
                                                stepValue: 5,
                                                max: 100,
                                            },
                                        },
                                    ],
                                },
                                maintainAspectRatio: false,
                                tooltips: false,
                                legend: false,
                                title: {
                                    display: true,
                                    text: `2019 Liabilities: $${(values) && (values.graphValues.liabilities_total)}`
                                },
                            }}
                        />
                </Grid.Column>
                    <Grid.Column style={{ marginBottom: '30px' }}>
                        <Doughnut
                            data={Charts.getChartData('breakdown_of_Programs', values)}
                            options={{
                                tooltips: false,
                                legend: {
                                    display: true,
                                },
                                title: {
                                    display: true,
                                    text: 'Breakdown of Programs',
                                },
                            }}
                        />
                    </Grid.Column>
            </Grid.Row>
        </Grid>

        );
    }
}

function mapStateToProps(state) {
    return {
        values: state.give.charityDetails.charityDetails.attributes,
    };
}

export default connect(mapStateToProps)(Charts);
