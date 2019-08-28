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
} from 'prop-types';
import {
    connect,
} from 'react-redux';

import {
    getGroupActivities,
    postActivity,
} from '../../actions/group';

import ActivityDetails from './ActivityDetails';

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
            getGroupActivities(dispatch, id);
        }
    }

    getComments() {
        const {
            id: groupId,
            groupActivities: {
                data,
            },
            userInfo: {
                id:userId,
            }
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
                    canReply
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
            groupActivities: {
                data,
                nextLink: activitiesLink,
            },
        } = this.props;
        const {
            commentText,
        } = this.state;
        return (
            <Fragment>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={14} computer={14}>
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
                            <div className="c-comment">
                                <Comment.Group fluid>
                                    {!_isEmpty(data) && this.getComments()}
                                </Comment.Group>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
        groupActivities: state.group.groupActivities,
        userInfo: state.user.info,
    };
}
export default connect(mapStateToProps)(Activity);
