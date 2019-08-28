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
            doReply: false,
            commentText: '',
            inputValue: '',
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
        } = this.props;
        const {
            commentText: msg,
        } = this.state;
        postComment(dispatch, groupId, eventId, msg);
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
            id:eventId,
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
                                disabled={false} // TODO
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
    commentsCount: null,
    commentsLink: '',
    createdAt: '',
    description: '',
    dispatch: _.noop,
    groupComments: {
        loadComments: false,
    },
    id: null,
    isLiked: false,
    likesCount: null,
    name: '',
};

ActivityDetails.propTypes = {
    avatar: string,
    canReply: bool,
    commentsCount: number,
    commentsLink: string,
    createdAt: string,
    description: string,
    dispatch: func,
    groupComments: {
        loadComments: bool,
    },
    id: number,
    isLiked: bool,
    likesCount: number,
    name: string,
};

function mapStateToProps(state) {
    return {
        groupComments: state.group.groupComments,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(ActivityDetails);
