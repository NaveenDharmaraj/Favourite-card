/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Button,
    Modal,
    Table,
} from 'semantic-ui-react';

class TransactionTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showModal: false
        }
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    closeModalAndDelete = () =>{
        const {
            transactionId,
            transactionType,
            deleteTransaction,
        } = this.props;
        this.setState({ showModal: false });
        deleteTransaction(transactionId, transactionType)
    }

    render() {
        const {
            firstColoumn,
            secondColoumn,
            thirdColoumn,
            fourthColoumn,
            fifthColoumn,
            modalHeader,
        } = this.props;
        const {
            showModal
          } = this.state;

        return (
            <Table.Row>
                {(firstColoumn) && (<Table.Cell>{firstColoumn}</Table.Cell>)}
                {(secondColoumn) && (<Table.Cell className="text-right">{secondColoumn}</Table.Cell>)}
                {(thirdColoumn) && (<Table.Cell>{thirdColoumn}</Table.Cell>)}
                {(fourthColoumn) && (<Table.Cell>{fourthColoumn}</Table.Cell>)}
                {(fifthColoumn) && (<Table.Cell>{fifthColoumn}</Table.Cell>)}
                <Table.Cell>
                    <Modal 
                      size="tiny"
                dimmer="inverted"
                className="chimp-modal"
                        closeIcon
                        onClose={this.closeModal}
                        open={showModal}
                        trigger={
                            <Button
                                onClick={() => this.setState({ showModal: true })}
                                className="blue-bordr-btn-round-def c-small"
                            >
                                Delete
                            </Button>
                        }
                    >
                        <Modal.Header>{modalHeader}</Modal.Header>
                        <Modal.Content>
                        <Modal.Description className="font-s-16">
                            Are you sure you want to delete the transaction?
                        </Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Modal.Actions>
                                <Button
                                    className="danger-btn-rounded-def c-small"
                                    color='red'
                                    onClick={this.closeModalAndDelete}
                                >
                                    Delete
                                </Button>
                                <Button
                                    className="blue-bordr-btn-round-def c-small"
                                    onClick={() => this.setState({ showModal: false })}
                                >
                                    Cancel
                                </Button>
                            </Modal.Actions>
                            </div>
                        </Modal.Content>
                    </Modal>

                </Table.Cell>
            </Table.Row>
        );
    }
}
export default TransactionTableRow;
