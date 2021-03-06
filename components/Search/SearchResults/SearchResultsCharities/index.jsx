import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    Header,
} from 'semantic-ui-react';

import _isEmpty from 'lodash/isEmpty';
import {
    connect,
} from 'react-redux';

import NodataState from '../../../shared/NoDataState';
import SearchResultSingleCharityGroups from '../common/SearchResultSingleCharityGroups';
import PlaceholderGrid from '../../../shared/PlaceHolder';
import FilterComponent from '../../../shared/Filter/index';


// eslint-disable-next-line react/prefer-stateless-function
class SearchResultsCharities extends React.Component {
    constructor(props) {
        super(props);
        this.renderTotalCount = this.renderTotalCount.bind(this);
    }

    renderTotalCount() {
        const {
            charities,
        } = this.props;
        if (!_isEmpty(charities) && !_isEmpty(charities.meta)) {
            if (charities.meta.record_count) {
                return charities.meta.record_count.toLocaleString('en-CA');
            } else if (charities.meta.recordCount) {
                return charities.meta.recordCount.toLocaleString('en-CA');
            } else {
                return null;
            }
        }
        return null;
    }

    render() {
        const {
            charities,
            charityLoader,
            dispatch,
            filterValuesShowed,
            isAuthenticated,
            searchWord,
        } = this.props;
        let filterobj = {};
        const contentData = `Sorry, there are no results under ${searchWord}.`;
        const subHeaderData = 'Try a new search with more general words.';
        if (!_isEmpty(filterValuesShowed)) {
            Object.entries(filterValuesShowed).map(([
                key,
                values,
            ]) => {
                const newValues = values.buckets;
                if (key === 'location' || key === 'categories') {
                    if (newValues && newValues.length > 0) {
                        filterobj[key] = newValues;
                    }
                } else if (key === 'charity_size') {
                    if (newValues && newValues.length > 0) {
                        filterobj['Charity Size'] = newValues;
                    }
                } else if (key === 'designation') {
                    if (newValues && newValues.length > 0) {
                        filterobj['Charity designation'] = newValues;
                    }
                } else if (key === 'language') {
                    if (newValues && newValues.length > 0) {
                        filterobj.Language = newValues;
                    }
                }
            });
        }

        return (

            <Fragment>
                <Grid>
                    <Grid.Row style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                    >
                        {(_isEmpty(searchWord) && !isAuthenticated) ? null : (
                            <Grid.Column mobile={11} tablet={12} computer={12} className="charities exploreHeader">
                                <Header as="h2" className="searchResultTabHeader">
                                    <Header.Content>
                                        CHARITIES
                                        <span className="num-result font-s-20">
                                            {this.renderTotalCount()}
                                            &nbsp;results
                                        </span>
                                    </Header.Content>
                                </Header>
                            </Grid.Column>
                        )
                        }
                        <Grid.Column>
                            {
                                (!_isEmpty(charities) && !_isEmpty(charities.data) && charities.data.length > 0) && (
                                    <FilterComponent
                                        dispatch={dispatch}
                                        FilterHeaders={(!_isEmpty(filterValuesShowed)) ? Object.keys(filterobj) : null}
                                        FilterValues={(!_isEmpty(filterValuesShowed)) ? Object.values(filterobj) : null}
                                    />
                                )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {(charities && charities.data && charities.data.length > 0)
                    ? <SearchResultSingleCharityGroups charityGroups={charities.data} />
                    : <NodataState contentData={contentData} subHeaderData={subHeaderData} />
                }
            </Fragment>

        );
    }
}
SearchResultsCharities.propTypes = {
    charities: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    charityLoader: PropTypes.bool,
};

SearchResultsCharities.defaultProps = {
    charities: [],
    charityLoader: null,
};
const mapStateToProps = (state) => ({
    filterValuesShowed: state.search.filterValuesShowed,
});
export default (connect(mapStateToProps)(SearchResultsCharities));
