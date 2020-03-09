/* eslint-disable react/prop-types */
import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Input,
    Grid,
    Button,
    Icon,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    getUserTagsFollowed,
    getUserTagsRecommended,
    getTagsByText,
} from '../../../actions/userProfile';

class MyTags extends React.Component {
    constructor(props) {
        super(props);
        const userTags = [];
        if (!_.isEmpty(props.userTagsFollowedList)) {
            props.userTagsFollowedList.data.forEach((tag, i) => {
                userTags.push(tag.attributes.name);
            });
        }
        this.state = {
            currentActivePage: 1,
            loader: false,
            recommendedTagsLists: [],
            searchWord: '',
            userTags,
        };
        this.handleTags = this.handleTags.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTagsSearch = this.handleTagsSearch.bind(this);
        this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            userTagsRecommendedList,
        } = this.props;
        const {
            currentActivePage,
        } = this.state;
        const searchWord = '';
        // if (_.isEmpty(userTagsRecommendedList)) {
        //     getUserTagsRecommended(dispatch, id, currentActivePage);
        // }
        getUserTagsFollowed(dispatch, id);
        getTagsByText(dispatch, id, searchWord, false);
    }

    componentDidUpdate(prevProps) {
        const {
            userTagsFollowedList,
            userTagsRecommendedList,
            saveClickedTags,
        } = this.props;
        let {
            recommendedTagsLists,
        } = this.state;
        const {
            userTags,
        } = this.state;
        if (!_.isEqual(userTagsFollowedList, prevProps.userTagsFollowedList) && !_.isEmpty(userTagsFollowedList)) {
            userTagsFollowedList.data.forEach((tag, i) => {
                userTags.push(tag.attributes.name);
            });
            this.setState({ userTags });
        }
        if (!_.isEqual(userTagsRecommendedList, prevProps.userTagsRecommendedList) && !_.isEmpty(userTagsRecommendedList)) {
            if (saveClickedTags) {
                recommendedTagsLists = [];
                recommendedTagsLists = userTagsRecommendedList.data;
                this.setState({ currentActivePage: 1 });
            } else {
                recommendedTagsLists = recommendedTagsLists.concat(userTagsRecommendedList.data);
            }
            this.setState({                
                loader: false,
                recommendedTagsLists,
            });
        }
    }

    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
            },
            type: 'USER_PROFILE_RECOMMENDED_TAGS',
        });
    }

    handleTags(event, data) {
        const {
            name,
        } = data;
        const {
            userTags,
        } = this.state;
        if (_.includes(userTags, name)) {
            _.pull(userTags, name);
        } else {
            userTags.push(name);
        }
        this.setState({
            userTags,
        });
        this.props.getSelectedTags(this.state.userTags);
    }

    handleInputChange(event) {
        const {
            target: {
                value,
            },
        } = event;
        this.setState({
            searchWord: value,
        });
    }

    handleTagsSearch() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const {
            searchWord,
        } = this.state;
        getTagsByText(dispatch, id, searchWord, true);
    }

    handleLoadMoreClick() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            resetSaveClicked,
            // userTagsRecommendedList: {
            //     pageCount,
            // },
            pageNumber,
            loadedData,
        } = this.props;
        let {
            loader,
            currentActivePage
        } = this.state;
        const searchText = '';
        resetSaveClicked(false);
        getTagsByText(dispatch, id, searchText, false, pageNumber, loadedData);
        // if (currentActivePage === pageCount) {
        //     loader = false;
        // } else {
        //     getUserTagsRecommended(dispatch, id, currentActivePage + 1);
        //     loader = true;
        // }
        // this.setState({
        //     currentActivePage: currentActivePage + 1,
        //     loader,
        // });
    }

    checkForData() {
        const {
            userTagsRecommendedList,
        } = this.props;
        if (!_.isEmpty(userTagsRecommendedList) && userTagsRecommendedList.data && _.size(userTagsRecommendedList.data) > 0) {
            return true;
        }
        return false;
    }

    renderTags(tagsList) {
        const {
            userTags,
        } = this.state;
        let tagsBlock = [];
        if (!_.isEmpty(tagsList)) {
            tagsBlock = tagsList.data.map((tag) => {
                return (
                    <Button
                        className={`badgeButton font-s-12 medium ${_.includes(userTags, tag.attributes.name) ? 'active' : ''}`}
                        id={tag.attributes.name}
                        name={tag.attributes.name}
                        onClick={this.handleTags}
                    >
                        {tag.attributes.name}
                    </Button>
                );
            });
        }
        return (
            <div className="badge-group">
                {tagsBlock}
            </div>
        );
    }

    renderRecommendedTags() {
        const {
            userTags,
            recommendedTagsLists,
        } = this.state;
        let tagsBlock = [];
        if (!_.isEmpty(recommendedTagsLists)) {
            tagsBlock = recommendedTagsLists.map((tag) => (
                <Button
                    className={`badgeButton font-s-12 medium ${_.includes(userTags, tag.attributes.name) ? 'active' : ''}`}
                    id={tag.attributes.name}
                    name={tag.attributes.name}
                    onClick={this.handleTags}
                >
                    {tag.attributes.name}
                </Button>
            ));
        }
        return (
            <div className="badge-group">
                {tagsBlock}
            </div>
        );
    }

    renderSeeMore() {
        const {
            loader,
            currentActivePage,
        } = this.state;
        const {
            userTagsRecommendedList,
            userFindTagsList,
            recordCount,
            loadedData,
        } = this.props;
        if (userFindTagsList) {
            const content = (
                <Fragment>
                    {(recordCount > loadedData)
                        && (
                            <div className="text-center">
                                <Button
                                    className="blue-bordr-btn-round-def"
                                    onClick={() => this.handleLoadMoreClick()}
                                    loading={!!loader}
                                    disabled={!!loader}
                                    content="See more"
                                />
                            </div>
                        )
                    }
                    {
                        (loadedData
                            && (
                                <div className=" mt-1 text-center">
                                    {`Showing ${loadedData} of ${recordCount}`}
                                </div>
                            ))
                    }
                </Fragment>
            );
            return content;
        }
        return null;
    }

    render() {
        const {
            userFindTagsList,
            userTagsFollowedList,
        } = this.props;
        return (
            <div>
                <div className="pt-1">
                    {userTagsFollowedList && (!_.isEmpty(userTagsFollowedList.data))
                        && (
                            <div>
                                <p className="mb-1"><strong>Topics you care about</strong></p>
                                {this.renderTags(userTagsFollowedList)}
                            </div>
                        )}
                    <div className="pt-2">
                        <strong>All topics</strong>
                    </div>
                    <div className="pt-1 mb-1">
                    Topics represent specific areas of charitable interests.
                    </div>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={14} computer={8} largeScreen={8}>
                                <div className="pb-3 searchbox no-padd">
                                    <Input
                                        className="searchInput"
                                        placeholder="Search topics"
                                        onChange={this.handleInputChange}
                                        fluid
                                        onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleTagsSearch() : null; }}
                                    />
                                    <a
                                        className="search-btn"
                                    >
                                        <Icon
                                            name="search"
                                            onClick={this.handleTagsSearch}
                                        />
                                    </a>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <div className="pt-2">
                        {this.renderTags(userFindTagsList)}
                    </div>
                    <div className="pt-1 mb-2">
                        {this.renderSeeMore()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        loadedData: state.userProfile.loadedData,
        pageNumber: state.userProfile.pageNumber,
        recordCount: state.userProfile.recordCount,
        userFindTagsList: state.userProfile.userFindTagsList,
        userTagsFollowedList: state.userProfile.userTagsFollowedList,
        userTagsRecommendedList: state.userProfile.userTagsRecommendedList,
    };
}

export default (connect(mapStateToProps)(MyTags));
