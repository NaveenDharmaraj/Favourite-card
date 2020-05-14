import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    arrayOf,
    PropTypes,
} from 'prop-types';
import _ from 'lodash';
import _orderBy from 'lodash/orderBy';
import {
    Bar,
} from 'react-chartjs-2';
import {
    Grid,
    Header,
    List,
    Image,
    Divider,
    Modal,
} from 'semantic-ui-react';

import TotalRevenue from '../../static/images/total_revenue.svg';
import ToalExpense from '../../static/images/total_expenses.svg';
import {
    formatCurrency,
    formatAmount,
} from '../../helpers/give/utils';
import {
    getBeneficiaryFinance,
} from '../../actions/charity';

import CharityNoDataState from './CharityNoDataState';
import ChartSummary from './ChartSummary';

class Charts extends React.Component {
    constructor(props) {
        super(props);
        this.createGraphData = this.createGraphData.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderSummary = this.renderSummary.bind(this);
        this.openDoneeListModal = this.openDoneeListModal.bind(this);
        this.closeDoneeListModal = this.closeDoneeListModal.bind(this);
        this.highlightBar = this.highlightBar.bind(this);
        this.chartReference = React.createRef();
        this.state = {
            chartIndex: null,
            graphData: {},
            showDoneeListModal: false,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            values: {
                    id,
            },
        } = this.props;
        getBeneficiaryFinance(dispatch, id);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            beneficiaryFinance,
        } = this.props;
        const {
            chartIndex,
        } = this.state;
        if (!_.isEqual(prevProps.beneficiaryFinance, beneficiaryFinance)) {
            this.createGraphData();
        }
        if (!_.isEqual(prevState.chartIndex, chartIndex)) {
            if (!_.isEmpty(beneficiaryFinance)) {
                this.highlightBar();
            }
        }
    }

    getSelectedYear() {
        const {
            beneficiaryFinance,
        } = this.props;
        let selectedYear = null;
        beneficiaryFinance.some((year) => {
            if (year.expenses[0].value > 0) {
                selectedYear = year.returns_year;
                return true;
            }
        });
        return selectedYear;
    }

    getChartData() {
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
                    backgroundColor: '#FEC7A970',
                    barThickness: 6,
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

    handleClick(event) {
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
            graphData,
        } = this.state;
        if (!_.isEmpty(graphData)) {
            chartInstance.reset();
            chartInstance.update();

            chartInstance.getDatasetMeta(1).data[chartIndex]._model.backgroundColor = '#C995D3';
            chartInstance.getDatasetMeta(2).data[chartIndex]._model.backgroundColor = '#DF005F';
            chartInstance.getDatasetMeta(3).data[chartIndex]._model.backgroundColor = '#FEC7A9';
            chartInstance.getDatasetMeta(4).data[chartIndex]._model.backgroundColor = '#00CCD4';
            chartInstance.getDatasetMeta(5).data[chartIndex]._model.backgroundColor = '#0D00FF';
        }
    }

    createGraphData() {
        const {
            beneficiaryFinance,
        } = this.props;
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
        let selectedYear = null;
        if (!_.isEmpty(beneficiaryFinance)) {
            selectedYear = this.getSelectedYear();
            const sortedData = _orderBy(beneficiaryFinance, [
                (data) => data.returns_year,
            ], [
                'asc',
            ]);
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
                        {
                            color: '#8DEDAE',
                            hideGift: !(year.expenses[6].value > 0),
                            text: 'Gifts to other registered charities and qualified donees',
                            value: year.expenses[6].value,
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
                        {
                            color: '#8DEDAE',
                            hideGift: !(year.expenses[6].value > 0),
                            text: 'Gifts to other registered charities and qualified donees',
                            value: year.expenses[6].value,
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
            this.setState({
                chartIndex: yearLabel.indexOf(selectedYear),
                graphData,
            });
        }
    }

    openDoneeListModal() {
        this.setState({
            showDoneeListModal: true,
        });
    }

    closeDoneeListModal() {
        this.setState({
            showDoneeListModal: false,
        });
    }

    renderSummary() {
        const {
            graphData,
            chartIndex,
        } = this.state;
        const selectedData = graphData.yearData[chartIndex];
        debugger;
        return (
            selectedData.map((summary) => (
                <ChartSummary
                    color={summary.color}
                    text={summary.text}
                    value={summary.value}
                    hideGift={summary.hideGift}
                    handleClick={this.openDoneeListModal}
                />
            ))
        );
    }

    render() {
        const {
            beneficiaryFinance,
            values,
        } = this.props;
        const {
            chartIndex,
            graphData,
            showDoneeListModal,
        } = this.state;
        const currency = 'USD';
        const language = 'en';
        debugger;
        return (
            <Fragment>
                <Header as="h3">Revenue and expenses</Header>
                {(!_.isEmpty(graphData))
                    ? (
                        <Fragment>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={16} computer={16} className="revenue mt-1">
                                        <div className="graph">
                                            <Grid.Column>
                                                <Bar
                                                    // onClick={this.getElementAtEvent}
                                                    // getDatasetAtEvent={this.handleClick}
                                                    onElementsClick={this.handleClick}
                                                    ref={this.chartReference}
                                                    data={this.getChartData}
                                                    width="759px"
                                                    height="216px"
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
                                                        tooltips: false,
                                                    }}
                                                />
                                            </Grid.Column>
                                            <Header as="h4">{`${graphData.yearLabel[chartIndex]} total revenue and expenses summary `}</Header>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row className="expenseHeader">
                                    <Grid.Column mobile={11} tablet={12} computer={12}>
                                        <List>
                                            <List.Item as="h5">
                                                <Image src={TotalRevenue} />
                                                <List.Content>
                                                    Total revenue
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column mobile={5} tablet={4} computer={4} textAlign="right">
                                        <Header as="h5">
                                            {formatCurrency(graphData.totalData[chartIndex].revenue_total, language, currency)}
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Divider />
                            <Grid>
                                <Grid.Row className="expenseHeader ch_Expenses">
                                    <Grid.Column mobile={11} tablet={12} computer={12}>
                                        <List>
                                            <List.Item as="h5">
                                                <Image src={ToalExpense} />
                                                <List.Content>
                                                    Total expenses
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column mobile={5} tablet={4} computer={4} textAlign="right">
                                        <Header as="h5">
                                            {formatCurrency(graphData.totalData[chartIndex].total_expense, language, currency)}
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                                {!_.isEmpty(graphData) && this.renderSummary()}
                                {/* GIFT section and Modal */}
                            </Grid>
                            <p className="ch_footnote">* Information about revenue and expenses is provided by the Canada Revenue Agency approximately once each quarter.</p>
                            <Modal
                                open={showDoneeListModal}
                                onCLose={this.closeDoneeListModal}
                                size="tiny"
                                dimmer="inverted"
                                className="chimp-modal"
                                closeIcon
                            >
                                <Modal.Header icon='archive' content='Gifts to qualified donees' />
                                <Modal.Content>
                                    <div className='ch_giftPopcontent'>
                                        <Header as='h6'>CHARITY</Header>
                                        <Header as='h3'>Chilliwack Animal Safe Haven Society<span>$11,304.00</span></Header>
                                        <Header as='h5'>Vancouver, BC  </Header>
                                    </div>
                                    <div className='ch_giftPopcontent'>
                                        <Header as='h6'>CHARITY</Header>
                                        <Header as='h3'>Chilliwack Animal Safe Haven Society<span>$11,304.00</span></Header>
                                        <Header as='h5'>Vancouver, BC  </Header>
                                    </div>
                                </Modal.Content>
                            </Modal>
                        </Fragment>
                    ) : <CharityNoDataState />
                }
            </Fragment>
        );
    }
}

Charts.defaultProps = {
    beneficiaryFinance: [],
};

Charts.propTypes = {
    beneficiaryFinance: arrayOf(PropTypes.element),
};

function mapStateToProps(state) {
    return {
        beneficiaryFinance: state.charity.beneficiaryFinance,
        values: state.charity.charityDetails.charityDetails,
        // beneficiaryFinance: Data.beneficiaryFinanceList,
    };
}

export default connect(mapStateToProps)(Charts);
