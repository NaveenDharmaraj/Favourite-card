/* eslint-disable react/prop-types */
import React from 'react';
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
            userTags,
            searchWord: '',
            currentActivePage: 1,
            showLoadMoreButton: true,
            recommendedTagsLists: [],
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
        } = this.props;
        const {
            currentActivePage
        } = this.state;
        getUserTagsRecommended(dispatch, id, currentActivePage);
        getUserTagsFollowed(dispatch, id);
    }

    componentDidUpdate(prevProps) {
        const {
            userTagsFollowedList,
            userTagsRecommendedList
        } = this.props;
        let {
            userTags,
            recommendedTagsLists,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userTagsFollowedList, prevProps.userTagsFollowedList)) {
                if (!_.isEmpty(userTagsFollowedList)) {
                    userTagsFollowedList.data.forEach((tag, i) => {
                        userTags.push(tag.attributes.name);
                    });
                }
            }
            if (!_.isEqual(userTagsRecommendedList, prevProps.userTagsRecommendedList)) {
                recommendedTagsLists = recommendedTagsLists.concat(userTagsRecommendedList.data);
            }
            this.setState({ recommendedTagsLists, userTags });
        }
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
        getTagsByText(dispatch, id, searchWord);
    }

    handleLoadMoreClick() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            userTagsRecommendedList: {
                pageCount,
            },
        } = this.props;
        let {
            currentActivePage,
            showLoadMoreButton,
        } = this.state;
        if (pageCount > 1) {
            getUserTagsRecommended(dispatch, id, currentActivePage + 1);
        } else {
            showLoadMoreButton = false;
        }
        if (pageCount === currentActivePage + 1) {
            showLoadMoreButton = false;
        }
        this.setState({
            currentActivePage: currentActivePage + 1,
            showLoadMoreButton,
        });
    }

    renderSearchedTags() {
        const {
            userFindTagsList,
        } = this.props;
        const {
            userTags,
        } = this.state;
        let tagsBlock = [];
        if (!_.isEmpty(userFindTagsList)) {
            tagsBlock = userFindTagsList.data.map((tag) => {
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

    renderFollowedTags() {
        const {
            userTagsFollowedList,
        } = this.props;
        const {
            userTags,
        } = this.state;
        let tagsBlock = [];
        if (!_.isEmpty(userTagsFollowedList)) {
            tagsBlock = userTagsFollowedList.data.map((tag) => {
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

    render() {
        const {
            showLoadMoreButton,
        } = this.state;
        return (
            <div>
                <div className="pt-2">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={14} computer={8} largeScreen={8}>
                                <div className="pb-3 searchbox no-padd">
                                    <Input
                                        className="searchInput"
                                        placeholder="Search..."
                                        onChange={this.handleInputChange}
                                        fluid
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
                        {this.renderSearchedTags()}
                    </div>
                    <div className="pt-2">
                        <p className="mb-1-2"><strong>Tags you follow</strong></p>
                        <p className="mb-2">Tags can refine the charities and Giving Groups discovered for you. </p>
                        {this.renderFollowedTags()}
                    </div>
                    <div className="pt-2">
                        <p className="mb-1-2"><strong>Recommended tags to follow</strong></p>
                        <p className="mb-2">Tags can refine the charities and Giving Groups discovered for you. </p>
                        {this.renderRecommendedTags()}
                    </div>
                    {
                        showLoadMoreButton && (
                            <div className="bigBtn pt-1">
                                <Button
                                    className="blue-bordr-btn-round-def"
                                    onClick={this.handleLoadMoreClick}
                                >
                                    Load more
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFindTagsList: state.userProfile.userFindTagsList,
        userTagsFollowedList: state.userProfile.userTagsFollowedList,
        userTagsRecommendedList: state.userProfile.userTagsRecommendedList,
    };
}

export default (connect(mapStateToProps)(MyTags));
