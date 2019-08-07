/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Button,
    Table,
} from 'semantic-ui-react';

function TransactionTableRow(props) {
    return (
        <Table.Row>
            <Table.Cell>{props.firstColoumn}</Table.Cell>
            <Table.Cell>{props.secondColoumn}</Table.Cell>
            <Table.Cell>{props.thirdColoumn}</Table.Cell>
            <Table.Cell>{props.fourthColoumn}</Table.Cell>
            <Table.Cell>{props.fifthColoumn}</Table.Cell>
            <Table.Cell><Button primary basic size="mini" onClick={() => props.deleteTransaction(props.transactionId, props.transactionType)} className="outline xs-btn">Delete</Button></Table.Cell>
        </Table.Row>
    );
}
export default TransactionTableRow;
