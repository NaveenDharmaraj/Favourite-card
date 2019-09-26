/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Image,
    Icon,
    Grid,
    Button,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import { Link } from '../../../routes';
import UserPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';
import {
    addToFriend,
    blockUser,
} from '../../../actions/userProfile';
import {
    storeEmailIdToGive,
} from '../../../actions/dashboard';

class UserBasciProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addButtonClicked: false,
            blockButtonClicked: false,
        };

        this.handleBlockUser = this.handleBlockUser.bind(this);
        this.giveButtonClick = this.giveButtonClick.bind(this);
        this.handleAddToFriends = this.handleAddToFriends.bind(this);
    }

    handleAddToFriends(destinationUserId, destinationEmailId) {
        this.setState({
            addButtonClicked: true,
        });
        const {
            currentUser: {
                id,
                attributes: {
                    avatar,
                    email,
                    firstName,
                },
            },
            dispatch,
        } = this.props;
        addToFriend(dispatch, id, email, avatar, firstName, destinationUserId, destinationEmailId);
    }

    handleBlockUser(destinationUserId) {
        this.setState({
            blockButtonClicked: true,
        });
        const {
            currentUser: {
                id,
                attributes: {
                    email,
                },
            },
            dispatch,
        } = this.props;
        blockUser(dispatch, id, email, destinationUserId).then(() => {
            this.setState({
                blockButtonClicked: false,
            });
        }).catch((err) => {
            this.setState({
                blockButtonClicked: false,
            });
        });
    }

    giveButtonClick(email) {
        const {
            dispatch,
        } = this.props;
        storeEmailIdToGive(dispatch, email);
    }

    render() {
        const {
            userData,
        } = this.props;
        const {
            addButtonClicked,
            blockButtonClicked,
        } = this.state;
        const avatar = (typeof userData.avatar === 'undefined') || (userData.avatar === null) ? UserPlaceholder : userData.avatar;
        const friendsVisibility = (typeof userData.friends_visibility === 'undefined') ? 0 : userData.friends_visibility;
        let isBlocked = false;
        let isFriendPending = false;
        let isFriend = false;
        let email = '';
        if (!_.isEmpty(userData)) {
            const profile = userData.profile_type;
            isBlocked = profile.substring(0, 7) === 'blocked' ? true : false;
            isFriendPending = profile.substring(0, 7) === 'pending' ? true : false;
            isFriend = profile === 'friends_profile' ? true : false;
            email = Buffer.from(userData.email_hash, 'base64').toString('ascii');
        }
        return (
            <div>
                <div className="profile-header-image user" />
                <div className="profile-header">
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={3} computer={2}>
                                    <div className="profile-img-rounded">
                                        <div className="pro-pic-wraper">
                                            <Image src={avatar} circular/>
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={5} computer={7}>
                                    <Grid stackable>
                                        <Grid.Row>
                                            <Grid.Column mobile={16} tablet={16} computer={16}>
                                                <div className="ProfileHeaderWraper">
                                                    <Header as="h3">
                                                        <span className="font-s-10 type-profile">{userData.profile_type}</span>
                                                        {userData.first_name}
                                                        {' '}
                                                        {userData.last_name}
                                                        <span className="small m-0">
                                                            &nbsp;
                                                            {userData.location}
                                                        </span>
                                                        {
                                                            friendsVisibility === 0 && (
                                                                <Header.Subheader>
                                                                    <Icon name="users" />
                                                                    {userData.number_of_friends}
                                                                    &nbsp; friends
                                                                </Header.Subheader>
                                                            )
                                                        }
                                                    </Header>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                                {
                                    !isBlocked && (
                                        <Grid.Column mobile={16} tablet={8} computer={7}>
                                            <Grid stackable>
                                                <Grid.Row>
                                                    <Grid.Column width={16}>
                                                        <div className="userProfileRightBtn">
                                                            {
                                                                !isFriendPending && !isFriend && (
                                                                    <Button
                                                                        className="blue-bordr-btn-round"
                                                                        onClick={() => this.handleAddToFriends(userData.user_id, email)}
                                                                        disabled={addButtonClicked}
                                                                    >
                                                                        Add to friends
                                                                    </Button>
                                                                )
                                                            }
                                                            <Button
                                                                className="blue-bordr-btn-round"
                                                                onClick={() => this.handleBlockUser(userData.user_id)}
                                                                disabled={blockButtonClicked}
                                                            >
                                                                Block
                                                            </Button>
                                                            <Link className="lnkChange" route="/give/to/friend/new">
                                                                <Button
                                                                    primary
                                                                    className="blue-btn-rounded"
                                                                    onClick={() => this.giveButtonClick(email)}
                                                                >
                                                                    Give
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Grid.Column>
                                    )
                                }
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
                <div className="pb-3">
                    <Container>
                        <Header as="h4" className="underline">
                            About
                        </Header>
                        <p className="font-s-14">
                            {userData.description}
                        </p>
                    </Container>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(UserBasciProfile));
