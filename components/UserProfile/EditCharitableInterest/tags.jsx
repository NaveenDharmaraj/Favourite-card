/* eslint-disable react/prop-types */
import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _includes from 'lodash/includes';
import _pull from 'lodash/pull';
import {
    Input,
    Grid,
    Button,
    Header,
    Icon,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    getUserTagsFollowed,
    getTagsByText,
} from '../../../actions/userProfile';

const actionType = {
    USER_PROFILE_RESET_TAG_LIST: 'USER_PROFILE_RESET_TAG_LIST',
};

class MyTags extends React.Component {
    constructor(props) {
        super(props);
        const userTags = [];
        if (!_isEmpty(props.userTagsFollowedList)) {
            props.userTagsFollowedList.data.forEach((tag, i) => {
                userTags.push(tag.attributes.name);
            });
        }
        this.state = {
            loader: false,
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
        } = this.props;
        const searchWord = '';
        dispatch({
            type: actionType.USER_PROFILE_RESET_TAG_LIST,
        });
        getUserTagsFollowed(dispatch, id);
        getTagsByText(dispatch, id, searchWord, false);
    }

    componentDidUpdate(prevProps) {
        const {
            userTagsFollowedList,
            userFindTagsList,
        } = this.props;
        const {
            userTags,
        } = this.state;
        if (!_isEqual(userTagsFollowedList, prevProps.userTagsFollowedList) && !_isEmpty(userTagsFollowedList)) {
            userTagsFollowedList.data.forEach((tag, i) => {
                userTags.push(tag.attributes.name);
            });
            this.setState({ userTags });
        }
        if (!_isEmpty(userFindTagsList) && !_isEqual(userFindTagsList, prevProps.userFindTagsList)) {
            this.setState({ loader: false });
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
        if (_includes(userTags, name)) {
            _pull(userTags, name);
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
            pageNumber,
            loadedData,
        } = this.props;
        const searchText = '';
        resetSaveClicked(false);
        this.setState({ loader: true });
        getTagsByText(dispatch, id, searchText, false, pageNumber, loadedData);
    }

    handleOnClear = () => {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const searchWord = '';
        dispatch({
            type: actionType.USER_PROFILE_RESET_TAG_LIST,
        });
        getTagsByText(dispatch, id, searchWord, false);
        this.setState({
            searchWord: "",
        });
    }
    renderTags(tagsList, showSeeMore = false) {
        const {
            userTags,
        } = this.state;
        let tagsBlock = [];
        if (!_isEmpty(tagsList)) {
            tagsBlock = tagsList.data.map((tag) => {
                return (
                    <Button
                        className={`user_badgeButton ${_includes(userTags, tag.attributes.name) ? 'active' : ''}`}
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
            <div className="user-badge-group">
                {!_isEmpty(tagsBlock) ? tagsBlock : 'No tags found'}
                {showSeeMore && this.renderSeeMore()}
            </div>
        );
    }

    renderSeeMore() {
        const {
            loader,
        } = this.state;
        const {
            userFindTagsList,
            recordCount,
            loadedData,
        } = this.props;
        if (!_isEmpty(userFindTagsList) && userFindTagsList.data && userFindTagsList.data.length > 0) {
            const content = (
                <Fragment>
                    {(recordCount > loadedData)
                        && (
                            <div className="text-center">
                                <Button
                                    className="blue-bordr-btn-round-def  w-140"
                                    onClick={() => this.handleLoadMoreClick()}
                                    loading={loader}
                                    disabled={loader}
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
        const {
            searchWord
        } = this.state;
        return (
            <Grid.Column computer={6} mobile={16}>
                <Header as='h4'>
                    Topics you care about
                </Header>
                {this.renderTags(userTagsFollowedList, false)}
                <Header as='h4'>All topics</Header>
                <p>Topics represent specific areas of charitable interests.</p>
                <div className="searchBox">
                    <Input
                        className="searchInput"
                        placeholder="Search topics"
                        onChange={this.handleInputChange}
                        fluid
                        value={searchWord}
                        onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleTagsSearch() : null; }}
                    />
                    {searchWord.length >= 1 && <Icon name='close' onClick={() => this.handleOnClear()} />}
                    <a
                        className="search-btn"
                        onClick={this.handleTagsSearch}
                    >
                    </a>
                </div>
                {this.renderTags(userFindTagsList, true)}
            </Grid.Column>
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
    };
}

export default (connect(mapStateToProps)(MyTags));
