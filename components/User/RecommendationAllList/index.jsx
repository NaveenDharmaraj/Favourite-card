import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Grid,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    arrayOf,
    func,
    oneOfType,
    number,
    PropTypes,
    string,
} from 'prop-types';

import {
    getRecommendationList,
} from '../../../actions/dashboard';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import Pagination from '../../shared/Pagination';
import SearchResultSingleCharityGroups from '../../Search/SearchResults/common/SearchResultSingleCharityGroups';


class RecommendationAllList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentActivePage: 1,
            recommendationListLoader: !props.recommendationData,

        };
        this.onPageChanged = this.onPageChanged.bind(this);
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        const url = `/recommend/all?userid=${Number(currentUser.id)}&page[number]=1&page[size]=10`;
        getRecommendationList(dispatch, url);
    }

    componentDidUpdate(prevProps) {
        const {
            recommendationData,
        } = this.props;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(recommendationData, prevProps.recommendationData)) {
                this.setState({
                    recommendationListLoader: false,
                });
            }
        }
    }

    onPageChanged(e, data) {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        const url = `/recommend/all?userid=${Number(id)}&page[number]=${data.activePage}&page[size]=10`;
        getRecommendationList(dispatch, url);
        this.setState({
            currentActivePage: data.activePage,
            recommendationListLoader: true,
        });
    }

    render() {
        const {
            recommendationData,
        } = this.props;
        const {
            currentActivePage,
            recommendationListLoader,
        } = this.state;
        const countData = (!_.isEmpty(recommendationData)) ? `${recommendationData.count} results` : null;
        return (
            <div className="search-result">
                <Container>
                    <div className="search-main-head mt-0 mb-1">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={11} tablet={12} computer={12}>
                                    <Header as="h3" className="t-transform-normal mb-0">
                                        <Header.Content>
                                        Recommended for you
                                            <span className="num-result font-s-20">
                                                {countData}
                                            </span>
                                        </Header.Content>
                                    </Header>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                    <SearchResultSingleCharityGroups
                        textSearchCharityGroupLoader={recommendationListLoader}
                        charityGroups={(!_.isEmpty(recommendationData)) ? recommendationData.data : []}
                    />
                    {
                        !_.isEmpty(recommendationData) && (
                            <div className="paginationWraper">
                                <div className="db-pagination right-align">
                                    <Pagination
                                        activePage={currentActivePage}
                                        totalPages={recommendationData.pageCount}
                                        onPageChanged={this.onPageChanged}
                                    />
                                </div>
                            </div>

                        )
                    }
                </Container>
            </div>
        );
    }
}

RecommendationAllList.defaultProps = {
    currentUser: {
        id: null,
    },
    dispatch: _.noop,
};

RecommendationAllList.propTypes = {
    currentUser: PropTypes.shape({
        id: oneOfType([
            number,
            string,
        ]),
    }),
    dispatch: func,
    recommendationData: PropTypes.shape({
        count: oneOfType([
            number,
            string,
        ]),
        data: arrayOf(PropTypes.shape({
            type: PropTypes.string,
        })),
        pageCount: oneOfType([
            number,
            string,
        ]),
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        recommendationData: state.dashboard.recommendationData,
    };
}

export default (connect(mapStateToProps)(RecommendationAllList));
