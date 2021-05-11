 
 /* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import {
    Grid,
    Header,
    Segment,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
} from 'prop-types';

import {
    Link,
} from '../../../routes';
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
        upcomingPausedP2pTransactionApiCall,
        showScheduleGiftLoader,
    } = props;
    const allocationPageChange = (event, data) => {
        onPageChange(event, data, 'allocation');
    };
    const p2pAllocationPageChange = (event, data, status) => {
        onPageChange(event, data, 'p2pAllocation', status);
    };
    return (
        <Fragment>
            {(!_isEmpty(upcomingTransactions) && !showScheduleGiftLoader)
                ? (
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
                    </Fragment>
                ) : (
                    <Segment className="mb-3">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={10} computer={11}>
                                    <Header as="h3" className="mb-1">
                                    Scheduled gifts you set up to charities, Giving Groups, and Campaigns will appear here.
                                    </Header>
                                    <p>
                                    Find a charity, Giving Group, or Campaign to support each month.
                                    </p>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={5} textAlign="right">
                                    <Link route='/search'>
                                        <a href="" className="ui button blue-btn-rounded-def" fluid>
                                            Explore
                                        </a>
                                    </Link>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                )}
            {(!_isEmpty(upcomingP2pTransactions) && !showScheduleGiftLoader)
                ? (
                    <Fragment>
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
                                    onPageChanged={(e, data) => { p2pAllocationPageChange(e, data, 'active'); }}
                                    totalPages={totalPagesP2p}
                                    firstItem={(p2pActivePage === 1) ? null : undefined}
                                    lastItem={(p2pActivePage === totalPagesP2p) ? null : undefined}
                                    prevItem={(p2pActivePage === 1) ? null : undefined}
                                    nextItem={(p2pActivePage === totalPagesP2p) ? null : undefined}

                                />}
                            </div>
                        </Grid.Column>
                    </Fragment>
                ) : (
                    <Segment className="mb-3">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={10} computer={11}>
                                    <Header as="h3" className="mb-1">
                                    Scheduled gifts you set up to friends will appear here.
                                    </Header>
                                    <p>
                                    Schedule a one-time or recurring gift of charitable dollars that your friends can give away.
                                    </p>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={5} textAlign="right">
                                    <Link route="/give/to/friend/new">
                                        <a href="" className="ui button blue-btn-rounded-def" fluid>
                                        Schedule gift
                                        </a>
                                    </Link>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                )}
            {!_isEmpty(upcomingPausedP2pTransactions)
                && (
                    <Fragment>
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
                                    onPageChanged={(e, data) => { p2pAllocationPageChange(e, data, 'inactive'); }}
                                    totalPages={totalPagesPausedP2p}
                                    firstItem={(p2pPausedPage === 1) ? null : undefined}
                                    lastItem={(p2pPausedPage === totalPagesPausedP2p) ? null : undefined}
                                    prevItem={(p2pPausedPage === 1) ? null : undefined}
                                    nextItem={(p2pPausedPage === totalPagesPausedP2p) ? null : undefined}

                                />}
                            </div>
                        </Grid.Column>
                    </Fragment>
                )}
        </Fragment>
    );
}

AllocationsTab.defaultProps = {
    showScheduleGiftLoader: true,
};

AllocationsTab.propTypes = {
    showScheduleGiftLoader: bool,
};

export default AllocationsTab;
