import React from 'react';
import {
    connect,
} from 'react-redux';
import {
    Icon,
    Comment,
    Feed,
    Grid,
    Input,
    Button,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    func,
    bool,
    string,
    number,
    PropTypes,
} from 'prop-types';

import {
    getCommentFromActivityId,
    postComment,
    likeActivity,
    unlikeActivity,
    // likeComment,
    // unlikeComment,
} from '../../actions/group';
import {
    distanceOfTimeInWords,
} from '../../helpers/utils';

const actionTypes = {
    DISABLE_LIKE_BUTTON: 'DISABLE_LIKE_BUTTON',
};

class ActivityDetails extends React.Component {
    constructor(props) {
        super(props);
        this.onClicked = this.onClicked.bind(this);
        this.renderComments = this.renderComments.bind(this);
        this.replyClicked = this.replyClicked.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.postReplyComment = this.postReplyComment.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.state = {
            commentText: '',
            doReply: false,
        };
    }

    onClicked(id, url) {
        const {
            dispatch,
        } = this.props;
        getCommentFromActivityId(dispatch, id, url);
    }

    replyClicked() {
        this.setState({
            doReply: true,
        });
    }

    updateInputValue(event) {
        this.setState({
            commentText: event.target.value,
        });
    }

    postReplyComment() {
        const {
            groupId,
            dispatch,
            id: eventId,
            userInfo: {
                attributes: {
                    avatar,
                    displayName,
                },
            },
        } = this.props;
        const {
            commentText: msg,
        } = this.state;
        const userDetails = {
            avatar,
            displayName,
        };
        postComment(dispatch, groupId, eventId, msg, userDetails);
        this.setState({
            commentText: '',
        });
    }

    handleLike() {
        const {
            dispatch,
            isLiked,
            id: eventId,
            groupId,
            userId,
            type,
            commentId,
        } = this.props;
        dispatch({
            payload: {
                id: eventId,
            },
            type: actionTypes.DISABLE_LIKE_BUTTON,
        });
        // if (type === 'comments') {
        //     if (isLiked) {
        //         unlikeComment(dispatch, eventId, groupId, userId, commentId);
        //     } else {
        //         likeComment(dispatch, eventId, groupId, userId, commentId);
        //     }
        // }
        if (type === 'events') {
            if (isLiked) {
                unlikeActivity(dispatch, eventId, groupId, userId);
            } else {
                likeActivity(dispatch, eventId, groupId, userId);
            }
        }
    }

    renderComments() {
        const {
            id: eventId,
            groupComments,
            userId,
        } = this.props;
        if (groupComments[eventId] && groupComments[eventId].length > 0) {
            return (
                groupComments[eventId].map((comment) => (
                    <Comment.Group>
                        <ActivityDetails
                            groupId={comment.attributes.groupId}
                            id={eventId}
                            isLiked={false}
                            likesCount={comment.attributes.likesCount}
                            avatar={comment.attributes.avatar}
                            name={comment.attributes.creator}
                            description={comment.attributes.comment}
                            createdAt={comment.attributes.createdAt}
                            canReply={false}
                            type={comment.type}
                            userId={userId}
                            commentId={comment.id}
                        />
                    </Comment.Group>
                ))
            );
        }
        return '';
    }

    render() {
        const {
            groupId,
            id,
            isLiked,
            likesCount,
            avatar,
            name,
            description,
            createdAt,
            commentsCount,
            commentsLink,
            canReply,
            groupComments: {
                loadComments,
            },
            updateInputValue,
            type,
            userId,
            disableLike,
        } = this.props;
        const {
            doReply,
            commentText,
        } = this.state;
        const time = distanceOfTimeInWords(createdAt);
        const cls = (isLiked) ? 'heart' : 'heart outline';
        return (
            <Comment>
                {type === 'events'
                && (
                    <Feed.Meta className="cmntLike">
                        <Feed.Like>
                            <Icon
                                name={cls}
                                onClick={this.handleLike}
                                disabled={disableLike[id]}
                            />
                            {likesCount}
                        </Feed.Like>
                    </Feed.Meta>
                )}
                <Comment.Avatar src={avatar} />
                <Comment.Content>
                    {name && <Comment.Author as="a">{name}</Comment.Author>}
                    <Comment.Text>
                        {description}
                    </Comment.Text>
                    <Comment.Actions>
                        <Comment.Metadata>
                            <div>{time}</div>
                        </Comment.Metadata>
                        {(commentsCount > 0)
                        && (
                            <Comment.Action
                                onClick={() => this.onClicked(id, commentsLink)}
                            >
                            Comments (
                                {commentsCount}
                            )
                            </Comment.Action>
                        )}
                        {loadComments && this.renderComments()}
                        {canReply
                        && (
                            <Comment.Action
                                onClick={() => this.replyClicked()}
                            >
                                Reply
                            </Comment.Action>
                        )}


                        {doReply
                            && (
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={14} computer={14}>
                                            <div className="two-icon-brdr-btm-input replayInput">
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
                                                onClick={this.postReplyComment}
                                                className="blue-bordr-btn-round-def c-small"
                                            >
                                                Reply
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            )}

                    </Comment.Actions>
                </Comment.Content>
            </Comment>
        );
    }
}

ActivityDetails.defaultProps = {
    avatar: '',
    canReply: false,
    commentId: null,
    commentsCount: null,
    commentsLink: '',
    createdAt: '',
    description: '',
    disableLike: {},
    dispatch: _.noop,
    groupComments: {
        loadComments: false,
    },
    groupId: null,
    id: null,
    isLiked: false,
    likesCount: null,
    name: '',
    type: '',
    userId: null,
    userInfo: {
        attributes: {
            avatar: '',
            displayName: '',
        },
    },
};

ActivityDetails.propTypes = {
    avatar: string,
    canReply: bool,
    commentId: number,
    commentsCount: number,
    commentsLink: string,
    createdAt: string,
    description: string,
    disableLike: PropTypes.shape({}),
    dispatch: func,
    groupComments: {
        loadComments: bool,
    },
    groupId: number,
    id: number,
    isLiked: bool,
    likesCount: number,
    name: string,
    type: string,
    userId: number,
    userInfo: {
        attributes: {
            avatar: string,
            displayName: string,
        },
    },
};

function mapStateToProps(state) {
    return {
        disableLike: state.group.disableLike,
        groupComments: state.group.groupComments,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(ActivityDetails);
