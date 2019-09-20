import React, { Fragment } from 'react';
import {
    Grid,
    Header,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import FilterComponent from '../../../shared/Filter/index';
import SearchResultSingleCharityGroups from '../common/SearchResultSingleCharityGroups';
import PlaceholderGrid from '../../../shared/PlaceHolder';

// eslint-disable-next-line react/prefer-stateless-function
class SearchResultGroups extends React.Component {
    constructor(props) {
        super(props);
        this.renderResultCount = this.renderResultCount.bind(this);
    }

    renderResultCount() {
        const {
            groups,
        } = this.props
        if (!_isEmpty(groups) && !_isEmpty(groups.meta)) {
            if (groups.meta.record_count) {
                return groups.meta.record_count;
            } else if (groups.meta.recordCount) {
                return groups.meta.recordCount;
            }
        }
    }

    render() {
        const {
            dispatch,
            filterValuesShowed,
            groups,
            groupLoader,
            isAuthenticated,
            searchWord,
        } = this.props;
        let filterobj = {};
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
                } else if (key === 'type') {
                    if (newValues && newValues.length > 0) {
                        filterobj['Giving Group types'] = newValues;
                    }
                }
            });
        }

        return (

            <div>
                <Grid>
                    <Grid.Row style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                    >
                        {(_isEmpty(searchWord) && !isAuthenticated) ? null : (
                            <Grid.Column mobile={11} tablet={12} computer={12}>
                                <Header as='h2'>
                                    <Header.Content>
                                    GIVING GROUPS
                                        <span className="num-result font-s-20">
                                            {this.renderResultCount()}

                                    &nbsp;results
                                        </span>
                                    </Header.Content>
                                </Header>
                            </Grid.Column>
                        )}
                        <Grid.Column>
                            {
                                (!_isEmpty(groups) && !_isEmpty(groups.meta) && !_isEmpty(groups.meta.aggregations)) && (
                                    <FilterComponent
                                        dispatch={dispatch}
                                        FilterHeaders={(!_isEmpty(filterValuesShowed)) ? Object.keys(filterobj) : null}
                                        FilterValues={(!_isEmpty(filterValuesShowed)) ? Object.values(filterobj) : null}
                                    />
                                )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {(groups && groups.data && groups.data.length > 0)
                    ? <SearchResultSingleCharityGroups charityGroups={groups.data} />
                    : 'No Groups Available'
                }
            </div>
        );
    }
}
SearchResultGroups.propTypes = {
    groupLoader: PropTypes.bool,
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
};

SearchResultGroups.defaultProps = {
    groupLoader: null,
    groups: [],
};

const mapStateToProps = (state) => ({
    filterValuesShowed: state.search.filterValuesShowed,
});
export default (connect(mapStateToProps)(SearchResultGroups));
