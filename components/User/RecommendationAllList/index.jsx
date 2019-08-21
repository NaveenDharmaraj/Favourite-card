import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Button,
    Container,
    Header,
    Grid,
    Icon,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    arrayOf,
    bool,
    element,
    func,
    oneOf,
    oneOfType,
    number,
    PropTypes,
    string,
} from 'prop-types';

import {
    getRecommendationList,
} from '../../../actions/dashboard';
import Pagination from '../../shared/Pagination';
import placeholderCharity from '../../../static/images/no-data-avatar-charity-profile.png';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import { Link } from '../../../routes';
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
        const url = `/recommend/all?userid=${Number(id)}&page[number]=${data.activePage}&page[size]=10`;
        getRecommendationList(dispatch, url);
        this.setState({
            recommendationListLoader: true,
            currentActivePage: data.activePage,
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
                                    <Header as='h3' className="t-transform-normal mb-0">
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
                            charityGroups={(!_.isEmpty(recommendationData)) ? recommendationData.data : []}/>
                    {
                        !_.isEmpty(recommendationData) && (
                            <div className="db-pagination right-align">
                                <Pagination
                                    activePage={currentActivePage}
                                    totalPages={recommendationData.pageCount}
                                    onPageChanged={this.onPageChanged}
                                />
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
    recommendationListLoader: true,
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
        data: arrayOf(element),
        pageCount: oneOfType([
            number,
            string,
        ]),
    }),
    recommendationListLoader: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        recommendationData: state.dashboard.recommendationData,
    };
}

export default (connect(mapStateToProps)(RecommendationAllList));
