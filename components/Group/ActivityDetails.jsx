import React, {
    Fragment,
} from 'react';
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

import { withTranslation } from '../../i18n';
import {
    getCommentFromActivityId,
    postComment,
    likeActivity,
    unlikeActivity,
    joinGroup,
    // likeComment,
    // unlikeComment,
} from '../../actions/group';
import {
    distanceOfTimeInWords,
} from '../../helpers/utils';

import GroupJoinModal from './GroupJoinModal';

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
        this.openJoinGroupModal = this.openJoinGroupModal.bind(this);
        this.closeJoinGroupModal = this.closeJoinGroupModal.bind(this);
        this.handleJoinGroup = this.handleJoinGroup.bind(this);
        this.state = {
            commentText: '',
            isCommentClicked: false,
            isReplyClicked: false,
            showJoinGroupModal: false,
            showJoinLoader: false,
        };
    }

    onClicked(id, count) {
        const {
            dispatch,
        } = this.props;
        dispatch(getCommentFromActivityId(id, count));
        this.setState({
            isCommentClicked: true,
        });
    }

    replyClicked() {
        const {
            dispatch,
            id,
            commentsCount,
        } = this.props;
        dispatch(getCommentFromActivityId(id, commentsCount));
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

    openJoinGroupModal() {
        this.setState({
            showJoinGroupModal: true,
        });
    }

    closeJoinGroupModal() {
        this.setState({
            showJoinGroupModal: false,
        });
    }

    handleJoinGroup() {
        const {
            dispatch,
            groupDetails: {
                attributes: {
                    slug,
                },
            },
            groupMembersDetails,
            groupId,
        } = this.props;
        const loadMembers = !_isEmpty(groupMembersDetails);
        this.setState({
            showJoinLoader: true,
        });
        dispatch(joinGroup(slug, groupId, loadMembers)).then(() => {
            this.closeJoinGroupModal();
            this.setState({
                showJoinLoader: false,
            });
        });
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
            canReply,
            groupComments: {
                loadComments,
            },
            type,
            disableLike,
            t: formatMessage,
        } = this.props;
        const {
            groupComments,
        } = this.props;
        const {
            isReplyClicked,
            commentText,
            showJoinGroupModal,
            showJoinLoader,
        } = this.state;
        let count = commentsCount;
        if (groupComments[id]) {
            count = groupComments[id].length;
        }
        const time = distanceOfTimeInWords(createdAt);
        const cls = (isLiked) ? 'red heart' : 'heart';
        return (
            <Fragment>
                <Comment onClick={!canReply ? this.openJoinGroupModal : undefined}>
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
                                <Comment.Text className={!canReply ? 'showPointer' : ''}>
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
                                onClick={() => this.onClicked(id, count)}
                            >
                                {`${count} ${count === 1 ? formatMessage('groupProfile:comment') : formatMessage('groupProfile:comments')}`}
                            </Comment.Action>
                        )}
                            {canReply
                            && (
                                <Comment.Action
                                    onClick={() => this.replyClicked()}
                                >
                                    <span className="replyDot">
                                    •
                                    </span>
                                    {formatMessage('groupProfile:reply')}
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
                                                placeholder={formatMessage('groupProfile:addCommentPlaceholder')}
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
                {showJoinGroupModal
                && (
                    <GroupJoinModal
                        open={showJoinGroupModal}
                        handleJoinGroup={this.handleJoinGroup}
                        close={this.closeJoinGroupModal}
                        showJoinLoader={showJoinLoader}
                    />
                )}
            </Fragment>
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
        totalCount: null,
    },
    groupDetails: {
        attributes: {
            slug: '',
        },
    },
    groupId: '',
    groupMembersDetails: {},
    id: null,
    isLiked: false,
    likesCount: null,
    name: '',
    t: () => {},
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
        totalCount: number,
    }),
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            slug: string,
        }),
    }),
    groupId: string,
    groupMembersDetails: PropTypes.shape({}),
    id: number,
    isLiked: bool,
    likesCount: number,
    name: string,
    t: func,
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
        groupMembersDetails: state.group.groupMembersDetails,
        userInfo: state.user.info,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(ActivityDetails));
export {
    connectedComponent as default,
    ActivityDetails,
    mapStateToProps,
};
