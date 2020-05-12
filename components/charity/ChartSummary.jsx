import React, { Fragment } from 'react';
import {
    List,
    Grid,
    Header,
} from 'semantic-ui-react';

const ChartSummary = (props) => {
    const {
        color,
        text,
        value,
    } = props;
    return (
        <Fragment>
            <Grid.Row className="expenseRow ch_Expenses">
                <Grid.Column mobile={11} tablet={12} computer={12}>
                    <List>
                        <List.Item as="h5">
                            <div className="boxes">
                                <div className="boxVLine" />
                                <div className="box" style={{ backgroundColor: color }} />
                            </div>
                            <List.Content>
                                {text}
                            </List.Content>
                        </List.Item>
                    </List>
                </Grid.Column>
                <Grid.Column mobile={5} tablet={4} computer={4} textAlign="right">
                    <Header as="h5">
                        {value}
                    </Header>
                </Grid.Column>
            </Grid.Row>
        </Fragment>
    );
};

export default ChartSummary;
