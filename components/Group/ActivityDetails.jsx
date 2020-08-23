import React from 'react';
import {
    connect,
} from 'react-redux';
import {
    Icon,
    Comment,
    Feed,
    Input,
    Button,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
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
            isCommentClicked: false,
            isReplyClicked: false,
        };
    }

    onClicked(id, url) {
        const {
            dispatch,
        } = this.props;
        dispatch(getCommentFromActivityId(id, url));
        this.setState({
            isCommentClicked: true,
        });
    }

    replyClicked() {
        this.setState({
            isReplyClicked: true,
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
        dispatch(postComment(groupId, eventId, msg, userDetails));
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
            // commentId,
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
                dispatch(unlikeActivity(eventId, groupId, userId));
            } else {
                dispatch(likeActivity(eventId, groupId, userId));
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
                            comment={comment.attributes.comment}
                        />
                    </Comment.Group>
                ))
            );
        }
        return '';
    }

    render() {
        const {
            id,
            isLiked,
            likesCount,
            avatar,
            name,
            description,
            createdAt,
            comment,
            commentsCount,
            commentsLink,
            canReply,
            groupComments: {
                loadComments,
                isReply,
                isLoadComments,
                totalCount,
            },
            type,
            disableLike,
        } = this.props;
        const {
            groupComments,
        } = this.props;
        const {
            isReplyClicked,
            commentText,
            isCommentClicked,
        } = this.state;
        let count = commentsCount;
        if (groupComments[id] && isReply && !isCommentClicked) {
            count = commentsCount + groupComments[id].length;
        } else if (groupComments[id] && isReply && isCommentClicked) {
            count = groupComments[id].length;
        } else if (groupComments[id] && !isReply && isLoadComments) {
            count = totalCount;
        }
        const time = distanceOfTimeInWords(createdAt);
        const cls = (isLiked) ? 'heart' : 'heart outline';
        return (
            <Comment>
                {type === 'events' && canReply
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
                    {name
                        ? (
                            <Comment.Text>
                                {`${name} said: ${comment}`}
                            </Comment.Text>
                        )
                        : (
                            <Comment.Text>
                                {description}
                            </Comment.Text>
                        )}
                    <Comment.Actions>
                        <Comment.Metadata>
                            <div>{time}</div>
                        </Comment.Metadata>
                        {(count !== null && canReply)
                        && (
                            <Comment.Action
                                onClick={() => this.onClicked(id, commentsLink)}
                            >
                                {`${count} ${count === 1 ? 'Comment' : 'Comments'}`}
                            </Comment.Action>
                        )}
                        {canReply
                        && (
                            <Comment.Action
                                onClick={() => this.replyClicked()}
                            >
                                •   Reply
                            </Comment.Action>
                        )}
                        {isReplyClicked && canReply
                            && (
                                <div className="postInputMainWraper">
                                    <Comment.Avatar src={avatar} />
                                    <div className="postInputWraper">
                                        <Input
                                            value={commentText}
                                            onChange={this.updateInputValue}
                                            type="text"
                                            placeholder="Add a comment"
                                            fluid
                                        />
                                    </div>
                                    <div className="postBtnWraper">
                                        {!_isEmpty(commentText)
                                        && (
                                            <Button
                                                circular
                                                onClick={this.postReplyComment}
                                                icon="paper plane outline"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        {loadComments && this.renderComments()}
                    </Comment.Actions>
                </Comment.Content>
            </Comment>
        );
    }
}

ActivityDetails.defaultProps = {
    avatar: '',
    canReply: false,
    comment: '',
    // commentId: null,
    commentsCount: null,
    commentsLink: '',
    createdAt: '',
    description: '',
    disableLike: {},
    dispatch: () => {},
    groupComments: {
        isLoadComments: false,
        isReply: false,
        loadComments: false,
    },
    groupId: null,
    id: null,
    isLiked: false,
    likesCount: null,
    name: '',
    type: '',
    userId: '',
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
    comment: string,
    // commentId: number,
    commentsCount: number,
    commentsLink: string,
    createdAt: string,
    description: string,
    disableLike: PropTypes.shape({}),
    dispatch: func,
    groupComments: PropTypes.shape({
        isLoadComments: bool,
        isReply: bool,
        loadComments: bool,
    }),
    groupId: number,
    id: number,
    isLiked: bool,
    likesCount: number,
    name: string,
    type: string,
    userId: string,
    userInfo: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            displayName: string,
        }),
    }),
};

function mapStateToProps(state) {
    return {
        disableLike: state.group.disableLike,
        groupComments: state.group.groupComments,
        groupDetails: state.group.groupDetails,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(ActivityDetails);
