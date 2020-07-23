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

import totalRevenue from '../../static/images/total_revenue.svg';
import toalExpense from '../../static/images/total_expenses.svg';
import {
    formatCurrency,
} from '../../helpers/give/utils';
import {
    formatGraphData,
    getChartIndex,
    formatChartAmount,
} from '../../helpers/profiles/utils';
import {
    getBeneficiaryFinance,
} from '../../actions/charity';
import { withTranslation } from '../../i18n';

import CharityNoDataState from './CharityNoDataState';
import ChartSummary from './ChartSummary';
import ReceivingOrganisations from './ReceivingOrganisations';

class Charts extends React.Component {
    constructor(props) {
        super(props);
        const {
            beneficiaryFinance,
            t: formatMessage,
        } = props;
        this.mapping = {
            charitable_activities_programs: formatMessage('charityProfile:charitableActivities'),
            expenditure_charity_activites: formatMessage('charityProfile:expenditures'),
            fundraising: formatMessage('charityProfile:fundraising'),
            gifts_to_charities_donees: formatMessage('charityProfile:giftsToDonee'),
            management_admin: formatMessage('charityProfile:management'),
            other: formatMessage('charityProfile:other'),
            poilitical_activities: formatMessage('charityProfile:politicalActivity'),
            prof_consult_fees: formatMessage('charityProfile:professionalFees'),
            travel_vehicle_expense: formatMessage('charityProfile:travelExpense'),
        };
        this.colorArr = [
            '#C995D3',
            '#DF005F',
            '#FEC7A9',
            '#00CCD4',
            '#0D00FF',
            '#8DEDAE',
        ];
        this.getChartData = this.getChartData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderSummary = this.renderSummary.bind(this);
        this.openDoneeListModal = this.openDoneeListModal.bind(this);
        this.closeDoneeListModal = this.closeDoneeListModal.bind(this);
        this.highlightBar = this.highlightBar.bind(this);
        this.chartReference = React.createRef();
        this.state = {
            chartIndex: getChartIndex(beneficiaryFinance),
            graphData: formatGraphData(beneficiaryFinance, this.mapping, this.colorArr),
            showDoneeListModal: false,
            showAnimation: true,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            charityDetails: {
                id,
            },
            isAuthenticated,
        } = this.props;
        dispatch(getBeneficiaryFinance(id, isAuthenticated));
    }

    componentDidUpdate(prevProps) {
        const {
            beneficiaryFinance,
        } = this.props;
        const {
            current,
        } = this.chartReference;
        let viewData = {};
        if (!_isEqual(prevProps.beneficiaryFinance, beneficiaryFinance)) {
            viewData = formatGraphData(beneficiaryFinance, this.mapping, this.colorArr);
            if (!_isEmpty(viewData)) {
                this.setState({
                    chartIndex: viewData.yearLabel.indexOf(viewData.selectedYear),
                    graphData: viewData,
                });
            }
        }
        if (current !== null) {
            this.highlightBar();
        }
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
                    borderWidth: 2,
                    data: revenueData,
                    fill: false,
                    label: 'Revenue',
                    lineTension: 0,
                    pointRadius: 0,
                    type: 'line',
                },
                {
                    backgroundColor: this.colorArr[0].concat('70'),
                    data: firstData,
                    fill: false,
                },
                {
                    backgroundColor: this.colorArr[1].concat('70'),
                    data: secondData,
                    fill: false,
                },
                {
                    backgroundColor: this.colorArr[2].concat('70'),
                    data: thirdData,
                    fill: false,
                },
                {
                    backgroundColor: this.colorArr[3].concat('70'),
                    data: fourthData,
                    fill: false,
                },
                {
                    backgroundColor: this.colorArr[4].concat('70'),
                    data: fifthData,
                    fill: false,
                },
            ],
            labels: yearLabel,
        };
        return data;
    }

    handleClick(event) {
        const {
            dispatch,
        } = this.props;
        if (!_isEmpty(event)) {
            this.setState({
                chartIndex: event[0]._index,
                showAnimation: false,
            });
            dispatch({
                type: 'RESET_DONEE_LIST',
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
            chartInstance.update();

            chartInstance.getDatasetMeta(1).data[chartIndex]._model.backgroundColor = this.colorArr[0];
            chartInstance.getDatasetMeta(2).data[chartIndex]._model.backgroundColor = this.colorArr[1];
            chartInstance.getDatasetMeta(3).data[chartIndex]._model.backgroundColor = this.colorArr[2];
            chartInstance.getDatasetMeta(4).data[chartIndex]._model.backgroundColor = this.colorArr[3];
            chartInstance.getDatasetMeta(5).data[chartIndex]._model.backgroundColor = this.colorArr[4];
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
                    showViewButton={summary.showViewButton}
                />
            ))
        );
    }

    render() {
        const {
            chartLoader,
            t: formatMessage,
            i18n: {
                language,
            },
        } = this.props;
        const {
            chartIndex,
            graphData,
            showDoneeListModal,
            showAnimation,
        } = this.state;
        const currency = 'USD';
        let chartView = '';
        if (!chartLoader && !_isEmpty(graphData)) {
            chartView = (
                <Fragment>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={16} computer={16}>
                                <div className="graph" data-test="Charity_Charts_graph">
                                    <Grid.Column>
                                        <Bar
                                            onElementsClick={this.handleClick}
                                            ref={this.chartReference}
                                            data={this.getChartData}
                                            width="790px"
                                            height="255px"
                                            redraw
                                            options={{
                                                animation: {
                                                    duration: showAnimation ? 1000 : 1,
                                                },
                                                events: [
                                                    'click',
                                                    'mousemove',
                                                ],
                                                legend: false,
                                                maintainAspectRatio: false,
                                                onHover: (event, chartElement) => {
                                                    event.target.style.cursor = chartElement[0] ? 'pointer' : '';
                                                },
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            categoryPercentage: 0.8,
                                                            display: true,
                                                            gridLines: {
                                                                display: false,
                                                            },
                                                            stacked: true,
                                                            ticks: {
                                                                fontColor: '#263238',
                                                                fontSize: 10,
                                                                padding: 5,
                                                            },
                                                        },
                                                    ],
                                                    yAxes: [
                                                        {
                                                            gridLines: {
                                                                drawBorder: false,
                                                            },
                                                            stacked: true,
                                                            ticks: {
                                                                callback: ((value) => (
                                                                    formatChartAmount(value, language, currency)
                                                                )),
                                                                fontColor: '#263238',
                                                                fontSize: 10,
                                                                padding: 8,
                                                            },
                                                        },
                                                    ],
                                                },
                                                tooltips: false,
                                            }}
                                        />
                                    </Grid.Column>
                                    <Header as="h4">{`${graphData.yearLabel[chartIndex]} ${formatMessage('charityProfile:totalRevenueHeading')}`}</Header>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="expenseHeader">
                            <Grid.Column mobile={11} tablet={12} computer={12}>
                                <List>
                                    <List.Item as="h5">
                                        <Image src={totalRevenue} />
                                        <List.Content>
                                            {formatMessage('charityProfile:totalRevenueText')}
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
                                        <Image src={toalExpense} />
                                        <List.Content>
                                            {formatMessage('charityProfile:totalExpenseText')}
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
                    <p className="ch_footnote">{`* ${formatMessage('charityProfile:summaryInfo')}`}</p>
                    <Modal
                        open={showDoneeListModal}
                        onClose={this.closeDoneeListModal}
                        size="tiny"
                        dimmer="inverted"
                        className="chimp-modal"
                        closeIcon
                    >
                        <Modal.Header icon="archive" content={formatMessage('charityProfile:doneeListModalHeader')} />
                        <Modal.Content className="ch_ModelContent">
                            <ReceivingOrganisations
                                year={graphData.yearLabel[chartIndex]}
                            />
                        </Modal.Content>
                    </Modal>
                </Fragment>
            );
        } else {
            chartView = <CharityNoDataState />;
        }
        return (
            <Fragment>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={16} className="revenue mt-1">
                        <Header as="h3">{formatMessage('charityProfile:revenueAndExpenses')}</Header>
                        {chartLoader
                            ? (
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={16}>
                                            <div
                                                data-test="Charity_Charts_Loader"
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
    charityDetails: {
        id: '',
    },
    chartLoader: true,
    dispatch: () => {},
    isAuthenticated: false,
    t: () => {},
};

Charts.propTypes = {
    beneficiaryFinance: PropTypes.arrayOf(
        PropTypes.shape({}),
    ),
    charityDetails: PropTypes.shape({
        id: string,
    }),
    chartLoader: bool,
    dispatch: func,
    isAuthenticated: bool,
    t: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        beneficiaryFinance: state.charity.beneficiaryFinance,
        charityDetails: state.charity.charityDetails,
        chartLoader: state.charity.chartLoader,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

const connectedComponent = withTranslation('charityProfile')(connect(mapStateToProps)(Charts));
export {
    connectedComponent as default,
    Charts,
    mapStateToProps,
};
