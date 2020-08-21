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
            popupText,
            field,
        },
    } = props;
    return (
        <div className="boxGroup">
            <div className="Currentbox">
                <Header as="h3" className={`${(field === 'balance') ? 'green' : ''}`}>{amount}</Header>
                <p>{headerText}</p>
            </div>
            <div className="Currentboxpop">
                <Popup
                    trigger={(
                        <Icon
                            name="question circle"
                        />
                    )}
                    content={popupText}
                    position="top right"
                    inverted
                />
            </div>
        </div>
    );
};

TransactionsCard.defaultProps = {
    transactionDetails: {
        amount: '',
        field: '',
        headerText: '',
        popupText: '',
    },
};

TransactionsCard.propTypes = {
    transactionDetails: PropTypes.shape({
        amount: string,
        field: string,
        headerText: string,
        popupText: string,
    }),
};

export default TransactionsCard;
