
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Table,
    Placeholder
} from 'semantic-ui-react';
import _ from 'lodash';

import {
    formatCurrency,
} from '../../../helpers/give/utils';

function GivingGoalsTable(props) {
    const {
        userGivingGoalDetails,
    } = props;
    const renderTableData = () => {
        const tableBody = [];
        if (!_.isEmpty(userGivingGoalDetails)) {
            userGivingGoalDetails.forEach((goal) => {
                const {
                    attributes,
                } = goal;
                const formattedGoalAmount = formatCurrency(attributes.amount, 'en', 'USD');
                const formattedDonatedAmount = formatCurrency(attributes.donatedAmount, 'en', 'USD');
                const goalString = `You've given ${formattedDonatedAmount}, and your goal is ${formattedGoalAmount}`;
                tableBody.push(
                    <Table.Row>
                        <Table.Cell>{attributes.year}</Table.Cell>
                        <Table.Cell>{goalString}</Table.Cell>
                    </Table.Row>,
                );
            });
        }
        return tableBody;
    };
    return ((_.isEmpty(userGivingGoalDetails)) ? null
        : (
            <Table padded unstackable className="no-border-table mt-2">
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
        )
    );
}
export default GivingGoalsTable;
