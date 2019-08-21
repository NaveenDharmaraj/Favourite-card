import React from 'react';
import {
    Header,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import SearchCharitiesGroups from '../SearchResultsAll/SearchCharitiesGroups';
import SearchResultSingleCharityGroups from '../common/SearchResultSingleCharityGroups';
import SearchResultCTA from '../SearchResultsAll/SearchResultCTA';

const SearchResultsAll = (props) => {
    const {
        charities,
        charityLoader,
        groups,
        groupLoader,
        searchWord,
    } = props;
    return (
        <div className="search-result">
            <SearchCharitiesGroups
                charityLoader={charityLoader}
                groupLoader={groupLoader}
                charities={charities}
                groups={groups}
                searchWord={searchWord}
            />
            {/* <div className="search-main-head">
                <Header as="h2">
                            What's happening around you
                    <a href="#" style={{ marginLeft: '10' }}>View all</a>
                    <Header.Subheader>Manage your account settings and set email preferences</Header.Subheader>
                </Header>
            </div>
            {(charities && charities.data && charities.data.length > 0) && <SearchResultSingleCharityGroups CharityGroups={charities.data.slice(0, 1)} />}
            <SearchResultCTA />
            {(groups && groups.data && groups.data.length > 0) && <SearchResultSingleCharityGroups CharityGroups={groups.data.slice(0, 1)} />} */}
        </div>
    );
};


SearchResultsAll.propTypes = {
    charities: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    charityLoader: PropTypes.bool,
    groupLoader: PropTypes.bool,
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    searchWord: PropTypes.string,
};

SearchResultsAll.defaultProps = {
    charities: null,
    charityLoader: null,
    groupLoader: null,
    groups: null,
    searchWord: null,
};
export default SearchResultsAll;
