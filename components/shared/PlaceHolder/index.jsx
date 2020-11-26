import React from 'react';
import {
    Grid, Placeholder, Segment, Table, Card, Divider,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const columnComponent = (column, placeholderType) => {
    const columnComponents = [];
    for (let i = 0; i < column; i++) {
        if (placeholderType === 'table') {
            columnComponents.push(
                <Table.Cell>
                    <Placeholder data-test="Shared_Placeholder_table">
                        <Placeholder.Line length="full" />
                    </Placeholder>
                </Table.Cell>,
            );
        } else if (placeholderType === 'card') {
            columnComponents.push(
                <Card.Header>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={6}>
                            <Placeholder>
                                <Placeholder.Image square />
                            </Placeholder>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Placeholder>
                                <Placeholder.Header>
                                    <Placeholder.Line length="very short" />
                                    <Placeholder.Line length="very long" />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length="long" />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Grid.Column>
                    </Grid>
                </Card.Header>,
            );
        } else if (placeholderType === 'singleCard') {
            columnComponents.push(
                <div className="charityInfowrap fullwidth">
                    <Segment raised className="no-box-shadow">
                        <Placeholder data-test="Shared_Placeholder_singlecard">
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    </Segment>
                </div>,
            );
        } else if (placeholderType === 'multiLine') {
            columnComponents.push(
                <Grid.Column width={16}>
                    <div className="ch_ModelPlaceholder">
                        <Placeholder data-test="Shared_Placeholder_multiLine">
                            <Placeholder.Line length="short" />
                            <Placeholder.Line length="full" />
                            <Placeholder.Line length="medium" />
                        </Placeholder>
                        <Divider />
                    </div>
                </Grid.Column>,
            );
        } else if (placeholderType === 'usersList') {
            columnComponents.push(
                <div className="lodingGroupPrfile">
                    <ul>
                        <li>
                            <Placeholder className="lodingImg">
                                <Placeholder.Image />
                            </Placeholder>
                        </li>
                        <li>
                            <Placeholder className="loding-text">
                                <Placeholder.Line />
                            </Placeholder>
                        </li>
                    </ul>
                </div>,
            );
        } else if (placeholderType === 'activityList') {
            columnComponents.push(
                <div className="lodingActivity">
                    <ul>
                        <li>
                            <Placeholder className="lodingImg">
                                <Placeholder.Image />
                            </Placeholder>
                        </li>
                        <li>
                            <Placeholder className="loding-text">
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder>
                        </li>
                    </ul>
                </div>,
            );
        } else {
            columnComponents.push(
                <Grid.Column>
                    <Segment raised>
                        <Placeholder
                            style={{
                                height: 100,
                                width: '100%',
                            }}
                            data-test="Shared_Placeholder_default"
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
        } else if (placeholderType === 'singleCard') {
            placeHolderComponent.push(
                columnComponent(column, placeholderType)
            );
        } else if (placeholderType === 'multiLine') {
            placeHolderComponent.push(
                <Grid.Row>
                    {columnComponent(column, placeholderType)}
                </Grid.Row>,
            );
        } else if (placeholderType === 'usersList') {
            placeHolderComponent.push(
                <Grid.Row>
                    {columnComponent(column, placeholderType)}
                </Grid.Row>,
            );
        } else if (placeholderType === 'activityList') {
            placeHolderComponent.push(
                <Grid.Row>
                    {columnComponent(column, placeholderType)}
                </Grid.Row>,
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
