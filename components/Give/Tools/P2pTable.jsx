/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import {
    Table, Accordion, Responsive,
} from 'semantic-ui-react';
import _ from 'lodash';

import { withTranslation } from '../../../i18n';
import {
    formatDateForGivingTools,
    formatCurrency,
} from '../../../helpers/give/utils';
import PlaceholderGrid from '../../shared/PlaceHolder';

import TransactionTableRow from './TransactionsTableRow';

function P2pTable(props) {
    const {
        upcomingTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
        activePage,
        pauseResumeTransaction,
    } = props;
    const {
        i18n: { language },
    } = props;
    const renderTableData = () => {
        const tableBody = [];
        if (!_.isEmpty(upcomingTransactions)) {
            const activeIndexs = [];
            upcomingTransactions.forEach((transaction, index) => {
                const {
                    attributes, id,
                } = transaction;
                // changing destinationDetails to an array of objects
                let destinationDetails = [];
                const {
                    // eslint-disable-next-line camelcase
                    child_allocations, ...parentAllocation
                } = attributes.destinationDetails || {};
                destinationDetails.push(parentAllocation);
                if (!_.isEmpty(attributes.destinationDetails.child_allocations)) {
                    destinationDetails = [
                        ...destinationDetails,
                        // eslint-disable-next-line camelcase
                        ...child_allocations,
                    ];
                }
                const recipients = _.join(_.map(destinationDetails, (u) => (u.receiverExists ? u.displayName : u.email)), ', ');
                const formattedAmount = formatCurrency(
                    attributes.amount,
                    language,
                    'USD',
                );
                activeIndexs.push(index);
                tableBody.push(
                    <TransactionTableRow
                        activePage={activePage}
                        modalHeader="Delete monthly gift?"
                        firstColoumn={recipients}
                        secondColoumn={formattedAmount}
                        thirdColoumn={attributes.frequency}
                        fourthColoumn={attributes.reason}
                        fifthColoumn={formatDateForGivingTools(attributes.createdAt)}
                        deleteTransaction={deleteTransaction}
                        transactionType={attributes.transactionType}
                        transactionId={id}
                        // giftType={giftType}
                        language={language}
                        index={index}
                        destinationType={attributes.destinationAccount}
                        noteToRecipientSaved={attributes.noteToRecipient || ''}
                        noteToSelfSaved={attributes.noteToSelf || ''}
                        activeIndexs={activeIndexs}
                        isP2p
                        pauseResumeTransaction={pauseResumeTransaction}
                        destinationDetails={destinationDetails}
                        reason={attributes.reason}
                        frequency={attributes.frequency}
                        nextTransaction={attributes.nextTransaction}
                        status={attributes.status}
                        // isCampaign={attributes.campaign}
                        // hasCampaign={attributes.hasCampaign}
                        // dedicate={attributes.metaInfo ? attributes.metaInfo.dedicate : {}}
                    />,
                );
            });
        }
        return tableBody;
    };
    return _.isEmpty(upcomingTransactions) ? null : (
        <Fragment>
            <Responsive minWidth={768}>
                <div className="responsiveTable mt-2">
                    <Table padded unstackable className="no-border-table tbl_border_bottom">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell className="edit-trxn-name recipient-width p2p-tab-width">Recipient(s) </Table.HeaderCell>
                                <Table.HeaderCell textAlign="right">
									Amount
                                </Table.HeaderCell>
                                <Table.HeaderCell>
									Frequency
                                </Table.HeaderCell>
                                <Table.HeaderCell className="w-120 reason-width">
									Reason to give
                                </Table.HeaderCell>
                                <Table.HeaderCell>
									Created
                                </Table.HeaderCell>
                                <Table.HeaderCell className="p2p-action-padding">Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {monthlyTransactionApiCall === undefined || false ? (
                            <PlaceholderGrid
                                row={2}
                                column={6}
                                placeholderType="table"
                            />
                        ) : (
                            <Table.Body>{renderTableData()}</Table.Body>
                        )}
                    </Table>
                </div>
            </Responsive>
            <Responsive maxWidth={767}>
                <div className="mbleAccordionTable">
                    {monthlyTransactionApiCall === undefined || false ? (
                        <PlaceholderGrid
                            row={2}
                            column={6}
                            placeholderType="table"
                        />
                    ) : (
                        <Accordion fluid exclusive={false}>
                            {renderTableData()}
                        </Accordion>
                    )}
                </div>
            </Responsive>
        </Fragment>
    );
}
export default withTranslation()(P2pTable);
