 
 /* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import {
    Grid,
    Header,
    Segment,
} from 'semantic-ui-react';

import PaginationComponent from '../../shared/Pagination';

import AllocationsTable from './AllocationsTable';
import P2pTable from './P2pTable';

function AllocationsTab(props) {
    const {
        activePage,
        onPageChange,
        totalPages,
        totalPagesP2p,
        upcomingTransactions,
        upcomingP2pTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
        pauseResumeTransaction,
    } = props;
    return (
        <Fragment>
            <div className="recurring-allocations-heading">
                <Header as="h3">
                Scheduled gifts to charities, Giving Groups, and Campaigns
                </Header>
            </div>
            <AllocationsTable
                upcomingTransactions={upcomingTransactions}
                deleteTransaction={deleteTransaction}
                monthlyTransactionApiCall={monthlyTransactionApiCall}
                activePage={activePage}
            />
            <Grid.Column textAlign="right">
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

                    />}
                </div>
            </Grid.Column>
            <div className="recurring-allocations-heading">
                <Header as="h3">
                    Scheduled gifts to friends
                </Header>
            </div>
            <P2pTable
                upcomingTransactions={upcomingP2pTransactions}
                deleteTransaction={deleteTransaction}
                monthlyTransactionApiCall={monthlyTransactionApiCall}
                activePage={activePage}
                pauseResumeTransaction={pauseResumeTransaction}
            />
            <Grid.Column textAlign="right">
                <div className="db-pagination  pt-2">
                    {!monthlyTransactionApiCall && (totalPages > 1) &&
                    <PaginationComponent
                        activePage={activePage}
                        onPageChanged={onPageChange}
                        totalPages={totalPagesP2p}
                        firstItem={(activePage === 1) ? null : undefined}
                        lastItem={(activePage === totalPages) ? null : undefined}
                        prevItem={(activePage === 1) ? null : undefined}
                        nextItem={(activePage === totalPages) ? null : undefined}

                    />}
                </div>
            </Grid.Column>
            {/* <div className="recurring-allocations-heading">
                <Header as="h3">
                    Paused gifts
                </Header>
            </div>
            <AllocationsTable
                upcomingTransactions={upcomingTransactions}
                deleteTransaction={deleteTransaction}
                monthlyTransactionApiCall={monthlyTransactionApiCall}
                activePage={activePage}
            />
            <Grid.Column textAlign="right">
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

                    />}
                </div>
            </Grid.Column> */}
        </Fragment>
    );
}
export default AllocationsTab;
