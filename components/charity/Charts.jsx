import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    arrayOf,
    PropTypes,
    bool,
    func,
    string,
} from 'prop-types';
import _orderBy from 'lodash/orderBy';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
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
    Loader,
} from 'semantic-ui-react';

import TotalRevenue from '../../static/images/total_revenue.svg';
import ToalExpense from '../../static/images/total_expenses.svg';
import {
    formatCurrency,
} from '../../helpers/give/utils';
import {
    getBeneficiaryFinance,
} from '../../actions/charity';

import CharityNoDataState from './CharityNoDataState';
import ChartSummary from './ChartSummary';
import ReceivingOrganisations from './ReceivingOrganisations';

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
            charityDetails: {
                id,
            },
        } = this.props;
        dispatch(getBeneficiaryFinance(id));
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            beneficiaryFinance,
        } = this.props;
        const {
            chartIndex,
            graphData,
        } = this.state;
        if (!_isEqual(prevProps.beneficiaryFinance, beneficiaryFinance)) {
            this.createGraphData();
        }
        if (!_isEqual(prevState.chartIndex, chartIndex)) {
                this.highlightBar();
        }
    }

    getSelectedYear() {
        const {
            beneficiaryFinance,
        } = this.props;
        let selectedYear = null;
        beneficiaryFinance.some((year) => {
            if (year.expenses.find((o) => o.name === 'total_expense').value > 0) {
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
                    backgroundColor: '#055CE5',
                    borderColor: '#055CE5',
                    data: revenueData,
                    fill: false,
                    label: 'Revenue',
                    lineTension: 0,
                    type: 'line',
                },
                {
                    backgroundColor: '#C995D370',
                    data: firstData,
                    fill: false,
                },
                {
                    backgroundColor: '#DF005F70',
                    data: secondData,
                    fill: false,
                },
                {
                    backgroundColor: '#FEC7A970',
                    data: thirdData,
                    fill: false,
                },
                {
                    backgroundColor: '#00CCD470',
                    data: fourthData,
                    fill: false,
                },
                {
                    backgroundColor: '#0D00FF70',
                    data: fifthData,
                    fill: false,
                },
            ],
            labels: yearLabel,
        };
        return data;
    }

    handleClick(event) {
        if (!_isEmpty(event)) {
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
        if (!_isEmpty(graphData)) {
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
        const firstData = [];
        const secondData = [];
        const thirdData = [];
        const fourthData = [];
        const fifthData = [];
        let graphData = {};
        let selectedYear = null;
        if (!_isEmpty(beneficiaryFinance)) {
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
                if (year.expenses.find((o) => o.name === 'total_expense').value > 100000) {
                    firstData.push(year.expenses.find((o) => o.name === 'charitable_activities_programs').value);
                    secondData.push(year.expenses.find((o) => o.name === 'management_admin').value);
                    thirdData.push(year.expenses.find((o) => o.name === 'fundraising').value);
                    fourthData.push(year.expenses.find((o) => o.name === 'poilitical_activities').value);
                    fifthData.push(year.expenses.find((o) => o.name === 'other').value);
                    yearData.push([
                        {
                            color: '#C995D3',
                            text: 'Charitable activities / programs',
                            value: year.expenses.find((o) => o.name === 'charitable_activities_programs').value,
                        },
                        {
                            color: '#DF005F',
                            text: 'Management and administration',
                            value: year.expenses.find((o) => o.name === 'management_admin').value,
                        },
                        {
                            color: '#FEC7A9',
                            text: 'Fundraising',
                            value: year.expenses.find((o) => o.name === 'fundraising').value,
                        },
                        {
                            color: '#00CCD4',
                            text: 'Political activities',
                            value: year.expenses.find((o) => o.name === 'poilitical_activities').value,
                        },
                        {
                            color: '#0D00FF',
                            text: 'Other',
                            value: year.expenses.find((o) => o.name === 'other').value,
                        },
                        {
                            color: '#8DEDAE',
                            hideGift: !(year.gifts_total > 0),
                            text: 'Gifts to other registered charities and qualified donees',
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
                            text: 'Professional and consulting fees',
                            value: year.expenses.find((o) => o.name === 'prof_consult_fees').value,
                        },
                        {
                            color: '#DF005F',
                            text: 'Travel and vehicle expenses',
                            value: year.expenses.find((o) => o.name === 'travel_vehicle_expense').value,
                        },
                        {
                            color: '#FEC7A9',
                            text: 'Expenditures on charitable activities',
                            value: year.expenses.find((o) => o.name === 'expenditure_charity_activites').value,
                        },
                        {
                            color: '#00CCD4',
                            text: 'Management and administration',
                            value: year.expenses.find((o) => o.name === 'management_admin').value,
                        },
                        {
                            color: '#0D00FF',
                            text: 'Other',
                            value: year.expenses.find((o) => o.name === 'other').value,
                        },
                        {
                            color: '#8DEDAE',
                            hideGift: !(year.gifts_total > 0),
                            text: 'Gifts to other registered charities and qualified donees',
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
                thirdData,
                totalData,
                yearData,
                yearLabel,
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
            chartLoader,
        } = this.props;
        const {
            chartIndex,
            graphData,
            showDoneeListModal,
        } = this.state;
        const currency = 'USD';
        const language = 'en';
        let chartView = '';
        if (!chartLoader && !_isEmpty(graphData)) {
            chartView = (
                <Fragment>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={16} computer={16}>
                                <div className="graph">
                                    <Grid.Column>
                                        <Bar
                                            onElementsClick={this.handleClick}
                                            ref={this.chartReference}
                                            data={this.getChartData}
                                            width="790px"
                                            height="216px"
                                            options={{
                                                events: [
                                                    'click',
                                                ],
                                                legend: false,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            categoryPercentage: 0.8,
                                                            display: true,
                                                            gridLines: {
                                                                display: false,
                                                            },
                                                            stacked: true,
                                                        },
                                                    ],
                                                    yAxes: [
                                                        {
                                                            stacked: true,
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
                        {!_isEmpty(graphData) && this.renderSummary()}
                    </Grid>
                    <p className="ch_footnote">* Information about revenue and expenses is provided by the Canada Revenue Agency approximately once each quarter.</p>
                    <Modal
                        open={showDoneeListModal}
                        onClose={this.closeDoneeListModal}
                        size="tiny"
                        dimmer="inverted"
                        className="chimp-modal"
                        closeIcon
                    >
                        <Modal.Header icon="archive" content="Gifts to qualified donees" />
                        <Modal.Content className="ch_ModelContent">
                            <ReceivingOrganisations
                                year={graphData.yearLabel[chartIndex]}
                            />
                        </Modal.Content>
                    </Modal>
                </Fragment>
            );
        } else {
            chartView = <CharityNoDataState />
        }
        return (
            <Fragment>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={16} className="revenue mt-1">
                        <Header as="h3">Revenue and expenses</Header>
                        {chartLoader
                            ? (
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={16}>
                                            <div
                                                style={{
                                                    height: '260px',
                                                    position: 'relative',
                                                    width: '100%',
                                                }}
                                            >
                                                <Loader active />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            )
                            : (chartView)
                        }
                    </Grid.Column>
                </Grid.Row>
            </Fragment>
        );
    }
}

Charts.defaultProps = {
    beneficiaryFinance: [],
    charityDetails: PropTypes.shape({
        id: '',
    }),
    chartLoader: true,
    dispatch: () => {},
};

Charts.propTypes = {
    beneficiaryFinance: arrayOf(PropTypes.element),
    charityDetails: PropTypes.shape({
        id: string,
    }),
    chartLoader: bool,
    dispatch: func,
};

function mapStateToProps(state) {
    return {
        beneficiaryFinance: state.charity.beneficiaryFinance,
        charityDetails: state.charity.charityDetails,
        chartLoader: state.charity.chartLoader,
    };
}

export default connect(mapStateToProps)(Charts);
