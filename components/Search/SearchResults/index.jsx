/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import {
    Grid,
    Input,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';


import TextSearchResultsAll from '../SearchResults/TextSearchResultsAll';

import SearchResultsAll from './SearchResultsAll';
import SearchResultsCharities from './SearchResultsCharities';
import SearchResultGroups from './SearchResultGroups';

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.renderSearchResult = this.renderSearchResult.bind(this);
    }

    renderSearchResult() {
        const {
            currentTab,
            charities,
            charityLoader,
            dispatch,
            groups,
            groupLoader,
            isAuthenticated,
            searchWord,
            textSearchedCharitiesGroups,
            textSearchedCharities,
            textSearchedGroups,
        } = this.props;
        switch (currentTab) {
            case 'All':
                if (_isEmpty(searchWord) && isAuthenticated) {
                    return (
                        <SearchResultsAll
                            charities={charities}
                            groups={groups}
                            charityLoader={charityLoader}
                            groupLoader={groupLoader}
                            searchWord={searchWord}
                        />
                    );
                // eslint-disable-next-line no-else-return
                } else if (!_isEmpty(searchWord)) {
                    return (
                        <TextSearchResultsAll dispatch={dispatch} textSearchCharityGroupLoader={charityLoader} CharityGroups={textSearchedCharitiesGroups} />
                    );
                }
                break;
            case 'Beneficiary':
                let CharitiesArray = [];
                if (_isEmpty(searchWord)) {
                    CharitiesArray = charities;
                } else {
                    CharitiesArray = textSearchedCharities;
                }
                return <SearchResultsCharities dispatch={dispatch} isAuthenticated={isAuthenticated} searchWord={searchWord} charities={CharitiesArray} charityLoader={charityLoader} />;
            case 'Group':
                let GroupsArray = [];
                if (_isEmpty(searchWord)) {
                    GroupsArray = groups;
                } else {
                    GroupsArray = textSearchedGroups;
                }
                return <SearchResultGroups dispatch={dispatch} isAuthenticated={isAuthenticated} searchWord={searchWord} groups={GroupsArray} groupLoader={groupLoader} />;
            default: break;
        }
        return null;
    }

    render() {
        return (
            <Fragment>
                {this.renderSearchResult()}
            </Fragment>
        );
    }
}

export default SearchResults;
