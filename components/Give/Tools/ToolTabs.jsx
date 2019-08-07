/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Button,
    Header,
    Segment,
    Grid,
    Tab,
} from 'semantic-ui-react';
import AllocationsTable from './AllocationsTable';
import DonationsTable from './DonationsTable';
import { Router } from '../../../routes';
import { connect } from 'react-redux';
import PaginationComponent from '../../shared/Pagination';

import { getUpcomingTransactions,deleteUpcomingTransaction } from '../../../actions/give';

const tabMenus = [
    '/user/recurring-donations',
    '/user/recurring-gifts',
    '/user/giving-goals',
];

class ToolTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage:1
        };
        this.onTabChangeFunc = this.onTabChangeFunc.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
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
                                        <a href="/donations/new" className="ui button primary" primary fluid>Create new monthly donation</a>
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
                                <PaginationComponent
                                    activePage={activePage}
                                    onPageChanged={this.onPageChange}
                                    totalPages={(upcomingTransactionsMeta)? upcomingTransactionsMeta.pageCount: 1}
                                />
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
                            <PaginationComponent
                                activePage={activePage}
                                onPageChanged={this.onPageChange}
                                totalPages={(upcomingTransactionsMeta) ? upcomingTransactionsMeta.pageCount: 1}
                            />
                        </Grid.Column>
                        </Segment>
                    </div>
                </Tab.Pane>
            )
        }
        },
        {
            menuItem: 'Your giving goal',
            render: () => (
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
                                        <Button primary fluid>Set a giving goal </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </div>
                </Tab.Pane>
            ),
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
        console.log(url);
        getUpcomingTransactions(dispatch, url);
    }

    deleteTransaction(id, transactionType){
        const {
            dispatch,
        } = this.props;
        const {
            activePage
        } = this.state;
        console.log(id)
        console.log(transactionType);
        debugger
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
        upcomingTransactions: state.give.upcomingTransactions,
        upcomingTransactionsMeta: state.give.upcomingTransactionsMeta,
        monthlyTransactionApiCall: state.give.monthlyTransactionApiCall,
    };
}
export default (connect(mapStateToProps)(ToolTabs));

