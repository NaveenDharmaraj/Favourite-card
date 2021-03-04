/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import {
    Table,
    Placeholder,
    Accordion,
    Responsive
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
        activePage,
        upcomingTransactions,
        deleteTransaction,
        monthlyTransactionApiCall,
        i18n: {
            language,
        },
    } = props;
    const renderTableData = () => {
        const tableBody = [];
        if (!_.isEmpty(upcomingTransactions)) {
            const activeIndexs = []
            upcomingTransactions.forEach((transaction, index) => {
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
                activeIndexs.push(index)
                tableBody.push(<TransactionTableRow
                    isAllocation={false}
                    modalHeader="Delete monthly deposit?"
                    firstColoumn={attributes.paymentInformation}
                    secondColoumn={formattedAmount}
                    thirdColoumn={transactionDate}
                    fourthColoumn={donationMatchString}
                    fifthColoumn={formattedDate}
                    transactionId={id}
                    transactionType={attributes.transactionType}
                    deleteTransaction={deleteTransaction}
                    activePage={activePage}
                    index={index}
                    paymentInstrumentId={attributes.paymentInstrumentId || ''}
                    activeIndexs={activeIndexs}
                />);
            });
        }
        return tableBody;
    };
    return ((_.isEmpty(upcomingTransactions)) ? null
        : (
            <Fragment>
                <Responsive minWidth={768}>
                    <div className="responsiveTable mt-2">
                        <Table padded unstackable className="no-border-table">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell className="Credit_Name">Credit card </Table.HeaderCell>
                                    <Table.HeaderCell className="text-right">Amount</Table.HeaderCell>
                                    <Table.HeaderCell>Day of month</Table.HeaderCell>
                                    <Table.HeaderCell>Matched by</Table.HeaderCell>
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
                </Responsive>
                <Responsive maxWidth={767}>
                    <div className="mbleAccordionTable">
                        {(monthlyTransactionApiCall === undefined || false) ? (<PlaceholderGrid row={2} column={6} placeholderType="table" />) : (<Accordion fluid exclusive={false}    >
                            {
                                renderTableData()
                            }
                        </Accordion>)
                        }
                    </div>
                </Responsive>
            </Fragment>
        )
    );
}
export default withTranslation()(DonationsTable);
