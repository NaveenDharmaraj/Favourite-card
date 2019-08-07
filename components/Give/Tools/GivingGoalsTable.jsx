
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Table,
    Placeholder
} from 'semantic-ui-react';
import _ from 'lodash';

function GivingGoalsTable(props) {
    console.log(props);
    return (
        <Table padded unstackable className="no-border-table">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Year</Table.HeaderCell>
                    <Table.HeaderCell>Goal Amount</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
}
export default GivingGoalsTable;
