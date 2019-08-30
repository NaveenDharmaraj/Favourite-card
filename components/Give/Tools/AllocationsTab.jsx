 
 /* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Grid,
    Header,
    Segment,
} from 'semantic-ui-react';

import PaginationComponent from '../../shared/Pagination';

import AllocationsTable from './AllocationsTable';

function AllocationsTab(props) {
    const {
        activePage,
        onPageChange,
        totalPages,
        upcomingTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
    } = props;
    return (
        <Segment className="no-border no-shadow">
            <Header as="h3">
                Your monthly giving
                <Header.Subheader className="mt-1">
                Setup a new monthly gift by searching for a charity, Giving Group, or Campaign and then selecting 'Give' on the page. Your credit card will only be charged if your account balance is less than the amount you are attempting to give.
                </Header.Subheader>
            </Header>
            <AllocationsTable
                upcomingTransactions={upcomingTransactions}
                deleteTransaction={deleteTransaction}
                monthlyTransactionApiCall={monthlyTransactionApiCall}
            />
            <Grid.Column textAlign="right">
                <div className="db-pagination right-align pt-2">
                    {!monthlyTransactionApiCall && (totalPages > 1) &&
                    <PaginationComponent
                        activePage={activePage}
                        onPageChanged={onPageChange}
                        totalPages={totalPages}
                        firstItem={(activePage === 1) ? null : undefined}
                        lastItem={(activePage === totalPages) ? null : undefined}
                        prevItem={(activePage === 1) ? null : undefined}
                        nextItem={(activePage === totalPages) ? null : undefined}

                    />}
                </div>
            </Grid.Column>
        </Segment>
    );
}
export default AllocationsTab;
