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
import AllocationsTab from './AllocationsTab';
import GivingGoalsTable from './GivingGoalsTable';
import DonationsTab from './DonationsTab'
import ModalContent from './modalContent';
import { Router } from '../../../routes';
import { connect } from 'react-redux';
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
        this.setState({ 
            showModal: false,
            validity: this.intializeValidations(),
        });
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
                    monthlyTransactionApiCall,
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
            menuItem: 'Your monthly giving',
            render: () => {
                const {
                    monthlyTransactionApiCall,
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
                        <AllocationsTab
                            activePage={activePage}
                            onPageChange={this.onPageChange}
                            upcomingTransactions={upcomingTransactions}
                            deleteTransaction={this.deleteTransaction}
                            monthlyTransactionApiCall={monthlyTransactionApiCall}
                            totalPages={totalPages}
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
            dispatch,
            defaultActiveIndex
        } = this.props;
        if(defaultActiveIndex != data.activeIndex){
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
