import React from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
    array,
} from 'prop-types';

import MatchingHistoryCard from './MatchingHistoryCard';

const MatchingHistory = (props) => {
    const {
        groupMatchingHistory: {
            data: matchHistory,
        },
    } = props;
    const historyArray = [];
    matchHistory.map((match) => {
        historyArray.push(
            <MatchingHistoryCard
                match={match}
            />,
        );
    });

    return (
        <div className="tabWapper">
            {historyArray}
        </div>
    );
};

MatchingHistory.defaultProps = {
    groupMatchingHistory: {
        data: [],
    },
};

MatchingHistory.propTypes = {
    groupMatchingHistory: PropTypes.shape({
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        groupMatchingHistory: state.group.groupMatchingHistory,
    };
}

const connectedComponent = connect(mapStateToProps)(MatchingHistory);
export {
    connectedComponent as default,
    MatchingHistory,
    mapStateToProps,
};
