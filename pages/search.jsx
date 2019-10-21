import React from 'react';


import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import {
    connect,
} from 'react-redux';
import {
    Container,
} from 'semantic-ui-react';

import Layout from '../components/shared/Layout';
import SearchBanner from '../components/Search/SearchBanner';
import SearchButtonWrapper from '../components/Search/SearchButtonWrapper';
import SearchResults from '../components/Search/SearchResults';
import {
    fetchInitialCharitiesGroups,
    fetchInitialCharities,
    fetchInitialGroups,
    fetchTextSearchCharitiesGroups,
    fetchTextSearchCharities,
    fetchTextSearchGroups,
} from '../actions/search';
import { Router } from '../routes';
import PaginationComponent from '../components/shared/Pagination';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPageClicked: 1,
            currentTab: props.searchType ? props.searchType : 'All',
        };
        this.onPageChanged = this.onPageChanged.bind(this);
    }

    static async getInitialProps({ query }) {
        let searchTypeValue;
        if (query.result_type) {
            searchTypeValue = _isArray(query.result_type) ? query.result_type[0] : query.result_type;
        } else {
            searchTypeValue = 'All';
        }
        return {
            searchType: searchTypeValue,
            searchWord: !_isEmpty(query.search) && encodeURI(query.search),
        };
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            isAuthenticated,
            searchWord,
            searchType,
        } = this.props;
        const {
            currentPageClicked,
        } = this.state;
        if (_isEmpty(searchWord) && isAuthenticated === false) {
            Router.pushRoute('/search?search=charitable impact&result_type=Beneficiary');
        }
        if (_isEmpty(searchWord) && searchType === 'All') {
            dispatch(fetchInitialCharitiesGroups(isAuthenticated, id));
        } else if (_isEmpty(searchWord) && searchType === 'Beneficiary') {
            dispatch(fetchInitialCharities(currentPageClicked, isAuthenticated, id));
        } else if (_isEmpty(searchWord) && searchType === 'Group') {
            dispatch(fetchInitialGroups(currentPageClicked, isAuthenticated, id));
        } else if (!_isEmpty(searchWord) && searchType === 'All') {
            dispatch(fetchTextSearchCharitiesGroups(decodeURI(searchWord), currentPageClicked));
        } else if (!_isEmpty(searchWord) && searchType === 'Beneficiary') {
            dispatch(fetchTextSearchCharities(decodeURI(searchWord), currentPageClicked));
        } else {
            dispatch(fetchTextSearchGroups(decodeURI(searchWord), currentPageClicked));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let {
            currentPageClicked,
            currentTab,
        } = this.state;
        const {
            currentUser: {
                id,
            },
            dispatch,
            filterData,
            isAuthenticated,
            searchType,
            searchWord,
            textSearchedCharitiesGroups,
            textSearchedCharities,
            textSearchedGroups,
        } = this.props;
        if (!_isEqual(this.props, prevProps) || !_isEqual(this.state, prevState)) {
            // Change in search word initialize the filter values
            if (!_isEqual(searchWord, prevProps.searchWord)) {
                dispatch({
                    payload: {
                        filterData: [],
                    },
                    type: 'DISPATCH_FILTER_DATA',
                });
            }
            if (!_isEmpty(textSearchedCharitiesGroups) && !_isEmpty(textSearchedCharitiesGroups.data) && !_isEmpty(textSearchedCharitiesGroups.meta)) {
                dispatch({
                    payload: {
                        filterValuesShowed: textSearchedCharitiesGroups.meta.aggregations,
                    },
                    type: 'DISPATCH_FILTER_VALUE_SHOWED',
                });
            }

            if (!_isEmpty(textSearchedCharities) && !_isEmpty(textSearchedCharities.data) && !_isEmpty(textSearchedCharities.meta)) {
                dispatch({
                    payload: {
                        filterValuesShowed: textSearchedCharities.meta.aggregations,
                    },
                    type: 'DISPATCH_FILTER_VALUE_SHOWED',
                });
            }

            if (!_isEmpty(textSearchedGroups) && !_isEmpty(textSearchedGroups.data) && !_isEmpty(textSearchedGroups.meta)) {
                dispatch({
                    payload: {
                        filterValuesShowed: textSearchedGroups.meta.aggregations,
                    },
                    type: 'DISPATCH_FILTER_VALUE_SHOWED',
                });
            }
            
            if (!_isEqual(searchType, prevProps.searchType) || !_isEqual(searchWord, prevProps.searchWord)
                || !_isEqual(currentPageClicked, prevState.currentPageClicked) || !_isEqual(filterData, prevProps.filterData)) {
                switch (searchType) {
                    case 'All':
                        if (_isEmpty(searchWord)) {
                            dispatch(fetchInitialCharitiesGroups(isAuthenticated, id));
                        } else {
                            dispatch(fetchTextSearchCharitiesGroups(decodeURI(searchWord), currentPageClicked, filterData));
                        }
                        break;
                    case 'Beneficiary':
                        if (_isEmpty(searchWord)) {
                            dispatch(fetchInitialCharities(currentPageClicked, isAuthenticated, id));
                        } else {
                            dispatch(fetchTextSearchCharities(decodeURI(searchWord), currentPageClicked, filterData));
                        }
                        break;
                    case 'Group':
                        if (_isEmpty(searchWord)) {
                            dispatch(fetchInitialGroups(currentPageClicked, isAuthenticated, id));
                        } else {
                            dispatch(fetchTextSearchGroups(decodeURI(searchWord), currentPageClicked, filterData));
                        }
                        break;
                    default: break;
                }
                // Changing the state to intial everytime there is a change in result type
                if (!_isEqual(searchType, prevProps.searchType) || !_isEqual(searchWord, prevProps.searchWord)) {
                    currentPageClicked = 1;
                }
                currentTab = searchType;
            }
            this.setState({
                currentPageClicked,
                currentTab,
            });
            window.scrollTo(0, 0);
        }
    }

    onPageChanged(event, data) {
        this.setState({
            currentPageClicked: data.activePage,
        });
    }

    renderPaginationComponent(pageCount, searchType, searchWord, currentPageClicked, charityFlag, groupFlag) {
        let showPagination = false;
        if ((searchType === 'Beneficiary' || searchType === 'All') && !charityFlag) {
            showPagination = true;
        } else if (searchType === 'Group' && !groupFlag) {
            showPagination = true;
        }
        if (showPagination) {
            if (pageCount <= 1 || (searchType === 'All' && _isEmpty(searchWord))) {
                return null;
            // eslint-disable-next-line no-else-return
            } else {
                return (
                    <PaginationComponent className="pagiantionField" onPageChanged={this.onPageChanged} activePage={currentPageClicked} totalPages={pageCount} />
                );
            }
        }
        return null;
    }


    render() {
        const {
            currentTab,
            currentPageClicked,
        } = this.state;
        const {
            charities,
            charityFlag,
            dispatch,
            groups,
            groupFlag,
            isAuthenticated,
            pageCount,
            searchType,
            searchWord,
            textSearchedCharitiesGroups,
            textSearchedCharities,
            textSearchedGroups,
        } = this.props;
        return (
            <Layout>
                <Container>
                    <SearchBanner searchType={searchType} searchWordProps={searchWord} />
                    <SearchButtonWrapper
                        currentTab={searchType}
                        dispatch={dispatch}
                        isAuthenticated={isAuthenticated}
                        searchWord={searchWord}
                    />
                    <div className="pb-2">
                        <SearchResults
                            currentTab={currentTab}
                            charityLoader={!charityFlag}
                            groupLoader={!groupFlag}
                            charities={charities}
                            isAuthenticated={isAuthenticated}
                            groups={groups}
                            searchWord={searchWord}
                            textSearchedCharitiesGroups={textSearchedCharitiesGroups}
                            textSearchedCharities={textSearchedCharities}
                            textSearchedGroups={textSearchedGroups}
                            dispatch={dispatch}
                        />
                        <div className="paginationWraper pt-1">
                            <div className="db-pagination right-align">
                                {
                                    pageCount > 0 && this.renderPaginationComponent(pageCount, searchType, searchWord, currentPageClicked, !charityFlag, !groupFlag)
                                }
                            </div>
                        </div>
                    </div>
                </Container>
            </Layout>
        );
    }
}
const mapStateToProps = (state) => ({
    charities: state.search.defaultAllCharities,
    charityFlag: state.search.charityFlag,
    currentUser: state.user.info,
    filterData: state.search.filterData,
    groupFlag: state.search.groupFlag,
    groups: state.search.defaultAllGroups,
    isAuthenticated: state.auth.isAuthenticated,
    pageCount: state.search.pageCount,
    textSearchedCharities: state.search.TextSearchedCharities,
    textSearchedCharitiesGroups: state.search.TextSearchedCharitiesGroups,
    textSearchedGroups: state.search.TextSearchedGroups,
});

Search.propTypes = {
    charities: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    charityFlag: PropTypes.bool,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
    }),
    dispatch: PropTypes.func,
    groupFlag: PropTypes.bool,
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    isAuthenticated: PropTypes.bool,
    pageCount: PropTypes.number,
    searchType: PropTypes.string,
    searchWord: PropTypes.string,
    textSearchedCharities: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    textSearchedCharitiesGroups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    textSearchedGroups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
};

Search.defaultProps = {
    charities: null,
    charityFlag: false,
    currentUser: {
        id: null,
    },
    dispatch: null,
    groupFlag: false,
    groups: null,
    isAuthenticated: false,
    pageCount: 0,
    searchType: null,
    searchWord: null,
    textSearchedCharities: null,
    textSearchedCharitiesGroups: null,
    textSearchedGroups: null,
};
export default (connect(mapStateToProps)(Search));
