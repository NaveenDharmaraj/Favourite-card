/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Table,
    Placeholder
} from 'semantic-ui-react';
import _ from 'lodash';

import { formatDateForGivingTools } from '../../../helpers/give/utils';

import TransactionTableRow from './TransactionsTableRow';

function AllocationsTable(props) {
    let {
        upcomingTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
    } = props;
    console.log(monthlyTransactionApiCall);
    const renderTableData = () => {
        const tableBody = [];
        if (!_.isEmpty(upcomingTransactions)) {
            upcomingTransactions.forEach((transaction) => {
                const {
                    attributes,
                    id,
                } = transaction;

                const transactionDate = (attributes.transactionDate.includes(15)) ? '15th' : '1st';
                const formattedDate = formatDateForGivingTools(attributes.createdAt);
                tableBody.push(<TransactionTableRow
                    firstColoumn={attributes.accountName}
                    secondColoumn={attributes.amount}
                    thirdColoumn={transactionDate}
                    fourthColoumn={attributes.paymentInformation}
                    fifthColoumn={formattedDate}
                    deleteTransaction={deleteTransaction}
                    transactionType={attributes.transactionType}
                    transactionId={id}
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
                        <Table.HeaderCell>Recipient </Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Day of month</Table.HeaderCell>
                        <Table.HeaderCell>Credit Card</Table.HeaderCell>
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
export default AllocationsTable;
