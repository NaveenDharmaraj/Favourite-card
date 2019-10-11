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
        } = this.props;
        const {
            showModal
          } = this.state;

        return (
            <Table.Row>
                <Table.Cell>{firstColoumn}</Table.Cell>
                <Table.Cell className="text-right">{secondColoumn}</Table.Cell>
                <Table.Cell>{thirdColoumn}</Table.Cell>
                <Table.Cell>{fourthColoumn}</Table.Cell>
                <Table.Cell>{fifthColoumn}</Table.Cell>
                <Table.Cell>
                    <Modal 
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
                        <Modal.Header>Delete monthly deposit?</Modal.Header>
                        <Modal.Content>
                            <Modal.Actions>
                                <Button
                                    color='red'
                                    onClick={this.closeModalAndDelete}
                                >
                                    Yes
                                </Button>
                                <Button
                                    onClick={() => this.setState({ showModal: false })}
                                >
                                    No
                                </Button>
                            </Modal.Actions>
                        </Modal.Content>
                    </Modal>

                </Table.Cell>
            </Table.Row>
        );
    }
}
export default TransactionTableRow;
