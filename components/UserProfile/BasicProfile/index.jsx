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
    Dropdown,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import dynamic from 'next/dynamic';

import { Link } from '../../../routes';
import UserPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';
import {
    addToFriend,
    blockUser,
    removeFriend,
    generateDeeplinkUserProfile,
    acceptFriend,
} from '../../../actions/userProfile';
import {
    storeEmailIdToGive,
} from '../../../actions/dashboard';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});

class UserBasciProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addButtonClicked: false,
            blockButtonClicked: false,
            errorMessage: null,
            unfriendButtonClicked: false,
            acceptButtonClicked: false,
            confirmBlockModal: false,
            confirmUnfriendModal: false,
            statusMessage: false,
            successMessage: '',
        };

        this.handleBlockUser = this.handleBlockUser.bind(this);
        this.giveButtonClick = this.giveButtonClick.bind(this);
        this.handleAddToFriends = this.handleAddToFriends.bind(this);
        this.handleUnfriendUser = this.handleUnfriendUser.bind(this);
        this.handleAcceptFriend = this.handleAcceptFriend.bind(this);
        this.handleBlockModal = this.handleBlockModal.bind(this);
        this.handleUnfriendModal = this.handleUnfriendModal.bind(this);
        this.handleBlockCancelClick = this.handleBlockCancelClick.bind(this);
        this.handleUnfriendCancelClick = this.handleUnfriendCancelClick.bind(this);
        this.handleCopyLink = this.handleCopyLink.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
        } = this.props;
        generateDeeplinkUserProfile(dispatch, id, friendUserId);
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
        addToFriend(dispatch, id, email, avatar, firstName, destinationUserId, destinationEmailId).then(() => {
            this.setState({
                addButtonClicked: false,
            });
        }).catch((err) => {
            this.setState({
                addButtonClicked: false,
            });
        });
    }

    handleAcceptFriend(destinationUserId, destinationEmailId) {
        this.setState({
            acceptButtonClicked: true,
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
        acceptFriend(dispatch, id, email, avatar, firstName, destinationUserId, destinationEmailId).then(() => {
            this.setState({
                acceptButtonClicked: false,
            });
        }).catch((err) => {
            this.setState({
                acceptButtonClicked: false,
            });
        });
    }

    handleBlockModal() {
        this.setState({
            confirmBlockModal: true,
        });
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
                confirmBlockModal: false,
            });
        }).catch((err) => {
            this.setState({
                blockButtonClicked: false,
                confirmBlockModal: false,
            });
        });
    }

    handleBlockCancelClick() {
        this.setState({
            confirmBlockModal: false,
        });
    }

    giveButtonClick(email) {
        const {
            dispatch,
        } = this.props;
        storeEmailIdToGive(dispatch, email);
    }

    handleUnfriendModal() {
        this.setState({
            confirmUnfriendModal: true,
        });
    }

    handleUnfriendUser(destinationUserId) {
        this.setState({
            unfriendButtonClicked: true,
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
        removeFriend(dispatch, id, email, destinationUserId).then(() => {
            this.setState({
                unfriendButtonClicked: false,
                confirmUnfriendModal: false,
            });
        }).catch((err) => {
            this.setState({
                unfriendButtonClicked: false,
                confirmUnfriendModal: false,
            });
        });
    }

    handleUnfriendCancelClick() {
        this.setState({
            confirmUnfriendModal: false,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    handleCopyLink(e) {
        const data = document.getElementById('txtDeeplinkUser');
        data.type = 'text';
        data.select();
        document.execCommand('copy');
        data.type = 'hidden';
        e.target.focus();
        this.setState({
            errorMessage: null,
            successMessage: 'Copied to clipboard',
            statusMessage: true,
        })
    }

    render() {
        const {
            userData,
            userProfileProfilelink,
        } = this.props;
        const {
            acceptButtonClicked,
            addButtonClicked,
            blockButtonClicked,
            errorMessage,
            unfriendButtonClicked,
            confirmBlockModal,
            confirmUnfriendModal,
            statusMessage,
            successMessage,
        } = this.state;
        const avatar = (typeof userData.avatar === 'undefined') || (userData.avatar === null) ? UserPlaceholder : userData.avatar;
        const friendsVisibility = (typeof userData.friends_visibility === 'undefined') ? 0 : userData.friends_visibility;
        let isBlocked = false;
        let isFriendPending = false;
        let isFriend = false; let isLimited = false; let isProfileOut = false; let isProfileIn = false;
        let email = '';
        let profileType = ''; let userProfileDeeplink = '';
        if (!_.isEmpty(userData)) {
            const profile = userData.profile_type;
            isBlocked = profile.substring(0, 7) === 'blocked' ? true : false;
            isFriendPending = profile.substring(0, 7) === 'pending' ? true : false;
            isFriend = profile === 'friends_profile' ? true : false;
            isLimited = profile === 'limited_profile' ? true : false;
            isProfileOut = profile === 'pending_profile_out' ? true : false;
            isProfileIn = profile === 'pending_profile_in' ? true : false;
            email = Buffer.from(userData.email_hash, 'base64').toString('ascii');
            profileType = profile.substring(0, 7);
        }
        if (!_.isEmpty(userProfileProfilelink)) {
            userProfileDeeplink = userProfileProfilelink.data.attributes['short-link'];
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
                                                        <span className="font-s-10 type-profile">{profileType}</span>
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
                                                <div>
                                                    <Modal
                                                        size="tiny"
                                                        dimmer="inverted"
                                                        className="chimp-modal"
                                                        closeIcon
                                                        closeOnEscape={false}
                                                        closeOnDimmerClick={false}
                                                        open={confirmBlockModal}
                                                        onClose={() => { this.setState({ confirmBlockModal: false }); }}
                                                    >
                                                        <Modal.Header>
                                                            Block
                                                            {' '}
                                                            {userData.first_name}
                                                            {' '}
                                                            {userData.last_name}
                                                        </Modal.Header>
                                                        <Modal.Content>
                                                            <Modal.Description className="font-s-16">
                                                                Are you sure you want to block this user?
                                                            </Modal.Description>
                                                            <div className="btn-wraper pt-3 text-right">
                                                                <Button
                                                                    className="danger-btn-rounded-def c-small"
                                                                    onClick={() => this.handleBlockUser(userData.user_id)}
                                                                    disabled={blockButtonClicked}
                                                                >
                                                                    Block
                                                                </Button>
                                                                <Button
                                                                    className="blue-bordr-btn-round-def c-small"
                                                                    onClick={this.handleBlockCancelClick}
                                                                    disabled={blockButtonClicked}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </Modal.Content>
                                                    </Modal>
                                                </div>
                                                <div>
                                                    <Modal
                                                        size="tiny"
                                                        dimmer="inverted"
                                                        className="chimp-modal"
                                                        closeIcon
                                                        closeOnEscape={false}
                                                        closeOnDimmerClick={false}
                                                        open={confirmUnfriendModal}
                                                        onClose={() => { this.setState({ confirmUnfriendModal: false }); }}
                                                    >
                                                        <Modal.Header>
                                                            Unfriend
                                                            {' '}
                                                            {userData.first_name}
                                                            {' '}
                                                            {userData.last_name}
                                                        </Modal.Header>
                                                        <Modal.Content>
                                                            <Modal.Description className="font-s-16">
                                                                Are you sure you want to unfriend this user?
                                                            </Modal.Description>
                                                            <div className="btn-wraper pt-3 text-right">
                                                                <Button
                                                                    className="danger-btn-rounded-def c-small"
                                                                    onClick={() => this.handleUnfriendUser(userData.user_id)}
                                                                    disabled={unfriendButtonClicked}
                                                                >
                                                                    Unfriend
                                                                </Button>
                                                                <Button
                                                                    className="blue-bordr-btn-round-def c-small"
                                                                    onClick={this.handleUnfriendCancelClick}
                                                                    disabled={unfriendButtonClicked}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </Modal.Content>
                                                    </Modal>
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
                                                            <input
                                                                ref={(textarea) => this.textArea = textarea}
                                                                value={userProfileDeeplink}
                                                                type="hidden"
                                                                id="txtDeeplinkUser"
                                                            />
                                                            {
                                                                !isFriendPending && !isFriend && (
                                                                    <Button
                                                                        className="blue-btn-rounded"
                                                                        onClick={() => this.handleAddToFriends(userData.user_id, email)}
                                                                        disabled={addButtonClicked}
                                                                        primary
                                                                    >
                                                                        Add Friend
                                                                    </Button>
                                                                )
                                                            }                                                            
                                                            {
                                                                isProfileOut && (
                                                                    <Button
                                                                        className="blue-btn-rounded"
                                                                        disabled
                                                                        primary
                                                                    >
                                                                        Pending
                                                                    </Button>
                                                                )
                                                            }
                                                            {
                                                                isProfileIn && (
                                                                    <Button
                                                                        className="blue-btn-rounded"
                                                                        onClick={() => this.handleAcceptFriend(userData.user_id, email)}
                                                                        disabled={acceptButtonClicked}
                                                                        primary
                                                                    >
                                                                        Accept Friend Request
                                                                    </Button>
                                                                )
                                                            }
                                                            {
                                                                isFriend && (
                                                                    <Link className="lnkChange" route={`/chats/${userData.user_id}`}>
                                                                        <Button
                                                                            className="blue-btn-rounded"
                                                                            primary
                                                                        >
                                                                            Message
                                                                        </Button>
                                                                    </Link>
                                                                )
                                                            }
                                                            <Link className="lnkChange" route="/give/to/friend/new">
                                                                <Button
                                                                    className="blue-bordr-btn-round"
                                                                    onClick={() => this.giveButtonClick(email)}
                                                                >
                                                                    Give
                                                                </Button>
                                                            </Link>
                                                            {
                                                                !isProfileOut && !isProfileIn && (
                                                                    <Dropdown
                                                                        className="userEllips ml-1"
                                                                        icon="ellipsis horizontal"
                                                                        closeOnBlur
                                                                    >
                                                                        <Dropdown.Menu>
                                                                            {
                                                                                (isFriend || isLimited) && (
                                                                                    <Dropdown.Item
                                                                                        text="Copy Profile URL"
                                                                                        onClick={this.handleCopyLink}
                                                                                    />
                                                                                )
                                                                            }
                                                                            {
                                                                                isFriend && (
                                                                                    <Dropdown.Item
                                                                                        text="Unfriend"
                                                                                        onClick={this.handleUnfriendModal}
                                                                                    />
                                                                                )
                                                                            }                                                                            
                                                                            {
                                                                                !isProfileOut && !isProfileIn && (
                                                                                    <Dropdown.Item
                                                                                        text="Block"
                                                                                        onClick={this.handleBlockModal}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                )
                                                            }                                                            
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Grid.Column>
                                    )
                                }
                            </Grid.Row>
                            {
                                statusMessage && (
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <ModalStatusMessage 
                                                message = {!_.isEmpty(successMessage) ? successMessage : null}
                                                error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }
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
        userProfileProfilelink: state.userProfile.userProfileProfilelink,
    };
}

export default (connect(mapStateToProps)(UserBasciProfile));
