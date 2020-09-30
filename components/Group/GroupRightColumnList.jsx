import React, {
    Fragment,
} from 'react';
import {
    PropTypes,
    string,
    bool,
    array,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import ActiveMatchBlock from '../shared/ActiveMatchBlock';

import GivingGoal from './GivingGoal';
import TransactionsBlock from './TransactionsBlock';
import CharitySupport from './CharitySupport';
import ExpiredMatchBlock from '../shared/ExpiredMatchBlock';

const GroupRightColumnList = (props) => {
    const {
        activeMatch,
        type,
        hasActiveMatch,
        matchHistory,
    } = props;
    const hasMatchingHistory = !_isEmpty(matchHistory);
    return (
        <Fragment>
            <GivingGoal />
            <TransactionsBlock />
            {hasActiveMatch
            && (
                <ActiveMatchBlock
                    activeMatch={activeMatch}
                    type={type}
                    hasActiveMatch={hasActiveMatch}
                    hasMatchingHistory={hasMatchingHistory}
                />
            )}
            {(!hasActiveMatch && hasMatchingHistory)
            && (
                <ExpiredMatchBlock
                    matchHistory={matchHistory[0]}
                    hasMatchingHistory={hasMatchingHistory}
                />
            )}
            <CharitySupport />
        </Fragment>
    );
};

GroupRightColumnList.defaultProps = {
    activeMatch: {},
    hasActiveMatch: false,
    matchHistory: [],
    type: '',
};

GroupRightColumnList.propTypes = {
    activeMatch: PropTypes.shape({}),
    hasActiveMatch: bool,
    matchHistory: PropTypes.arrayOf(
        PropTypes.shape({}),
    ),
    type: string,
};

export default GroupRightColumnList;
