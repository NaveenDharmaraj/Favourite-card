import React from 'react';
import { connect } from 'react-redux';
import {
    Header,
} from 'semantic-ui-react';
import {
    number,
    string,
    bool,
} from 'prop-types';

import {
    formatCurrency,
} from '../../helpers/give/utils';

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
    } = props;
    const currency = 'USD';
    const language = 'en';
    const transactionMapping = [
        {
            amount: formatCurrency(totalMoneyRaised, language, currency),
            field: 'totalMoneyRaised',
            headerText: 'All time total raised',
            popupText: 'This is the total money raised since the giving group was created, including past giving goals.',
        },
        {
            amount: formatCurrency(totalMoneyGiven, language, currency),
            field: 'totalMoneyGiven',
            headerText: 'Total given',
            popupText: 'This is the total given to others (eg.: giving groups, campaigns and charities.',
        },
        {
            amount: formatCurrency(balance, language, currency),
            field: 'balance',
            headerText: 'Total balance',
            popupText: 'This is how much the group currently have. All time total raised minus total given to others.',
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
                <Header as="h4">Transactions</Header>
                {transactionList}
                {(isAuthenticated && totalMoneyRaised && parseInt(totalMoneyRaised, 10) > 0)
                && (
                    <div className="lastGiftWapper">
                        <p onClick={updateIndex} className="lastGiftText blueText">View transactionss</p>
                    </div>
                )}
            </div>
        </div>
    );
};

TransactionsBlock.defaultProps = {
    groupDetails: {
        attributes: {
            balance: '',
            fundraisingDaysRemaining: null,
            totalMoneyGiven: '',
            totalMoneyRaised: '',
        },
    },
    isAuthenticated: false,
};

TransactionsBlock.propTypes = {
    groupDetails: {
        attributes: {
            balance: string,
            fundraisingDaysRemaining: number,
            totalMoneyGiven: string,
            totalMoneyRaised: string,
        },
    },
    isAuthenticated: bool,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
        scrollOffset: state.group.scrollOffset,
    };
}

export default connect(mapStateToProps)(TransactionsBlock);
