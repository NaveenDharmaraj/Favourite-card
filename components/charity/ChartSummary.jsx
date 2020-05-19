import React, { Fragment } from 'react';
import {
    List,
    Grid,
    Header,
    Button,
} from 'semantic-ui-react';
import {
    arrayOf,
    PropTypes,
    bool,
    func,
    string,
} from 'prop-types';

import {
    formatCurrency,
} from '../../helpers/give/utils';

const ChartSummary = (props) => {
    const {
        color,
        text,
        value,
        hideGift,
        handleClick,
    } = props;
    const currency = 'USD';
    const language = 'en';
    return (
        <Fragment>
            {(!hideGift)
            && (
                <Grid.Row className="expenseRow ch_Expenses">
                    <Grid.Column mobile={11} tablet={12} computer={12}>
                        <List>
                            <List.Item as="h5">
                                <div className="boxes">
                                    <div className="boxVLine" />
                                    <div className="box" style={{ backgroundColor: color }} />
                                </div>
                                {(typeof hideGift !== 'undefined')
                                    ? (
                                        <List.Content>
                                            <span>{text}</span>
                                            <Button
                                                className="blue-bordr-btn-round-def"
                                                onClick={handleClick}
                                            >
                                                View gifts
                                            </Button>
                                        </List.Content>
                                    )
                                    : (
                                        <List.Content>
                                            {text}
                                        </List.Content>
                                    )}
                            </List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column mobile={5} tablet={4} computer={4} textAlign="right">
                        <Header as="h5">
                            {formatCurrency(value, language, currency)}
                        </Header>
                    </Grid.Column>
                </Grid.Row>
            )}
        </Fragment>
    );
};

ChartSummary.defaultProps = {
    color: '',
    text: '',
};

ChartSummary.propTypes = {
    color: string,
    text: string,
};

export default ChartSummary;
