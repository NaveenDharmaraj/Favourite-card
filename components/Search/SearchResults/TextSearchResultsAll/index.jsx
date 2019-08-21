import React, {Fragment} from 'react';
import {
    Grid,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import {
    connect,
} from 'react-redux';
import FilterComponent from '../../../shared/Filter';
import SearchResultSingleCharityGroups from '../common/SearchResultSingleCharityGroups';
import PlaceholderGrid from '../../../shared/PlaceHolder';
// eslint-disable-next-line react/prefer-stateless-function
class TextSearchResultsAll extends React.Component {


    render() {
        const {
            textSearchCharityGroupLoader,
            CharityGroups,
            dispatch,
            filterValuesShowed,
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
                }
            });
        }

        return (

            <div>
                <Grid>
                    {textSearchCharityGroupLoader ? <PlaceholderGrid row={2} column={1} /> : (
                        <Fragment>
                            {
                                !_isEmpty(CharityGroups) && (
                                    <Fragment>
                                        <Grid.Row>
                                            <Grid.Column style={{"display": "flex", "justifyContent": "flex-end"}}>
                                                <FilterComponent
                                                    dispatch={dispatch}
                                                    FilterHeaders={(!_isEmpty(filterValuesShowed)) ? Object.keys(filterobj) : null}
                                                    FilterValues={(!_isEmpty(filterValuesShowed)) ? Object.values(filterobj) : null}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <SearchResultSingleCharityGroups charityGroups={CharityGroups.data} />
                                        </Grid.Row>
                                    </Fragment>
                                )}
                            
                        </Fragment>
                    )}
                </Grid>
            </div>
        );
    }
}
TextSearchResultsAll.propTypes = {
    CharityGroups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    textSearchCharityGroupLoader: PropTypes.bool,
};

TextSearchResultsAll.defaultProps = {
    CharityGroups: [],
    textSearchCharityGroupLoader: null,
};
const mapStateToProps = (state) => ({
    filterValuesShowed: state.search.filterValuesShowed,
});
export default (connect(mapStateToProps)(TextSearchResultsAll));