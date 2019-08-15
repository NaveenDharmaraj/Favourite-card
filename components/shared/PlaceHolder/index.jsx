import React from 'react';
import {
    Grid, Placeholder, Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const columnComponent = (column) => {
    const columnComponents = [];
    for (let i = 0; i < column; i++) {
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
    return columnComponents;
};
const PlaceholderGrid = (props) => {
    const {
        column,
        row,
    } = props;
    const placeHolderComponent = [];
    for (let i = 0; i < row; i++) {
        placeHolderComponent.push(
            <Grid.Row>
                {columnComponent(column)}
            </Grid.Row>,
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
    row: PropTypes.number,
};
PlaceholderGrid.defaultProps = {
    column: 1,
    row: 1,
};
export default PlaceholderGrid;
