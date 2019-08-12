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
import _ from 'lodash'
import AllocationsTable from './AllocationsTable';
import DonationsTable from './DonationsTable';
import GivingGoalsTable from './GivingGoalsTable';
import ModalContent from './modalContent';
import { Router, Link } from '../../../routes';
import { connect } from 'react-redux';
import PaginationComponent from '../../shared/Pagination';
import {validateGivingGoal} from '../../../helpers/users/utils';
import { getUpcomingTransactions,deleteUpcomingTransaction } from '../../../actions/user';
import { getUserGivingGoal, setUserGivingGoal } from '../../../actions/user';
const tabMenus = [
    '/user/recurring-donations',
    '/user/recurring-gifts',
    '/user/giving-goals',
];

class ToolTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage:1,
            showModal: false,
            givingGoal:'',
            validity: this.intializeValidations()
        };
        this.onTabChangeFunc = this.onTabChangeFunc.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        
    }
    closeModal = () => {
        this.setState({ showModal: false });
    }
    closeModalAndSave = () =>{
        const {
            givingGoal,
        } = this.state;
        const{
            dispatch,
            currentUser:{
                id,
            }
        } = this.props;
        let dwf = this.validateForm;
        if(this.validateForm()) {
            this.setState({ showModal: false });
            setUserGivingGoal(dispatch, givingGoal, id);
        }
    }
    handleInputChange(event) {

       
        const {
            target: {
                name, value
            },
        } = event;
        this.setState({
            givingGoal:value
        });
    }
    intializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isValidPositiveNumber: true,
            isValidGiveAmount:true,
        };
        return this.validity;
    }
    validateForm() {
        const {
            givingGoal
        } = this.state;
        let {
            validity,
        } = this.state;


        validity = validateGivingGoal(givingGoal, validity);
        this.setState({
            validity,
        })
        return _.every(validity);
    }
    panes = [
        {
            menuItem: 'Add money monthly',
            render: () => {
                const {
                    upcomingTransactions,
                    upcomingTransactionsMeta,
                } = this.props
                const {
                    activePage
                } =this.state;
                let totalPages = (upcomingTransactionsMeta)? upcomingTransactionsMeta.pageCount: 1;
                return (
                <Tab.Pane attached={false}>
                    <div className="tools-tabpane">
                        <Segment>
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={11} computer={11}>
                                        <Header as="h3" className="mb-1">
                                            Add money monthly
                                            <Header.Subheader className="mt-1">
                                            Set up a monthly recurring donation, and you can regularly add money to your Impact Account without having to think about it. When you're inspired to give some away, it'll be ready and waiting for you.
                                            </Header.Subheader>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={5} computer={5} textAlign="right">
                                        <Link route="/donations/new"><a href="" className="ui button primary blue-btn-rounded" fluid>Create new monthly donation</a></Link>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <DonationsTable
                                upcomingTransactions={upcomingTransactions}
                                deleteTransaction={this.deleteTransaction}
                                monthlyTransactionApiCall={this.props.monthlyTransactionApiCall}
                            />
                        <Grid.Column textAlign="right">
                            <div className="db-pagination right-align pt-2">
                            {!this.props.monthlyTransactionApiCall && (totalPages > 1) && 
                                <PaginationComponent
                                    activePage={activePage}
                                    onPageChanged={this.onPageChange}
                                    totalPages={totalPages}
                                    firstItem={(activePage === 1) ? null : undefined}
                                    lastItem={(activePage === totalPages) ? null : undefined}
                                    prevItem={(activePage === 1) ? null : undefined}
                                    nextItem={(activePage === totalPages) ? null : undefined}
                                />
                            }
                            </div>

                        </Grid.Column>
                        </Segment>
                    </div>
                </Tab.Pane>
            );
        }
        },
        {
            menuItem: 'Your monthly giving',
            render: () => {
                const {
                    upcomingTransactions,
                    upcomingTransactionsMeta
                } = this.props;
                const totalPages = (upcomingTransactionsMeta) ? upcomingTransactionsMeta.pageCount: 1;
                const {
                    activePage
                } =this.state;
                return (
                <Tab.Pane attached={false}>
                    <div className="tools-tabpane">
                        <Segment className="no-border no-shadow">
                            <Header as="h3">
                                Your monthly giving
                                <Header.Subheader className="mt-1">
                                Setup a new monthly gift by searching for a charity, Giving Group, or Campaign and then selecting 'Give' on the page. Your credit card will only be charged if your account balance is less than the amount you are attempting to give.
                                </Header.Subheader>
                            </Header>
                            <AllocationsTable 
                                upcomingTransactions={upcomingTransactions}
                                deleteTransaction={this.deleteTransaction}
                                monthlyTransactionApiCall={this.props.monthlyTransactionApiCall}
                            />
                            <Grid.Column textAlign="right">
                            <div className="db-pagination right-align pt-2">
                            {!this.props.monthlyTransactionApiCall && (totalPages > 1) &&
                            <PaginationComponent
                                activePage={activePage}
                                onPageChanged={this.onPageChange}
                                totalPages={totalPages}
                                firstItem={(activePage === 1) ? null : undefined}
                                lastItem={(activePage === totalPages) ? null : undefined}
                                prevItem={(activePage === 1) ? null : undefined}
                                nextItem={(activePage === totalPages) ? null : undefined}

                            />}
                            </div>
                        </Grid.Column>
                        </Segment>
                    </div>
                </Tab.Pane>
            )
        }
        },
        {
            menuItem: 'Your giving goal',
            render: () => {
                const {
                    userGivingGoalDetails
                } = this.props
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
                                                Set a goal for how much you'd like to donate to your account this year. You can track your progress throughout the year and feel super satisfied when you hit it. Giving it away might feel even better.
                                                </Header.Subheader>
                                            </Header>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={5} computer={5} textAlign="right">
                                            <Modal
                                                size="tiny"
                                                dimmer="inverted"
                                                closeIcon
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
                                                        handleInputChange={this.handleInputChange}
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
                                                        SaveChanges
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>
                            
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width="16">
                                            <GivingGoalsTable
                                                userGivingGoalDetails={userGivingGoalDetails}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                               </Segment>
                        </div>
                    </Tab.Pane>
                )
            }
        },
    ];
    
    componentDidMount(){
        const {
            currentUser:{
                id,
            },
            dispatch,
            defaultActiveIndex
        } = this.props;
        let url = `users/${id}/upcomingTransactions`;
        if(defaultActiveIndex === "0") {
            url+= `?filter[type]=RecurringDonation&page[size]=10`
        } else if(defaultActiveIndex === "1") {
            url+= `?filter[type]=RecurringAllocation,RecurringFundAllocation&page[size]=10`
        }
        getUpcomingTransactions(dispatch, url);
        if(id){
            getUserGivingGoal(dispatch, id);

        }
    }

    deleteTransaction(id, transactionType){
        const {
            dispatch,
        } = this.props;
        const {
            activePage
        } = this.state;
        if(id && transactionType){
            deleteUpcomingTransaction(dispatch,id, transactionType, activePage, this.props.currentUser.id)
        }
    }

    onPageChange(event,data) {
        const {
            currentUser:{
                id,
            },
            dispatch,
            defaultActiveIndex
        } = this.props;
        let url = `users/${id}/upcomingTransactions?page[number]=${data.activePage}&page[size]=10`;
        if(defaultActiveIndex === "0") {
            url+= `&filter[type]=RecurringDonation`
        } else if(defaultActiveIndex === "1") {
            url+= `&filter[type]=RecurringAllocation,RecurringFundAllocation`
        }
        getUpcomingTransactions(dispatch, url);
        this.setState({
            activePage:data.activePage,
        });
    }
    onTabChangeFunc(event, data) {
        const {
            dispatch
        } = this.props;
        dispatch({
                payload:{
                    upcomingTransactions: {},
                    upcomingTransactionsMeta: {},
            },
            type: 'GET_UPCOMING_TRANSACTIONS',
        });
        event.preventDefault();
        Router.pushRoute(tabMenus[data.activeIndex]);
    }
    
    render(){
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
        monthlyTransactionApiCall: state.user.monthlyTransactionApiCall,
        userGivingGoalDetails: state.user.userGivingGoalDetails,
    };
}
export default (connect(mapStateToProps)(ToolTabs));
