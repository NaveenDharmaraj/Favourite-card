
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Table,
    Placeholder
} from 'semantic-ui-react';
import _ from 'lodash';

function GivingGoalsTable(props) {
    const {
        userGivingGoalDetails,
    } = props;
    console.log(props);
    const renderTableData = () => {
        const tableBody = [];
        if (!_.isEmpty(userGivingGoalDetails)) {
            userGivingGoalDetails.forEach((goal) => {
                const {
                    attributes,
                } = goal;
                const goalString = `You've given $${attributes.donatedAmount}, and your goal is ${attributes.amount}`;
                tableBody.push(
                    <Table.Row>
                        <Table.Cell>{attributes.year}</Table.Cell>
                        <Table.Cell>{goalString}</Table.Cell>
                    </Table.Row>
                );
            });
        }
        return tableBody;
    };
    return (
        <Table padded unstackable className="no-border-table">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Year</Table.HeaderCell>
                    <Table.HeaderCell>Goal Amount</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    renderTableData()
                }                    
            </Table.Body>
        </Table>
    );
}
export default GivingGoalsTable;
