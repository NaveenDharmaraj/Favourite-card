/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Table,
    Placeholder,
} from 'semantic-ui-react';
import _ from 'lodash';

import {
    formatDateForGivingTools,
    formatCurrency,
} from '../../../helpers/give/utils';
import { withTranslation } from '../../../i18n';
import PlaceholderGrid from '../../shared/PlaceHolder';

import TransactionTableRow from './TransactionsTableRow';

function DonationsTable(props) {
    const {
        upcomingTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
        i18n:{
            language,
        },
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
                const formattedAmount = formatCurrency(attributes.amount, language, 'USD');

                tableBody.push(<TransactionTableRow
                    firstColoumn={attributes.paymentInformation}
                    secondColoumn={formattedAmount}
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
    return ((_.isEmpty(upcomingTransactions)) ? null
        : (
            <div className="responsiveTable">
                <Table padded unstackable className="no-border-table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Credit Card </Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Day of month</Table.HeaderCell>
                            <Table.HeaderCell>Matched By</Table.HeaderCell>
                            <Table.HeaderCell className="w-120">Created</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {(monthlyTransactionApiCall === undefined || false) ? (<PlaceholderGrid row={2} column={6} placeholderType="table" />) : (<Table.Body>
                        {
                            renderTableData()
                        }
                    </Table.Body>) 
                    }
                </Table>
            </div>
        )
    );
}
export default withTranslation()(DonationsTable);
