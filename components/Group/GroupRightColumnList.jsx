import React, {
    Fragment,
} from 'react';
import {
    PropTypes,
    string,
    bool,
} from 'prop-types';

import ActiveMatchBlock from '../shared/ActiveMatchBlock';

import GivingGoal from './GivingGoal';
import TransactionsBlock from './TransactionsBlock';
// import CharitySupport from './CharitySupport';

const GroupRightColumnList = (props) => {
    const {
        activeMatch,
        type,
        hasActiveMatch,
    } = props;
    return (
        <Fragment>
            <GivingGoal />
            <TransactionsBlock />
            <ActiveMatchBlock
                activeMatch={activeMatch}
                type={type}
                hasActiveMatch={hasActiveMatch}
            />
            {/* <CharitySupport /> */}
        </Fragment>
    );
};

GroupRightColumnList.defaultProps = {
    activeMatch: {},
    hasActiveMatch: false,
    type: '',
};

GroupRightColumnList.propTypes = {
    activeMatch: PropTypes.shape({}),
    hasActiveMatch: bool,
    type: string,
};

export default GroupRightColumnList;
