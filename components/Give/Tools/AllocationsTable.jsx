/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Table,
} from 'semantic-ui-react';
import _ from 'lodash';

import { withTranslation } from '../../../i18n';
import {
    formatDateForGivingTools,
    formatCurrency,
} from '../../../helpers/give/utils';
import PlaceholderGrid from '../../shared/PlaceHolder';

import TransactionTableRow from './TransactionsTableRow';

function AllocationsTable(props) {
    let {
        upcomingTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
    } = props;
    const {
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

                const transactionDate = (attributes.transactionDate.includes(15)) ? '15th' : '1st';
                const formattedDate = formatDateForGivingTools(attributes.createdAt);
                const destinationType = (attributes.destinationAccount === 'Beneficiary') ? 'Charity' : attributes.destinationAccount;
                const recipientAccount = `${attributes.accountName} (${destinationType})`;
                const formattedAmount = formatCurrency(attributes.amount, language, 'USD');
                tableBody.push(<TransactionTableRow
                    modalHeader="Delete monthly gift?"
                    firstColoumn={recipientAccount}
                    secondColoumn={formattedAmount}
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
    return ((_.isEmpty(upcomingTransactions)) ? null
        : (
            <div className="responsiveTable mt-2">
                <Table padded unstackable className="no-border-table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Recipient </Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Day of month</Table.HeaderCell>
                            <Table.HeaderCell>Credit Card</Table.HeaderCell>
                            <Table.HeaderCell className="w-120">Created</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {(monthlyTransactionApiCall === undefined || false) ? (<PlaceholderGrid row={2} column={6} placeholderType="table" />) : (
                        <Table.Body>
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
export default withTranslation()(AllocationsTable);
