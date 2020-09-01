import React from 'react';
import {
    Header,
    Popup,
    Icon,
} from 'semantic-ui-react';
import {
    string,
    PropTypes,
} from 'prop-types';

const TransactionsCard = (props) => {
    const {
        transactionDetails: {
            amount,
            headerText,
            field,
        },
    } = props;
    return (
        <div className="boxGroup">
            <div className="Currentbox">
                <Header as="h3" className={`${(field === 'balance') ? 'green' : ''}`}>{amount}</Header>
                <p>{headerText}</p>
            </div>
        </div>
    );
};

TransactionsCard.defaultProps = {
    transactionDetails: {
        amount: '',
        field: '',
        headerText: '',
    },
};

TransactionsCard.propTypes = {
    transactionDetails: PropTypes.shape({
        amount: string,
        field: string,
        headerText: string,
    }),
};

export default TransactionsCard;
