import React, {
    Fragment,
} from 'react';
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

import { withTranslation } from '../../i18n';

import CharityNoDataState from './CharityNoDataState';

const ProgramAreas = (props) => {
    const {
        charityDetails: {
            attributes: {
                charityPrograms,
            },
        },
        t: formatMessage,
    } = props;
    let viewData = <CharityNoDataState />;
    let programs = null;
    if (!_isEmpty(charityPrograms)) {
        programs = charityPrograms.map((program) => (
            <Table.Row>
                <Table.Cell>{program.name}</Table.Cell>
                <Table.Cell>{program.percentage}</Table.Cell>
            </Table.Row>
        ));
        viewData = (
            <Fragment>
                <Table basic="very" unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={8}>{formatMessage('charityProfile:descriptionText')}</Table.HeaderCell>
                            <Table.HeaderCell width={8}>{`% ${formatMessage('charityProfile:emphasisText')}`}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {programs}
                    </Table.Body>
                </Table>
                <p className="ch_footnote">{`*% ${formatMessage('charityProfile:emphasisInfo')}`}</p>
            </Fragment>
        );
    }
    return (
        <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={16} className="ch_program mt-1 mb-1" data-test="Charity_ProgramAreas_programs_section">
                <Header as="h3">{formatMessage('charityProfile:programAreas')}</Header>
                {viewData}
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
    t: () => {},
};

ProgramAreas.propTypes = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            charityPrograms: array,
        }),
    }),
    t: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
    };
}

const connectedComponent = withTranslation('charityProfile')(connect(mapStateToProps)(ProgramAreas));
export {
    connectedComponent as default,
    ProgramAreas,
    mapStateToProps,
};
