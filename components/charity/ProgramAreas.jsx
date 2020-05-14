import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Header,
    Table,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

const ProgramAreas = (props) => {
    const {
        charityDetails: {
            attributes: {
                charityPrograms,
            },
        },
    } = props;
    let programs = null;
    if (!_isEmpty(charityPrograms)) {
        programs = charityPrograms.map((program) => {
            return (
                <Table.Row>
                    <Table.Cell>{program.name}</Table.Cell>
                    <Table.Cell>{program.percentage}</Table.Cell>
                </Table.Row>
            );
        });
    }
    return (
        <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={16} className="ch_program">
                <Header as="h3">Program areas</Header>
                <Table basic="very" unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={8}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={8}>% of emphasis</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {programs}
                    </Table.Body>
                </Table>
                <p className="ch_footnote">*% of emphasis is reported by the charity and does not necessarily reflect money spent.</p>
            </Grid.Column>
        </Grid.Row>
    );
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails.charityDetails,
    };
}

export default connect(mapStateToProps)(ProgramAreas);
