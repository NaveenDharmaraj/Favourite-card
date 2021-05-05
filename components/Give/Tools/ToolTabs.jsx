/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Button,
    Header,
    Modal,
    Segment,
    Grid,
    Tab,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    formatAmount,
} from '../../../helpers/give/utils';
import AllocationsTab from './AllocationsTab';
import GivingGoalsTable from './GivingGoalsTable';
import DonationsTab from './DonationsTab'
import ModalContent from './modalContent';
import { Router } from '../../../routes';
import { connect } from 'react-redux';
import {validateGivingGoal} from '../../../helpers/users/utils';
import {
    getUpcomingTransactions,
    getUpcomingP2pAllocations,
    deleteUpcomingTransaction,
    editUpcomingP2p,
} from '../../../actions/user';
import { getUserGivingGoal, setUserGivingGoal } from '../../../actions/user';
import {
    formatCurrency,
} from '../../../helpers/give/utils';
const tabMenus = [
    '/user/recurring-donations',
    '/user/recurring-gifts',
    '/user/giving-goals',
];

class ToolTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            p2pActivePage:1,
            p2pPausedPage:1,
            showModal: false,
            givingGoal: '',
            validity: this.intializeValidations()
        };

        this.onTabChangeFunc = this.onTabChangeFunc.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputOnBlurGivingGoal = this.handleInputOnBlurGivingGoal.bind(this);
        this.setGivingGoal = this.setGivingGoal.bind(this);
        if (!_.isEmpty(props.userGivingGoalDetails)) {
            this.state.givingGoal = this.setGivingGoal(props.userGivingGoalDetails);
        }
    }

    setGivingGoal(userGivingGoalDetails) {
        const date = new Date();
        const currentYear = date.getFullYear();
        const currentYearData = _.find(userGivingGoalDetails, function (o) { return o.attributes.year === currentYear });
        let formattedCurrentGoalAmount = '';
        if (!_.isEmpty(currentYearData)) {
            formattedCurrentGoalAmount = _.replace(formatCurrency(currentYearData.attributes.amount, 'en', 'USD'), '$', '');
        }
        return formattedCurrentGoalAmount;
    }

    closeModal = () => {
        this.setState({
            showModal: false,
            validity: this.intializeValidations(),
        });
    }

    closeModalAndSave = () => {
        const {
            givingGoal,
        } = this.state;
        const {
            dispatch,
            currentUser: {
                id,
            }
        } = this.props;
        const inputValue = formatAmount(parseFloat(givingGoal.replace(/,/g, '')));
        if (this.validateForm(inputValue)) {
            this.setState({ showModal: false });
            setUserGivingGoal(dispatch, inputValue, id);
        }
    }
    handleInputChange(event) {
        const {
            target: {
                name, value
            },
        } = event;
        this.setState({
            givingGoal: value
        });
    }

    handleInputOnBlurGivingGoal(event) {
        const {
            target: {
                name, value
            },
        } = event;
        let inputValue = value;
        const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]+)?$/;
        if (!_.isEmpty(value) && value.match(isValidNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        }
        if (this.validateForm(inputValue)) {
            let formattedValue = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
            this.setState({
                givingGoal: formattedValue
            });
        }
    }
    intializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isValidPositiveNumber: true,
            isValidGiveAmount: true,
        };
        return this.validity;
    }
    validateForm(value) {
        const {
            givingGoal
        } = this.state;
        let {
            validity,
        } = this.state;
        validity = validateGivingGoal(value, validity);
        this.setState({
            validity,
        })
        return _.every(validity);
    }
    panes = [
        {
            menuItem: 'Scheduled Deposits',
            render: () => {
                const {
                    monthlyTransactionApiCall,
                    upcomingTransactions,
                    upcomingTransactionsMeta,
                } = this.props
                const {
                    activePage
                } = this.state;
                let totalPages = (upcomingTransactionsMeta) ? upcomingTransactionsMeta.pageCount : 1;
                return (
                    <Tab.Pane attached={false}>
                        <div className="tools-tabpane">
                            <DonationsTab
                                activePage={activePage}
                                onPageChange={this.onPageChange}
                                upcomingTransactions={upcomingTransactions}
                                deleteTransaction={this.deleteTransaction}
                                monthlyTransactionApiCall={monthlyTransactionApiCall}
                                totalPages={totalPages}
                            />
                        </div>
                    </Tab.Pane>
                );
            }
        },
        {
            menuItem: 'Scheduled Gifts',
            render: () => {
                const {
                    monthlyTransactionApiCall,
                    upcomingP2pTransactionApiCall,
                    upcomingPausedP2pTransactionApiCall,
                    upcomingTransactions,
                    upcomingTransactionsMeta,
                    upcomingP2pTransactions,
                    upcomingP2pTransactionsMeta,
                    upcomingPausedP2pTransactions,
                    upcomingPausedP2pTransactionsMeta
                } = this.props;
                const totalPages = (upcomingTransactionsMeta) ? upcomingTransactionsMeta.pageCount: 1;
                const totalPagesP2p = (upcomingP2pTransactionsMeta) ? upcomingP2pTransactionsMeta.pageCount: 1;
                const totalPagesPausedP2p = (upcomingPausedP2pTransactionsMeta) ? upcomingPausedP2pTransactionsMeta.pageCount: 1;
                const {
                    activePage,
                    p2pActivePage,
                    p2pPausedPage,
                } = this.state;
                return (
                <Tab.Pane attached={false}>
                    <div className="tools-tabpane">
                        <AllocationsTab
                            activePage={activePage}
                            onPageChange={this.onPageChange}
                            upcomingTransactions={upcomingTransactions}
                            upcomingP2pTransactions={upcomingP2pTransactions}
                            upcomingPausedP2pTransactions={upcomingPausedP2pTransactions}
                            deleteTransaction={this.deleteTransaction}
                            monthlyTransactionApiCall={monthlyTransactionApiCall}
                            upcomingP2pTransactionApiCall={upcomingP2pTransactionApiCall}
                            upcomingPausedP2pTransactionApiCall={upcomingPausedP2pTransactionApiCall}
                            totalPages={totalPages}
                            totalPagesP2p={totalPagesP2p}
                            totalPagesPausedP2p={totalPagesPausedP2p}
                            p2pActivePage={p2pActivePage}
                            p2pPausedPage={p2pPausedPage}
                            pauseResumeTransaction={this.pauseResumeTransaction}
                        />
                    </div>
                </Tab.Pane>
            )
        }
        },
        {
            menuItem: 'Your giving goal',
            render: () => {
                const {
                    userGivingGoalDetails,
                } = this.props;
                const {
                    givingGoal,
                    validity
                } = this.state;
                const date = new Date();
                const currentYear = date.getFullYear();
                return (
                    <Tab.Pane attached={false}>
                        <div className="tools-tabpane">
                            <Segment>
                                <Grid verticalAlign="middle">
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={11} computer={11}>
                                            <Header as="h3" className="mb-1">
                                                Giving goal
                                                <Header.Subheader className="mt-1">
                                                    Set a personal goal for the dollars you want to commit for giving. Reach your goal by adding money to your account.
                                                </Header.Subheader>
                                            </Header>
                                            <p>Set a personal goal for the dollars you want to commit for giving. Reach your goal by adding money to your account. </p>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={5} computer={5} textAlign="right">
                                            <Modal
                                                size="tiny"
                                                dimmer="inverted"
                                                closeIcon
                                                className="chimp-modal"
                                                onClose={this.closeModal}
                                                open={this.state.showModal}
                                                trigger={
                                                    <Button
                                                        onClick={() => this.setState({ showModal: true })}
                                                        primary
                                                        className="ui button primary blue-btn-rounded"
                                                    >
                                                        Set a giving goal
                                                    </Button>
                                                }
                                            >
                                                <Modal.Header>Set Your Giving Goal for {currentYear}</Modal.Header>
                                                <Modal.Content>
                                                    <ModalContent
                                                        showDollarIcon={true}
                                                        showLabel={true}
                                                        handleInputChange={this.handleInputChange}
                                                        handleInputOnBlurGivingGoal={this.handleInputOnBlurGivingGoal}
                                                        givingGoal={givingGoal}
                                                        validity={validity}
                                                        currentYear={currentYear}
                                                    />
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button
                                                        className="ui button primary blue-btn-rounded"
                                                        onClick={this.closeModalAndSave}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <div className="goalsTable">
                                <GivingGoalsTable
                                    userGivingGoalDetails={userGivingGoalDetails}
                                />
                            </div>
                        </div>
                    </Tab.Pane>
                )
            }
        },
    ];

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            defaultActiveIndex
        } = this.props;
        if(defaultActiveIndex === "0") {
            dispatch(getUpcomingTransactions(id, 'RecurringDonation'));
        } else if(defaultActiveIndex === "1") {
            dispatch(getUpcomingTransactions(id, 'RecurringAllocation,RecurringFundAllocation'));
            dispatch(getUpcomingP2pAllocations(id, 'ScheduledP2pAllocation'));
            dispatch(getUpcomingP2pAllocations(id, 'ScheduledP2pAllocation', 'inactive'));
        }
        if(id){
            getUserGivingGoal(dispatch, id);
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props, prevProps)) {
            const {
                userGivingGoalDetails,
            } = this.props;
            if (!_.isEqual(userGivingGoalDetails, prevProps.userGivingGoalDetails)) {
                const formattedCurrentGoalAmount = this.setGivingGoal(userGivingGoalDetails);
                this.setState({
                    givingGoal: formattedCurrentGoalAmount,
                })
            }
        }

    }

    deleteTransaction(id, transactionType) {
        const {
            dispatch,
        } = this.props;
        const {
            activePage
        } = this.state;
        if (id && transactionType) {
            deleteUpcomingTransaction(dispatch, id, transactionType, activePage, this.props.currentUser.id)
        }
    }

    pauseResumeTransaction=(transactionId, status) =>{
        let{
            currentUser: {
                id,
            },
            upcomingP2pTransactions,
            upcomingPausedP2pTransactions,
            dispatch,
        } = this.props;
        let { activePage } = this.state;
        let selectedTransaction;
        if (status === 'pause') {
            selectedTransaction = _.find(upcomingP2pTransactions,{'id':transactionId})
        } else{
            selectedTransaction = _.find(upcomingPausedP2pTransactions,{'id':transactionId})
        }
        if(!_.isEmpty(selectedTransaction)){
            let {
                attributes:{
                    amount,
                    reason,
                    recipientEmails,
                    nextTransaction,
                    frequency,
                    noteToRecipient,
                    noteToSelf
                }
            } = selectedTransaction
            dispatch(editUpcomingP2p(transactionId,
                amount,
                reason,
                recipientEmails,
                nextTransaction,
                frequency,
                noteToRecipient,
                noteToSelf,
                activePage,
                id,
                status));
        } 
    }

    onPageChange(event, data, type) {
        const {
            currentUser: {
                id,
            },
            dispatch,
            defaultActiveIndex
        } = this.props;
        if(defaultActiveIndex === "0") {
            dispatch(getUpcomingTransactions(id, 'RecurringDonation', data.activePage));
        } else if(defaultActiveIndex === "1") {
            let url2;
            let url3;
            if(type === 'p2pAllocation'){
                url2 = `${url}&filter[type]=ScheduledP2pAllocation&filter[aasm_state]=active&sort=next_transfer_date`;
                url3 = `${url}&filter[type]=ScheduledP2pAllocation&filter[aasm_state]=inactive&sort=next_transfer_date`;
                dispatch(getUpcomingP2pAllocations(id, 'ScheduledP2pAllocation'));
                dispatch(getUpcomingP2pAllocations(id, 'ScheduledP2pAllocation', 'inactive'));
            } else if( type === 'allocation'){
                dispatch(getUpcomingTransactions(id, 'RecurringAllocation,RecurringFundAllocation', data.activePage));
            }
            // url+= `?filter[type]=ScheduledP2pAllocation&filter[aasm_state]=active&page[size]=10`
        }
        // dispatch(getUpcomingTransactions(url));
        this.setState({
            activePage: data.activePage,
        });
    }
    onTabChangeFunc(event, data) {
        const {
            dispatch,
            defaultActiveIndex
        } = this.props;
        if (defaultActiveIndex != data.activeIndex) {
            dispatch({
                payload: {
                    upcomingTransactions: {},
                    upcomingTransactionsMeta: {},
                },
                type: 'GET_UPCOMING_TRANSACTIONS',
            });
            event.preventDefault();
            Router.pushRoute(tabMenus[data.activeIndex]);
        }
    }

    render() {
        const {
            defaultActiveIndex,
        } = this.props;
        return (
            <Tab
                menu={{
                    pointing: true,
                    secondary: true,
                }}
                panes={this.panes}
                defaultActiveIndex={defaultActiveIndex}
                onTabChange={(event, data) => this.onTabChangeFunc(event, data)}
            />
        );
    }
}
function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        upcomingTransactions: state.user.upcomingTransactions,
        upcomingTransactionsMeta: state.user.upcomingTransactionsMeta,
        upcomingP2pTransactions: state.user.upcomingP2pTransactions,
        upcomingP2pTransactionsMeta: state.user.upcomingP2pTransactionsMeta,
        upcomingPausedP2pTransactions: state.user.upcomingPausedP2pTransactions,
        upcomingPausedP2pTransactionsMeta: state.user.upcomingPausedP2pTransactionsMeta,
        monthlyTransactionApiCall: state.user.monthlyTransactionApiCall,
        upcomingP2pTransactionApiCall:state.user.upcomingP2pTransactionApiCall,
        upcomingPausedP2pTransactionApiCall:state.user.upcomingPausedP2pTransactionApiCall,
        userGivingGoalDetails: state.user.userGivingGoalDetails,
    };
}
export default (connect(mapStateToProps)(ToolTabs));
