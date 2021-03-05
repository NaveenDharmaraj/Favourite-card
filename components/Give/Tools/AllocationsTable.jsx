/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import { Table, Accordion, Responsive } from 'semantic-ui-react';
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
        activePage
	} = props;
	const {
		i18n: { language },
	} = props;
	const renderTableData = () => {
		const tableBody = [];
		if (!_.isEmpty(upcomingTransactions)) {
            const activeIndexs = []
			upcomingTransactions.forEach((transaction, index) => {
				const { attributes, id } = transaction;
				const transactionDate = attributes.transactionDate.includes(15)
					? '15th'
					: '1st';
				const formattedDate = formatDateForGivingTools(
					attributes.createdAt
				);
				const destinationType =
					attributes.destinationAccount === 'Beneficiary'
						? 'Charity'
						: attributes.destinationAccount;
				const recipientAccount = `${attributes.accountName} (${attributes.campaign? 'Campaign':destinationType })`;
				const formattedAmount = formatCurrency(
					attributes.amount,
					language,
					'USD'
				);
				const giftType = {
					value: attributes.transactionDate.includes('15') ? 15 : 1,
				};
                activeIndexs.push(index)
				tableBody.push(
					<TransactionTableRow
                        activePage={activePage}
						isAllocation={true}
						modalHeader="Delete monthly gift?"
						firstColoumn={recipientAccount}
						secondColoumn={formattedAmount}
						thirdColoumn={transactionDate}
						fourthColoumn={formattedDate}
						deleteTransaction={deleteTransaction}
						transactionType={attributes.transactionType}
						transactionId={id}
						giftType={giftType}
                        language={language}
                        index={index}
                        destinationType={attributes.destinationAccount}
                        noteToRecipientSaved={attributes.noteToRecipient}
                        noteToSelfSaved={attributes.noteToSelf}
                        activeIndexs={activeIndexs}
                        isCampaign={attributes.campaign}
                        hasCampaign={attributes.hasCampaign}
					/>
				);
			});
		}
		return tableBody;
	};
	return _.isEmpty(upcomingTransactions) ? null : (
		<Fragment>
			<Responsive minWidth={768}>
				<div className="responsiveTable mt-2">
					<Table padded unstackable className="no-border-table">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Recipient </Table.HeaderCell>
								<Table.HeaderCell textAlign="right">
									Amount
								</Table.HeaderCell>
								<Table.HeaderCell>
									Day of month
								</Table.HeaderCell>
								<Table.HeaderCell className="w-120">
									Created
								</Table.HeaderCell>
								<Table.HeaderCell>Action</Table.HeaderCell>
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
export default withTranslation()(AllocationsTable);
