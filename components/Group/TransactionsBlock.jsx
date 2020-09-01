import React from 'react';
import { connect } from 'react-redux';
import {
    Header,
    List,
} from 'semantic-ui-react';
import {
    number,
    string,
    bool,
    func,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    formatCurrency,
    formatDateForGivingTools,
} from '../../helpers/give/utils';
import { withTranslation } from '../../i18n';

import TransactionsCard from './TransactionsCard';

const TransactionsBlock = (props) => {
    const {
        groupDetails: {
            attributes: {
                totalMoneyRaised,
                totalMoneyGiven,
                balance,
                createdAt,
                fundraisingDaysRemaining,
                goal,
            },
        },
        isAuthenticated,
        t: formatMessage,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const formattedCreated = formatDateForGivingTools(createdAt);
    const hasGoal = (fundraisingDaysRemaining > 0);
    const hasPreviousGoal = ((fundraisingDaysRemaining === 0) && !_isEmpty(goal));
    const transactionMapping = [
        {
            amount: formatCurrency(totalMoneyRaised, language, currency),
            field: 'totalMoneyRaised',
            headerText: formatMessage('groupProfile:totalMoneyRaised'),
        },
        {
            amount: formatCurrency(totalMoneyGiven, language, currency),
            field: 'totalMoneyGiven',
            headerText: formatMessage('groupProfile:totalGiven'),
        },
        {
            amount: formatCurrency(balance, language, currency),
            field: 'balance',
            headerText: formatMessage('groupProfile:totalBalance'),
        },
    ];
    const transactionList = transactionMapping.map((transaction) => {
        if (!(transaction.field === 'totalMoneyRaised' && !hasPreviousGoal)) {
            return (
                <TransactionsCard
                    transactionDetails={transaction}
                />
            );
        }
        return null;
    });

    const updateIndex = () => {
        const {
            dispatch,
            scrollOffset,
        } = props;

        dispatch({
            payload: {
                activeIndex: 2,
            },
            type: 'GET_GROUP_TAB_INDEX',
        });
        window.scrollTo(0, scrollOffset);
    };

    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header as="h4" className="heading_btm">{formatMessage('groupProfile:transactionHeader')}</Header>
                {(hasGoal || hasPreviousGoal)
                && (
                    <div className="groupcreated">
                        <List verticalAlign="middle">
                            <List.Item>
                                <i aria-hidden="true" className="calendar icon" />
                                <List.Content>
                                    <List.Header>
                                        {formatMessage('groupProfile:groupCreated')}
                                        {formattedCreated}
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                        </List>
                    </div>
                )}
                {transactionList}
                {(isAuthenticated && totalMoneyRaised && parseInt(totalMoneyRaised, 10) > 0)
                && (
                    <div className="lastGiftWapper">
                        <p onClick={updateIndex} className="lastGiftText blueText">{formatMessage('groupProfile:viewTransaction')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

TransactionsBlock.defaultProps = {
    dispatch: () => {},
    groupDetails: {
        attributes: {
            balance: '',
            createdAt: '',
            fundraisingDaysRemaining: null,
            totalMoneyGiven: '',
            totalMoneyRaised: '',
        },
    },
    isAuthenticated: false,
    scrollOffset: 0,
    t: () => {},
};

TransactionsBlock.propTypes = {
    dispatch: func,
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            balance: string,
            createdAt: string,
            fundraisingDaysRemaining: number,
            totalMoneyGiven: string,
            totalMoneyRaised: string,
        }),
    }),
    isAuthenticated: bool,
    scrollOffset: number,
    t: func,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
        scrollOffset: state.group.scrollOffset,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(TransactionsBlock));
export {
    connectedComponent as default,
    TransactionsBlock,
    mapStateToProps,
};
