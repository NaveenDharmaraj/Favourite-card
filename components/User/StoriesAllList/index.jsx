import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Button,
    Container,
    Header,
    Grid,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    arrayOf,
    element,
    func,
    oneOfType,
    number,
    PropTypes,
    string,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    getStoriesList,
} from '../../../actions/dashboard';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import Pagination from '../../shared/Pagination';
import allImg from '../../../static/images/all.png';
import PlaceholderGrid from '../../shared/PlaceHolder';

class StoriesAllList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentActivePage: 1,
            storiesListLoader: !props.storiesData,

        };
        this.onPageChanged = this.onPageChanged.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        const url = `/blogs/newBlogs?size=10`;
        getStoriesList(dispatch, url);
    }

    componentDidUpdate(prevProps) {
        const {
            storiesData,
        } = this.props;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(storiesData, prevProps.storiesData)) {
                this.setState({
                    storiesListLoader: false,
                });
            }
        }
    }

    onPageChanged(e, data) {
        const {
            dispatch,
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        const url = `/blogs/newBlogs?size=10&page=${data.activePage}`;
        getStoriesList(dispatch, url);
        this.setState({
            currentActivePage: data.activePage,
            storiesListLoader: true,
        });
    }

    showStoriesList() {
        const {
            storiesData,
        } = this.props;
        let storiesList = 'No Data';
        if (storiesData && storiesData.data && _.size(storiesData.data) > 0) {
            storiesList = storiesData.data.map((data, index) => {
                const {
                    blog_excerpt,
                    blog_image_URL,
                    blog_title,
                    blog_URL,
                } = data;
                const displayAvatar = (!_.isEmpty(blog_image_URL)) ? blog_image_URL : allImg;
                const blogTitle = decodeURI(blog_title.replace('&#8217;', "'"));
                let blogDescription = decodeURI(blog_excerpt.replace('&#8217;', "'"));
                blogDescription = blogDescription.replace(/<[^>]*>/g, '');
                return (
                    <div className="search-result-single">
                        <Grid stackable>
                            <Grid.Row stretched>
                                <Grid.Column mobile={16} tablet={5} computer={5}>
                                    <div className="leftSideImage" style={{backgroundImage:`url(${displayAvatar})`}}></div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={7} computer={8} verticalAlign="top">
                                    <div className=" description">
                                        <Header as="h4">
                                            {blogTitle}
                                            <br />
                                            <br />
                                            <Header.Subheader>
                                                {!_isEmpty(blogDescription) ? blogDescription.split(' ').slice(0, 20).join(' ') : null}
                                                {(!_isEmpty(blogDescription) && blogDescription.split(' ').length > 20) && '...'}
                                            </Header.Subheader>
                                        </Header>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={4} computer={3} verticalAlign="middle" textAlign="center">
                                    <div className="btn-wraper">
                                        <Button className="view-btn" as="a" href={blog_URL} target="_blank">View</Button>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                );
            });
        }

        return (
            <Fragment>
                {storiesList}
            </Fragment>
        );
    }

    render() {
        const {
            storiesData,
        } = this.props;
        const {
            currentActivePage,
            storiesListLoader,
        } = this.state;
        const countData = (!_.isEmpty(storiesData)) ? `${storiesData.count} results` : null;
        const pageCount = (!_.isEmpty(storiesData)) ? _.ceil(storiesData.count / 10) : null;
        return (
            <div className="search-result">
                <Container>
                    <div className="search-main-head mt-0 mb-1">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={11} tablet={12} computer={12}>
                                    <Header as="h3" className="t-transform-normal mb-0">
                                        <Header.Content>
                                            Stories and tips
                                            <span className="num-result font-s-20">
                                                {countData}
                                            </span>
                                        </Header.Content>
                                    </Header>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                    { (storiesListLoader) ? <PlaceholderGrid row={3} column={1} /> : (
                        this.showStoriesList()
                    )}
                    {
                        !_.isEmpty(storiesData) && (
                            <div className="paginationWraper">
                                <div className="db-pagination right-align">
                                    <Pagination
                                        activePage={currentActivePage}
                                        totalPages={pageCount}
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

StoriesAllList.defaultProps = {
    dispatch: _.noop,
};

StoriesAllList.propTypes = {
    dispatch: func,
    storiesData: PropTypes.shape({
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
};

function mapStateToProps(state) {
    return {
        storiesData: state.dashboard.storiesData,
    };
}

export default (connect(mapStateToProps)(StoriesAllList));