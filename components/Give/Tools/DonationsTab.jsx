 
 /* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import {
    Grid,
    Header,
    Segment,
} from 'semantic-ui-react';

import { Link } from '../../../routes';
import PaginationComponent from '../../shared/Pagination';

import DonationsTable from './DonationsTable';

function DonationsTab(props) {
    const {
        activePage,
        onPageChange,
        totalPages,
        upcomingTransactions,
        editTransation,
        deleteTransaction,
        monthlyTransactionApiCall,
    } = props;
    return (
        <Fragment>
            <Segment>
                <Grid verticalAlign="middle">
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={10} computer={11}>
                            <Header as="h3" className="mb-1">
                                Monthly deposits
                            </Header>
                            <p>
                                Always have charitable dollars on hand when you decide to give or for any scheduled monthly gifts you've set up.
                            </p>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={6} computer={5} textAlign="right">
                            <Link route="/donations/new?donation_details[recurring]=1"><a href="" className="ui button blue-btn-rounded-def" fluid>Schedule monthly deposit</a></Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
            </Segment>
            <DonationsTable
                upcomingTransactions={upcomingTransactions}
                deleteTransaction={deleteTransaction}
                editTransation={editTransation}
                monthlyTransactionApiCall={monthlyTransactionApiCall}
            />
            <div className="mb-2">
                <div className="db-pagination  pt-2">
                    {!monthlyTransactionApiCall && (totalPages > 1) && 
                        <PaginationComponent
                            activePage={activePage}
                            onPageChanged={onPageChange}
                            totalPages={totalPages}
                            firstItem={(activePage === 1) ? null : undefined}
                            lastItem={(activePage === totalPages) ? null : undefined}
                            prevItem={(activePage === 1) ? null : undefined}
                            nextItem={(activePage === totalPages) ? null : undefined}
                        />
                    }
                </div>
            </div>
        </Fragment>
    );
}
export default DonationsTab;
