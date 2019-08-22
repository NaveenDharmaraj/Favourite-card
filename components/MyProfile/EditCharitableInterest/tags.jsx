/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Input,
    Grid,
    Button,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    getUserTagsFollowed,
    getUserTagsRecommended,
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
        };
        this.handleTags = this.handleTags.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getUserTagsRecommended(dispatch, null, id);
        getUserTagsFollowed(dispatch, id);
    }

    componentDidUpdate(prevProps) {
        const {
            userTagsFollowedList,
        } = this.props;
        const {
            userTags,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userTagsFollowedList, prevProps.userTagsFollowedList)) {
                if (!_.isEmpty(userTagsFollowedList)) {
                    userTagsFollowedList.data.forEach((tag, i) => {
                        userTags.push(tag.attributes.name);
                    });
                }
                this.setState({ userTags });
            }
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
            userTagsRecommendedList,
        } = this.props;
        const {
            userTags,
        } = this.state;
        let tagsBlock = [];
        if (!_.isEmpty(userTagsRecommendedList)) {
            tagsBlock = userTagsRecommendedList.data.map((tag, i) => (
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
        return (
            <div>
                <div className="pt-2">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={14} computer={8} largeScreen={8}>
                                <div className="pb-3">
                                    <Input icon="search" className="searchInput" placeholder="Search..." fluid />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <div>
                        <p className="mb-1-2"><strong>Tags you follow</strong></p>
                        <p className="mb-2">Tags can refine the charities and Giving Groups discovered for you. </p>
                        {this.renderFollowedTags()}
                    </div>
                    <div>
                        <p className="mb-1-2"><strong>Recommended tags to follow</strong></p>
                        <p className="mb-2">Tags can refine the charities and Giving Groups discovered for you. </p>
                        {this.renderRecommendedTags()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userTagsFollowedList: state.userProfile.userTagsFollowedList,
        userTagsRecommendedList: state.userProfile.userTagsRecommendedList,
    };
}

export default (connect(mapStateToProps)(MyTags));
