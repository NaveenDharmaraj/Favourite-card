import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Button,
    Comment,
    Input,
    Grid,
} from 'semantic-ui-react';
import {
    array,
    PropTypes,
    string,
    func,
    bool,
} from 'prop-types';
import {
    connect,
} from 'react-redux';

import { withTranslation } from '../../i18n';
import {
    getGroupActivities,
    postActivity,
} from '../../actions/group';
import PlaceholderGrid from '../shared/PlaceHolder';

import ActivityDetails from './ActivityDetails';

const actionTypes = {
    GROUP_PLACEHOLDER_STATUS: 'GROUP_PLACEHOLDER_STATUS',
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
            dispatch,
            groupActivities: {
                data: activityData,
            },
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        if (_isEmpty(activityData)) {
            dispatch({
                payload: {
                    showPlaceholder: true,
                },
                type: actionTypes.GROUP_PLACEHOLDER_STATUS,
            });
            dispatch(getGroupActivities(groupId));
        }
    }

    getComments() {
        const {
            groupActivities: {
                data,
            },
            groupDetails: {
                attributes: {
                    isMember,
                },
                id: groupId,
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
            groupActivities: {
                nextLink: activitiesLink,
            },
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        const url = !_isEmpty(activitiesLink) ? activitiesLink : '';
        dispatch(getGroupActivities(groupId, url));
    }

    updateInputValue(event) {
        this.setState({
            commentText: event.target.value,
        });
    }

    postComment() {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        const {
            commentText: msg,
        } = this.state;
        dispatch(postActivity(groupId, msg));
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
            t: formatMessage,
        } = this.props;
        const {
            commentText,
        } = this.state;
        let viewData = '';
        if (!_isEmpty(data)) {
            viewData = (
                <div className="c-comment ActivityComment">
                    <Comment.Group fluid>
                        {this.getComments()}
                    </Comment.Group>
                </div>
            );
        }
        const actionData = (
            <div className="ActivityTop">
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={16} computer={16}>
                            {isMember
                                && (
                                    <div className="postinputBox">
                                        <div className="two-icon-brdr-btm-input">
                                            <Input
                                                value={commentText}
                                                onChange={this.updateInputValue}
                                                type="text"
                                                placeholder={formatMessage('groupProfile:commentText')}
                                                fluid
                                            />
                                        </div>
                                        <div className="postSendButton">
                                            {(!_isEmpty(commentText))
                                                && (
                                                    <Button
                                                        circular
                                                        icon="paper plane outline"
                                                        onClick={this.postComment}
                                                    />
                                                )}
                                        </div>
                                    </div>
                                )
                            }
                            {viewData}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );

        return (
            <Fragment>
                {commentsLoader
                    ? <PlaceholderGrid row={4} column={1} placeholderType="activityList" />
                    : actionData
                }
                {(activitiesLink)
                    && (
                        <div className="text-center">
                            <Button
                                onClick={this.loadMore}
                                className="blue-bordr-btn-round-def btn_w_More"
                                content={formatMessage('groupProfile:viewMore')}
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
    dispatch: () => {},
    groupActivities: {
        data: [],
        nextLink: '',
    },
    groupDetails: {
        attributes: {
            isMember: false,
        },
        id: '',
    },
    t: () => {},
    userInfo: {
        id: '',
    },
};

Activity.propTypes = {
    commentsLoader: bool,
    dispatch: func,
    groupActivities: PropTypes.shape({
        data: array,
        nextLink: string,
    }),
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            isMember: bool,
        }),
        id: string,
    }),
    t: func,
    userInfo: PropTypes.shape({
        id: string,
    }),
};

function mapStateToProps(state) {
    return {
        commentsLoader: state.group.showPlaceholder,
        groupActivities: state.group.groupActivities,
        groupDetails: state.group.groupDetails,
        userInfo: state.user.info,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(Activity));
export {
    connectedComponent as default,
    Activity,
    mapStateToProps,
};
