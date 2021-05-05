/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import {
	Button,
	Modal,
	Table,
	Responsive,
	Accordion,
	TableBody,
	TableCell,
} from 'semantic-ui-react';
import dynamic from 'next/dynamic';
import EditMonthlyAllocationModal from './EditMonthlyAllocationModal';
import EditP2pAllocationModal from './EditP2pAllocationModal';

const EditMonthlyDepositModal = dynamic(
	() => import('./EditMonthlyDepositModal'),
	{ ssr: false }
);

class TransactionTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteModal: false,
            activeIndexs: props.activeIndexs || []
        }
    }

	closeModal = () => {
		this.setState({
			showDeleteModal: false,
		});
	};

	closeModalAndDelete = () => {
		const {
			transactionId,
			transactionType,
			deleteTransaction,
		} = this.props;
		this.setState({ showDeleteModal: false });
		deleteTransaction(transactionId, transactionType);
	};

	handleClick = (e, titleProps) => {
		const { index } = titleProps;
		const { activeIndexs } = this.state;
		const newIndex = activeIndexs;

		const currentIndexPosition = activeIndexs.indexOf(index);
		if (currentIndexPosition > -1) {
			newIndex.splice(currentIndexPosition, 1);
		} else {
			newIndex.push(index);
		}

		this.setState({ activeIndexs: newIndex });
	};

	render() {
		const {
			firstColoumn,
			secondColoumn,
			thirdColoumn,
			fourthColoumn,
			fifthColoumn,
			paymentInstrumentId,
			modalHeader,
			index,
			isAllocation,
			transactionId,
			transactionType,
			activePage,
            language,
            giftType,
            destinationType,
            noteToRecipientSaved,
            noteToSelfSaved,
            isCampaign,
            hasCampaign,
            dedicate,
            isP2p,
            pauseResumeTransaction,
            destinationDetails,
            reason,
            frequency,
            nextTransaction,
            status
		} = this.props;
		const { showDeleteModal, activeIndexs } = this.state;
        const monthlyAllocModal = (<EditMonthlyAllocationModal
            recipientName={firstColoumn}
            currentMonthlyAllocAmount={secondColoumn}
            paymentInstrumentId={paymentInstrumentId}
            transactionId={transactionId}
            activePage={activePage}
            giftType={giftType}
            language={language}
            giveToType={destinationType}
            noteToSelfSaved={noteToSelfSaved}
            noteToRecipientSaved={noteToRecipientSaved}
            isCampaign={isCampaign}
            hasCampaign={hasCampaign}
            dedicate={dedicate}
            nextTransaction={nextTransaction}
        />);
        const monthlyDepositModal = (<EditMonthlyDepositModal
            currentMonthlyDepositAmount={secondColoumn}
            paymentInstrumentId={paymentInstrumentId}
            transactionId={transactionId}
            activePage={activePage}
        />);
        const p2pModal = (<EditP2pAllocationModal
            recipientName={firstColoumn}
            currentMonthlyAllocAmount={secondColoumn}
            transactionId={transactionId}
            activePage={activePage}
            language={language}
            giveToType={destinationType}
            noteToSelfSaved={noteToSelfSaved}
            noteToRecipientSaved={noteToRecipientSaved}
            destinationDetails={destinationDetails}
            reasonToGive={reason}
            giveFrequency={frequency}
            nextTransaction={nextTransaction}
        />);

        const deleteModal = (
            <Modal
                size="tiny"
                dimmer="inverted"
                className="chimp-modal"
                closeIcon
                onClose={this.closeModal}
                open={showDeleteModal}
                trigger={
                    <a
                        className='deleteLink'
                        onClick={() => this.setState({ showDeleteModal: true })}
                    >
                        Delete
                    </a>
                }
            >
                <Modal.Header>{modalHeader}</Modal.Header>
                <Modal.Content>
                    <span>
                    If you delete this transaction, it won't be processed each month.
                    </span>
                    <div className="pt-2 pb-1 text-right">
                        <Button
                            className="danger-btn-rounded-def c-small"
                            color='red'
                            onClick={this.closeModalAndDelete}
                        >
                            Delete
                        </Button>
                        <Button
                            className="blue-bordr-btn-round-def c-small"
                            onClick={() => this.setState({ showDeleteModal: false })}
                        >
                            Cancel
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
		return (
			<Fragment>
				{/* Desktop transaction details row start */}
				<Responsive minWidth={768} as={'tr'}>
					{firstColoumn && <Table.Cell className="edit-trxn-name recipient-width">{firstColoumn}</Table.Cell>}
					{secondColoumn && (
						<Table.Cell className="text-right">
							{secondColoumn}
						</Table.Cell>
					)}
					{thirdColoumn && <Table.Cell>{thirdColoumn}</Table.Cell>}
					{fourthColoumn && <Table.Cell>{fourthColoumn}</Table.Cell>}
					{fifthColoumn && <Table.Cell>{fifthColoumn}</Table.Cell>}
					<Table.Cell className="tbl-action">
                        {
                            isP2p? (
                                <Fragment>
                                    {p2pModal}
                                    <a
                                        className='deleteLink'
                                        onClick={()=>{pauseResumeTransaction(transactionId,  status === 'active'? 'pause' : 'resume')}}
                                    >
                                        {status === 'active' ? 'Pause' : 'Resume'}
                                    </a>
                                </Fragment>): (isAllocation ? (
							monthlyAllocModal
						) : (
						monthlyDepositModal	
						))
                        }
						{deleteModal}
					</Table.Cell>
				</Responsive>
				{/* Desktop transaction details row end */}

				{/* Mobile transaction details row start (Accordion) */}
				<Responsive maxWidth={767} className="accordionWrap">
					<Accordion.Title
						active={activeIndexs.includes(index)}
						index={index}
						onClick={this.handleClick}
					>
						{firstColoumn}
					</Accordion.Title>
					<Accordion.Content active={activeIndexs.includes(index)}>
						<Table unstackable>
							{transactionType === 'RecurringDonation' ? (
								<TableBody>
									<Table.Row>
										<TableCell>Amount</TableCell>
										<TableCell>{secondColoumn}</TableCell>
									</Table.Row>
									<Table.Row>
										<TableCell>Day of month</TableCell>
										<TableCell>{thirdColoumn}</TableCell>
									</Table.Row>
									<Table.Row>
										<TableCell>Matched by</TableCell>
										<TableCell>{fourthColoumn}</TableCell>
									</Table.Row>
									<Table.Row>
										<TableCell>Created</TableCell>
										<TableCell>{fifthColoumn}</TableCell>
									</Table.Row>
								</TableBody>
							) : (
								<TableBody>
									<Table.Row>
										<TableCell>Amount</TableCell>
										<TableCell>{secondColoumn}</TableCell>
									</Table.Row>
									<Table.Row>
										<TableCell>Day of month</TableCell>
										<TableCell>{thirdColoumn}</TableCell>
									</Table.Row>
									<Table.Row>
										<TableCell>Created</TableCell>
										<TableCell>{fourthColoumn}</TableCell>
									</Table.Row>
								</TableBody>
							)}
							<Table.Footer>
								<Table.Row>
									<Table.Cell colSpan="3">
									{
										isP2p? (
											<Fragment>
												{p2pModal}
												<a
													className='deleteLink'
													onClick={()=>{pauseResumeTransaction(transactionId, 'pause')}}
												>
													Pause{'   '}
												</a>
											</Fragment>): (isAllocation ? (
										monthlyAllocModal
									) : (
									monthlyDepositModal	
									))
									}
									{deleteModal}
                                        
									</Table.Cell>
								</Table.Row>
							</Table.Footer>
						</Table>
					</Accordion.Content>
				</Responsive>
				{/* Mobile transaction details row end (Accordion) */}
			</Fragment>
		);
	}
}

TransactionTableRow.defaultProps = {
	isAllocation: false,
};
export default TransactionTableRow;
