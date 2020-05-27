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
        this.getChartData = this.getChartData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderSummary = this.renderSummary.bind(this);
        this.openDoneeListModal = this.openDoneeListModal.bind(this);
        this.closeDoneeListModal = this.closeDoneeListModal.bind(this);
        this.highlightBar = this.highlightBar.bind(this);
        this.chartReference = React.createRef();
        this.state = {
            chartIndex: getChartIndex(props.beneficiaryFinance),
            graphData: formatGraphData(props.beneficiaryFinance),
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

    componentDidUpdate(prevProps) {
        const {
            beneficiaryFinance,
        } = this.props;
        const {
            current,
        } = this.chartReference;
        let viewData = {};
        if (!_isEqual(prevProps.beneficiaryFinance, beneficiaryFinance)) {
            viewData = formatGraphData(beneficiaryFinance);
            this.setState({
                chartIndex: viewData.yearLabel.indexOf(viewData.selectedYear),
                graphData: viewData,
            });
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
                    data: revenueData,
                    fill: false,
                    label: 'Revenue',
                    lineTension: 0,
                    pointRadius: 0,
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
            chartInstance.update();

            chartInstance.getDatasetMeta(1).data[chartIndex]._model.backgroundColor = '#C995D3';
            chartInstance.getDatasetMeta(2).data[chartIndex]._model.backgroundColor = '#DF005F';
            chartInstance.getDatasetMeta(3).data[chartIndex]._model.backgroundColor = '#FEC7A9';
            chartInstance.getDatasetMeta(4).data[chartIndex]._model.backgroundColor = '#00CCD4';
            chartInstance.getDatasetMeta(5).data[chartIndex]._model.backgroundColor = '#0D00FF';
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
            t: formatMessage,
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
    t: () => {},
};

Charts.propTypes = {
    beneficiaryFinance: arrayOf(PropTypes.element),
    charityDetails: PropTypes.shape({
        id: string,
    }),
    chartLoader: bool,
    dispatch: func,
    t: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        beneficiaryFinance: state.charity.beneficiaryFinance,
        charityDetails: state.charity.charityDetails,
        chartLoader: state.charity.chartLoader,
    };
}

export default withTranslation('charityProfile')(connect(mapStateToProps)(Charts));
