import React from 'react';
import { connect } from 'react-redux';
import {
    Header,
} from 'semantic-ui-react';
import {
    number,
    string,
    bool,
    func,
    PropTypes,
} from 'prop-types';

import {
    formatCurrency,
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
                fundraisingDaysRemaining,
            },
        },
        isAuthenticated,
        t: formatMessage,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const transactionMapping = [
        {
            amount: formatCurrency(totalMoneyRaised, language, currency),
            field: 'totalMoneyRaised',
            headerText: formatMessage('groupProfile:totalMoneyRaised'),
            popupText: formatMessage('groupProfile:totalMoneyPopup'),
        },
        {
            amount: formatCurrency(totalMoneyGiven, language, currency),
            field: 'totalMoneyGiven',
            headerText: formatMessage('groupProfile:totalGiven'),
            popupText: formatMessage('groupProfile:totalGivenPopup'),
        },
        {
            amount: formatCurrency(balance, language, currency),
            field: 'balance',
            headerText: formatMessage('groupProfile:totalBalance'),
            popupText: formatMessage('groupProfile:totalBalancePopup'),
        },
    ];
    const transactionList = transactionMapping.map((transaction) => {
        if (!(transaction.field === 'totalMoneyRaised' && fundraisingDaysRemaining === 0)) {
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
        // TODO uncomment until transaction tab ui changes are done

        // dispatch({
        //     payload: {
        //         activeIndex: 2,
        //     },
        //     type: 'GET_GROUP_TAB_INDEX',
        // });
        // window.scrollTo(0, scrollOffset);
    };

    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header as="h4">{formatMessage('groupProfile:transactionHeader')}</Header>
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
