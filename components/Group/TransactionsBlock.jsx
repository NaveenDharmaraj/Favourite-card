import React from 'react';
import { connect } from 'react-redux';
import {
    Header,
} from 'semantic-ui-react';
import {
    number,
    string,
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

    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header as="h4">Transactions</Header>
                {transactionList}
                {(balance && parseInt(balance, 10) > 0)
                && (
                    <div className="lastGiftWapper">
                        <p className="lastGiftText blueText">View transactions</p>
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
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(TransactionsBlock);
