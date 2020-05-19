import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Header,
    Table,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    array,
    PropTypes,
} from 'prop-types';

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
        programs = charityPrograms.map((program) => (
            <Table.Row>
                <Table.Cell>{program.name}</Table.Cell>
                <Table.Cell>{program.percentage}</Table.Cell>
            </Table.Row>
        ));
    }
    return (
        <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={16} className="ch_program mt-1 mb-1">
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

ProgramAreas.defaultProps = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            charityPrograms: [],
        }),
    }),
};

ProgramAreas.propTypes = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            charityPrograms: array,
        }),
    }),
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
    };
}

export default connect(mapStateToProps)(ProgramAreas);
