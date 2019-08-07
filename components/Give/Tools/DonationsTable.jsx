/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Table,
    Placeholder,
} from 'semantic-ui-react';
import _ from 'lodash';

import { formatDateForGivingTools } from '../../../helpers/give/utils';

import TransactionTableRow from './TransactionsTableRow';

function DonationsTable(props) {
    const {
        upcomingTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
    } = props;
    const renderTableData = () => {
        const tableBody = [];
        if (!_.isEmpty(upcomingTransactions)) {
            upcomingTransactions.forEach((transaction) => {
                const {
                    attributes,
                    id,
                } = transaction;
                let donationMatchString = 'None';
                if (attributes.donationMatch) {
                    const lastOccuranceOfOpenBrace = attributes.donationMatch.lastIndexOf('(');
                    donationMatchString = attributes.donationMatch.slice(0, lastOccuranceOfOpenBrace);
                }
                const transactionDate = (attributes.transactionDate.includes(15)) ? '15th' : '1st';
                const formattedDate = formatDateForGivingTools(attributes.createdAt);

                tableBody.push(<TransactionTableRow
                    firstColoumn={attributes.paymentInformation}
                    secondColoumn={attributes.amount}
                    thirdColoumn={transactionDate}
                    fourthColoumn={donationMatchString}
                    fifthColoumn={formattedDate}
                    transactionId={id}
                    transactionType={attributes.transactionType}
                    deleteTransaction={deleteTransaction}
                />);
            });
        }
        return tableBody;
    };
    return (
        <div className="responsiveTable">
            <Table padded unstackable className="no-border-table">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Credit Card </Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Day of month</Table.HeaderCell>
                        <Table.HeaderCell>Matched By</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {!monthlyTransactionApiCall
                && <Table.Body>
                    {
                        renderTableData()
                    }
                </Table.Body>
                }
                {monthlyTransactionApiCall
                && 
                <Table.Body>
                    <Table.Cell>  <Placeholder><Placeholder.Line length='full' /></Placeholder></Table.Cell>
                    <Table.Cell>  <Placeholder><Placeholder.Line length='full' /></Placeholder></Table.Cell>
                    <Table.Cell>  <Placeholder><Placeholder.Line length='full' /></Placeholder></Table.Cell>
                    <Table.Cell>  <Placeholder><Placeholder.Line length='full' /></Placeholder></Table.Cell>
                    <Table.Cell>  <Placeholder><Placeholder.Line length='full' /></Placeholder></Table.Cell>
                    <Table.Cell>  <Placeholder><Placeholder.Line length='full' /></Placeholder></Table.Cell>
                </Table.Body>
                }
            </Table>
        </div>
    );
}
export default DonationsTable;
