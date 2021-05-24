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
import { p2pScheduleOptions } from '../../../helpers/constants/index';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';

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
                const formattedTotalAmount = formatCurrency(
                    Number(attributes.amount) * destinationDetails.length,
                    language,
                    'USD',
                );
                const formattedAmount = formatCurrency(
                    attributes.amount,
                    language,
                    'USD',
                );
                const isP2pOnceError = !!attributes.isMissedProcessing;
                activeIndexs.push(index);
                tableBody.push(
                    <TransactionTableRow
                        activePage={activePage}
                        modalHeader="Delete scheduled gift?"
                        firstColoumn={recipients}
                        secondColoumn={formattedTotalAmount}
                        thirdColoumn={attributes.frequency ? p2pScheduleOptions[attributes.frequency] : ' '}
                        fourthColoumn={attributes.reason || ' '}
                        fifthColoumn={attributes.nextTransaction}
                        deleteTransaction={deleteTransaction}
                        transactionType={attributes.transactionType}
                        transactionId={id}
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
                        amount={formattedAmount}
                        isP2pOnceError={isP2pOnceError}
                    />,
                );
                if (isP2pOnceError) {
                    tableBody.push(
                        <Table.Row className="error-msg-p2p-once">
                            <Table.Cell colSpan="6">
                                <FormValidationErrorMessage
                                    condition
                                    errorMessage="Paused gifts can't be edited or resumed after the send date has passed. You'll need to schedule a new gift."
                                />
                            </Table.Cell>
                        </Table.Row>,
                    );
                }
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
                                <Table.HeaderCell className="edit-trxn-name recipient-width p2p-tab-width">Recipient(s)</Table.HeaderCell>
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
                                    Send date
                                </Table.HeaderCell>
                                <Table.HeaderCell className="p2p-action-padding text-center">Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {(monthlyTransactionApiCall === (undefined || false)) ? (
                            <Table.Body>{renderTableData()}</Table.Body>
                        ) : (

                            <PlaceholderGrid
                                row={2}
                                column={6}
                                placeholderType="table"
                            />
                        )}
                    </Table>
                </div>
            </Responsive>
            <Responsive maxWidth={767}>
                <div className="mbleAccordionTable">
                    {(monthlyTransactionApiCall === (undefined || false)) ? (
                        <Accordion fluid exclusive={false}>
                            {renderTableData()}
                        </Accordion>
                    ) : (
                        <PlaceholderGrid
                            row={2}
                            column={6}
                            placeholderType="table"
                        />
                    )}
                </div>
            </Responsive>
        </Fragment>
    );
}
export default withTranslation()(P2pTable);
