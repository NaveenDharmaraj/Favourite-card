import React, { Fragment } from 'react';
import {
    List,
    Grid,
    Header,
    Button,
} from 'semantic-ui-react';
import {
    string,
    number,
    bool,
    func,
} from 'prop-types';

import {
    formatCurrency,
} from '../../helpers/give/utils';
import { withTranslation } from '../../i18n';

const ChartSummary = (props) => {
    const {
        color,
        text,
        value,
        hideGift,
        handleClick,
        showViewButton,
        t: formatMessage,
    } = props;
    const currency = 'USD';
    const language = 'en';
    return (
        <Fragment>
            {(!hideGift)
            && (
                <Grid.Row className="expenseRow ch_Expenses" data-test="ChartSummary_expenses_summary_div">
                    <Grid.Column mobile={11} tablet={12} computer={12}>
                        <List>
                            <List.Item as="h5">
                                <div className="boxes">
                                    <div className="boxVLine" />
                                    <div className="box" style={{ backgroundColor: color }} />
                                </div>
                                {showViewButton
                                    ? (
                                        <List.Content>
                                            <span>{text}</span>
                                            <Button
                                                className="blue-bordr-btn-round-def"
                                                onClick={handleClick}
                                                data-test="ChartSummary_giftViewButton_button"
                                            >
                                                {formatMessage('charityProfile:viewGiftButtonText')}
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
    handleClick: () => {},
    hideGift: false,
    showViewButton: false,
    t: () => {},
    text: '',
    value: null,
};

ChartSummary.propTypes = {
    color: string,
    handleClick: func,
    hideGift: bool,
    showViewButton: bool,
    t: func,
    text: string,
    value: number,
};

const connectedComponent = withTranslation('charityProfile')(ChartSummary);
export {
    connectedComponent as default,
    ChartSummary,
};
