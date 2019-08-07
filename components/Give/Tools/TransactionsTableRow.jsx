/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Button,
    Table,
} from 'semantic-ui-react';

function TransactionTableRow(props) {
    const {
        firstColoumn,
        secondColoumn,
        thirdColoumn,
        fourthColoumn,
        fifthColoumn,
        transactionId,
        transactionType,
        deleteTransaction,
    } = props;
    return (
        <Table.Row>
            <Table.Cell>{firstColoumn}</Table.Cell>
            <Table.Cell>{secondColoumn}</Table.Cell>
            <Table.Cell>{thirdColoumn}</Table.Cell>
            <Table.Cell>{fourthColoumn}</Table.Cell>
            <Table.Cell>{fifthColoumn}</Table.Cell>
            <Table.Cell>
                <Button
                    primary
                    basic
                    size="mini"
                    onClick={() => deleteTransaction(transactionId, transactionType)}
                    className="outline xs-btn"
                >
                    Delete
                </Button>
            </Table.Cell>
        </Table.Row>
    );
}
export default TransactionTableRow;
