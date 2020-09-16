/* eslint-disable react/prop-types */
import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
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
        if (!_.isEmpty(props.userTagsFollowedList)) {
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
        if (!_.isEqual(userTagsFollowedList, prevProps.userTagsFollowedList) && !_.isEmpty(userTagsFollowedList)) {
            userTagsFollowedList.data.forEach((tag, i) => {
                userTags.push(tag.attributes.name);
            });
            this.setState({ userTags });
        }
        if (!_.isEmpty(userFindTagsList) && !_.isEqual(userFindTagsList, prevProps.userFindTagsList)) {
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
            pageNumber,
            loadedData,
        } = this.props;
        const searchText = '';
        resetSaveClicked(false);
        this.setState({ loader: true });
        getTagsByText(dispatch, id, searchText, false, pageNumber, loadedData);
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
                        className={`user_badgeButton ${_.includes(userTags, tag.attributes.name) ? 'active' : ''}`}
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
                {tagsBlock}
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
        if (userFindTagsList && !_.isEmpty(userFindTagsList)) {
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
        return (
            <Grid.Column computer={6} mobile={16}>
                <Header as='h4'>
                    Topics you care about
                </Header>
                {this.renderTags(userTagsFollowedList)}
                <Header as='h4'>All topics</Header>
                <p>Topics represent specific areas of charitable interests.</p>
                <div className="searchBox">
                    <Input
                        className="searchInput"
                        placeholder="Search topics"
                        onChange={this.handleInputChange}
                        fluid
                        onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleTagsSearch() : null; }}
                    />
                    <a
                        className="search-btn"
                        onClick={this.handleTagsSearch}
                    >
                    </a>
                </div>
                {this.renderTags(userFindTagsList)}
            </Grid.Column>
            // <div>
            //     <div className="pt-1">
            //         {userTagsFollowedList && (!_.isEmpty(userTagsFollowedList.data))
            //             && (
            //                 <div>
            //                     <p className="mb-1"><strong>Topics you care about</strong></p>
            //                     {this.renderTags(userTagsFollowedList)}
            //                 </div>
            //             )}
            //         <div className="pt-2">
            //             <strong>All topics</strong>
            //         </div>
            //         <div className="pt-1 mb-1">
            //             Topics represent specific areas of charitable interests.
            //         </div>
            //         <Grid>
            //             <Grid.Row>
            //                 <Grid.Column mobile={16} tablet={14} computer={8} largeScreen={8}>
            //                     <div className="pb-3 searchbox no-padd">
                                    // <Input
                                    //     className="searchInput"
                                    //     placeholder="Search topics"
                                    //     onChange={this.handleInputChange}
                                    //     fluid
                                    //     onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleTagsSearch() : null; }}
                                    // />
            //                         <a
            //                             className="search-btn"
            //                         >
            //                             <Icon
            //                                 name="search"
            //                                 onClick={this.handleTagsSearch}
            //                             />
            //                         </a>
            //                     </div>
            //                 </Grid.Column>
            //             </Grid.Row>
            //         </Grid>
            //         <div className="pt-2">
            //             {this.renderTags(userFindTagsList)}
            //         </div>
            //         <div className="pt-1 mb-2">
            //             {this.renderSeeMore()}
            //         </div>
            //     </div>
            // </div>
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
