import React from 'react';
import {
    Grid, Placeholder, Segment, Table,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
const columnComponent = (column, placeholderType) => {
    const columnComponents = [];
    for (let i = 0; i < column; i++) {
        if (placeholderType === 'table') {
            columnComponents.push(
                <Table.Cell>
                    <Placeholder>
                        <Placeholder.Line length="full" />
                    </Placeholder>
                </Table.Cell>,
            );
        } else {
            columnComponents.push(
                <Grid.Column>
                    <Segment raised>
                        <Placeholder style={{
                            height: 100,
                            width: '100%',
                        }}
                        >
                            <Placeholder image square />
                        </Placeholder>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line length="medium" />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                                <Placeholder.Line />

                            </Placeholder.Paragraph>
                        </Placeholder>

                    </Segment>
                </Grid.Column>,
            );
        }
    }
    return columnComponents;
};
const PlaceholderGrid = (props) => {
    const {
        column,
        row,
        placeholderType,
    } = props;
    const placeHolderComponent = [];
    for (let i = 0; i < row; i++) {
        if (placeholderType === 'table') {
            placeHolderComponent.push(
                <Table.Row>
                    {columnComponent(column, placeholderType)}
                </Table.Row>,
            );
        } else {
            placeHolderComponent.push(
                <Grid.Row>
                    {columnComponent(column)}
                </Grid.Row>,
            );
        }
    }
    if (placeholderType === 'table') {
        return (
            <Table.Body columns={column} stackable>
                {placeHolderComponent}
            </Table.Body>
        );
    }
    return (
        <Grid columns={column} stackable>
            {placeHolderComponent}
        </Grid>
    );
};
PlaceholderGrid.propTypes = {
    column: PropTypes.number,
    placeholderType: PropTypes.string,
    row: PropTypes.number,
};

PlaceholderGrid.defaultProps = {
    column: 1,
    placeholderType: 'block',
    row: 1,
};

export default PlaceholderGrid;
