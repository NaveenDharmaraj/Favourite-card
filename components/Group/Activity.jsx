import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    Button,
    Comment,
    Input,
    Grid,
} from 'semantic-ui-react';
import {
    arrayOf,
    PropTypes,
    string,
    number,
    func,
    bool,
} from 'prop-types';
import {
    connect,
} from 'react-redux';

import {
    getGroupActivities,
    postActivity,
} from '../../actions/group';
import PlaceholderGrid from '../shared/PlaceHolder';

import ActivityDetails from './ActivityDetails';

const actionTypes = {
    PLACEHOLDER_STATUS: 'PLACEHOLDER_STATUS',
};

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.getComments = this.getComments.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.postComment = this.postComment.bind(this);
        this.state = {
            commentText: '',
        };
    }

    componentDidMount() {
        const {
            id,
            dispatch,
            groupActivities: {
                data: activityData,
            },
        } = this.props;
        if (_isEmpty(activityData)) {
            dispatch({
                payload: {
                    showPlaceholder: true,
                },
                type: actionTypes.PLACEHOLDER_STATUS,
            });
            getGroupActivities(dispatch, id);
        }
    }

    getComments() {
        const {
            id: groupId,
            groupActivities: {
                data,
            },
            groupDetails: {
                attributes: {
                    isMember,
                },
            },
            userInfo: {
                id: userId,
            },
        } = this.props;
        return (
            data.map((activity) => (
                <ActivityDetails
                    groupId={groupId}
                    id={activity.id}
                    isLiked={activity.attributes.isLiked}
                    likesCount={activity.attributes.likesCount}
                    avatar={activity.attributes.imageUrl}
                    // name={activity.attributes.source.name}
                    description={activity.attributes.description}
                    createdAt={activity.attributes.createdAt}
                    commentsCount={activity.attributes.commentsCount}
                    commentsLink={activity.relationships.comments.links.related}
                    canReply={isMember}
                    type={activity.type}
                    userId={userId}
                />
            ))
        );
    }

    loadMore() {
        const {
            dispatch,
            id,
            groupActivities: {
                nextLink: activitiesLink,
            },
        } = this.props;
        const url = (activitiesLink) ? activitiesLink : '';
        getGroupActivities(dispatch, id, url);
    }

    updateInputValue(event) {
        this.setState({
            commentText: event.target.value,
        });
    }

    postComment() {
        const {
            dispatch,
            id,
        } = this.props;
        const {
            commentText: msg,
        } = this.state;
        postActivity(dispatch, id, msg);
        this.setState({
            commentText: '',
        });
    }

    render() {
        const {
            commentsLoader,
            groupActivities: {
                data,
                nextLink: activitiesLink,
            },
            groupDetails: {
                attributes: {
                    isMember,
                },
            },
        } = this.props;
        const {
            commentText,
        } = this.state;
        let viewData = '';
        if (!_isEmpty(data)) {
            viewData = (
                <div className="c-comment">
                    <Comment.Group fluid>
                        {this.getComments()}
                    </Comment.Group>
                </div>
            );
        }
        const actionData = (
            <Grid centered>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={14} computer={14}>
                        {isMember
                        && (
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={14} computer={14}>
                                        <div className="two-icon-brdr-btm-input">
                                            <Input
                                                value={commentText}
                                                onChange={this.updateInputValue}
                                                type="text"
                                                placeholder="Write a post..."
                                                action
                                                fluid
                                            />
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={2} computer={2}>
                                        <Button
                                            onClick={this.postComment}
                                            className="blue-bordr-btn-round-def c-small"
                                        >
                                        Post
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        )
                        }
                        {viewData}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );

        return (
            <Fragment>
                {commentsLoader
                    ? <PlaceholderGrid row={1} column={1} />
                    : actionData
                }
                {(activitiesLink)
                && (
                    <div className="text-center mt-1 mb-1">
                        <Button
                            onClick={this.loadMore}
                            className="blue-bordr-btn-round-def w-180"
                            content="View more"
                        />
                    </div>
                )
                }
            </Fragment>
        );
    }
}

Activity.defaultProps = {
    commentsLoader: true,
    dispatch: func,
    groupActivities: {
        data: [],
        links: {
            next: '',
        },
    },
    id: null,
};

Activity.propTypes = {
    commentsLoader: bool,
    dispatch: _.noop,
    groupActivities: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
    id: number,
};

function mapStateToProps(state) {
    return {
        commentsLoader: state.group.showPlaceholder,
        groupActivities: state.group.groupActivities,
        groupDetails: state.group.groupDetails,
        userInfo: state.user.info,
    };
}
export default connect(mapStateToProps)(Activity);
