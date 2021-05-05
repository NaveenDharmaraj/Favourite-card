 
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
        p2pActivePage,
        p2pPausedPage,
        upcomingPausedP2pTransactions,
        totalPagesPausedP2p,
        upcomingP2pTransactionApiCall,
        upcomingPausedP2pTransactionApiCall
    } = props;
    const allocationPageChange = (event, data) => {
        onPageChange(event, data, 'allocation');
    };
    const p2pAllocationPageChange = (event, data) => {
        onPageChange(event, data, 'p2pAllocation');
    };
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
                        onPageChanged={allocationPageChange}
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
                monthlyTransactionApiCall={upcomingP2pTransactionApiCall}
                activePage={p2pActivePage}
                pauseResumeTransaction={pauseResumeTransaction}
            />
            <Grid.Column textAlign="right">
                <div className="db-pagination  pt-2">
                    {!upcomingP2pTransactionApiCall && (totalPagesP2p > 1) &&
                    <PaginationComponent
                        activePage={p2pActivePage}
                        onPageChanged={p2pAllocationPageChange}
                        totalPages={totalPagesP2p}
                        firstItem={(p2pActivePage === 1) ? null : undefined}
                        lastItem={(p2pActivePage === totalPagesP2p) ? null : undefined}
                        prevItem={(p2pActivePage === 1) ? null : undefined}
                        nextItem={(p2pActivePage === totalPagesP2p) ? null : undefined}

                    />}
                </div>
            </Grid.Column>
            <div className="recurring-allocations-heading">
                <Header as="h3">
                    Paused gifts
                </Header>
            </div>
            <P2pTable
                upcomingTransactions={upcomingPausedP2pTransactions}
                deleteTransaction={deleteTransaction}
                monthlyTransactionApiCall={upcomingPausedP2pTransactionApiCall}
                activePage={p2pActivePage}
                pauseResumeTransaction={pauseResumeTransaction}
            />
            <Grid.Column textAlign="right">
                <div className="db-pagination  pt-2">
                    {!upcomingPausedP2pTransactionApiCall && (totalPagesPausedP2p > 1) &&
                    <PaginationComponent
                        activePage={p2pPausedPage}
                        onPageChanged={onPageChange}
                        totalPages={totalPagesPausedP2p}
                        firstItem={(p2pPausedPage === 1) ? null : undefined}
                        lastItem={(p2pPausedPage === totalPagesPausedP2p) ? null : undefined}
                        prevItem={(p2pPausedPage === 1) ? null : undefined}
                        nextItem={(p2pPausedPage === totalPagesPausedP2p) ? null : undefined}

                    />}
                </div>
            </Grid.Column>
        </Fragment>
    );
}
export default AllocationsTab;
