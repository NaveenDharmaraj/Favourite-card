import React, {
    Fragment,
} from 'react';
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
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';
import { Link } from '../../../routes';
import UserPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';
import {
    addToFriend,
    blockUser,
    removeFriend,
    generateDeeplinkUserProfile,
    acceptFriend,
    rejectFriendInvite,
} from '../../../actions/userProfile';
import {
    storeEmailIdToGive,
} from '../../../actions/dashboard';

import {
    getLocation,
    getPrivacyType,
} from '../../../helpers/profiles/utils';

import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';
// import EditProfile from '../../../pages/user-profile/editProfile';
import EditBasicProfile from '../EditBasicProfile';

const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});

class UserBasicProfile extends React.Component {
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
        this.handleRejectRequest = this.handleRejectRequest.bind(this);
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

    giveButtonClick(email, name, avatar) {
        const {
            dispatch,
        } = this.props;
        storeEmailIdToGive(dispatch, email, name, avatar);
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

    handleRejectRequest() {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: currentUserId,
            },
            dispatch,
            userFriendProfileData: {
                attributes: {
                    user_id: friendUserId,
                },
            },
        } = this.props;
        rejectFriendInvite(dispatch, currentUserId, friendUserId, email, 'myProfile');
    }

    render() {
        const {
            previewMode: {
                isPreviewMode,
                previewValue,
            },
            userFriendProfileData: {
                attributes: {
                    avatar,
                    city,
                    description,
                    first_name,
                    last_name,
                    number_of_friends,
                    province,
                    profile_type,
                    friends_visibility,
                    user_id,
                    email_hash,
                },
            },
            handlePreviewPage,
            hanldeFriendPage,
            // userData,
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
        let userProfileDeeplink = '';
        const isMyProfile = (profile_type === 'my_profile');
        const friendText = (number_of_friends > 1) ? 'friends' : 'friend';
        const showUserFriends = (friends_visibility === 0 ||
            (profile_type === 'friends_profile' && friends_visibility === 1) ||
            (isMyProfile && !isPreviewMode) || (isPreviewMode && friends_visibility === previewValue));
        
        if (!_.isEmpty(userProfileProfilelink)) {
            userProfileDeeplink = userProfileProfilelink.data.attributes['short-link'];
        }
        // const avatar = (typeof userData.avatar === 'undefined') || (userData.avatar === null) ? UserPlaceholder : userData.avatar;
        // const friendsVisibility = (typeof userData.friends_visibility === 'undefined') ? 0 : userData.friends_visibility;
        let isBlocked = false;
        let isFriendPending = false;
        let isFriend = false;
        let isLimited = false;
        let isProfileOut = false;
        let isProfileIn = false;
        isBlocked = (profile_type.substring(0, 7) === 'blocked') ? true : false;
        isFriendPending = (profile_type.substring(0, 7) === 'pending') ? true : false;
        isFriend = (profile_type === 'friends_profile') ? true : false;
        isLimited = (profile_type === 'limited_profile') ? true : false;
        isProfileOut = (profile_type === 'pending_profile_out') ? true : false;
        isProfileIn = (profile_type === 'pending_profile_in') ? true : false;
        let email = ((!_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : ''));
        // let profileType = ''; let userProfileDeeplink = '';
        // let locationDetails = '';
        // let profileTypeValidation = '';
        // if (!_.isEmpty(userData)) {
        //     const profile = userData.profile_type;
        //     isBlocked = profile.substring(0, 7) === 'blocked' ? true : false;
        //     isFriendPending = profile.substring(0, 7) === 'pending' ? true : false;
        //     isFriend = profile === 'friends_profile' ? true : false;
        //     isLimited = profile === 'limited_profile' ? true : false;
        //     isProfileOut = profile === 'pending_profile_out' ? true : false;
        //     isProfileIn = profile === 'pending_profile_in' ? true : false;
        //     email = Buffer.from(userData.email_hash, 'base64').toString('ascii');
        //     profileType = profile.substring(0, 7) === 'limited' ? '' : profile.substring(0, 7);
        //     const locationDetailsCity = (!_.isEmpty(userData.city)) && userData.city !== 'null' ? userData.city : '';
        //     const locationDetailsProvince = (!_.isEmpty(userData.province)) && userData.province !== 'null' ? userData.province : '';
        //     if (locationDetailsCity === '' && locationDetailsProvince !== '') {
        //         locationDetails = locationDetailsProvince;
        //     } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
        //         locationDetails = locationDetailsCity;
        //     } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
        //         locationDetails = `${userData.city}, ${userData.province}`;
        //     }
        //     profileTypeValidation = userData.profile_type.toUpperCase();
        // }
        // if (!_.isEmpty(userProfileProfilelink)) {
        //     userProfileDeeplink = userProfileProfilelink.data.attributes['short-link'];
        // }
        return (
            <Fragment>
                <div className="user_profileImage">
                    <Image src={avatar} />
                </div>
                <div className='user_profileDetails'>
                    <Header className="usrName">{`${first_name} ${last_name}`}</Header>
                    <input
                        ref={(textarea) => this.textArea = textarea}
                        value={userProfileDeeplink}
                        type="hidden"
                        id="txtDeeplinkUser"
                    />
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
                                {first_name}
                                {' '}
                                {last_name}?
                            </Modal.Header>
                            <Modal.Content>
                                <Modal.Description>
                                    They won't be able to find your profile or message you on Charitable Impact. We won't let them know you blocked them.
                                </Modal.Description>
                                <div className="btn-wraper pt-3 text-right">
                                    <Button
                                        className="danger-btn-rounded-def"
                                        onClick={() => this.handleBlockUser(user_id)}
                                        disabled={blockButtonClicked}
                                    >
                                        Block
                                    </Button>
                                    <Button
                                        className="blue-bordr-btn-round-def"
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
                                {first_name}
                                {' '}
                                {last_name}?
                            </Modal.Header>
                            <Modal.Content>
                                <Modal.Description className="font-s-16">
                                    Are you sure you want to unfriend this person?
                                </Modal.Description>
                                <div className="btn-wraper pt-3 text-right">
                                    <Button
                                        className="danger-btn-rounded-def c-small"
                                        onClick={() => this.handleUnfriendUser(user_id)}
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
                    <div className="userCity_friends">
                        <p>{getLocation(city,province)}</p>
                        {((number_of_friends > 0) && (showUserFriends))
                        && (
                                <div
                                    className="userfriends"
                                >
                                    <Header
                                    as='h5'
                                    onClick={hanldeFriendPage}
                                    >
                                        {`${(number_of_friends) && number_of_friends} ${friendText}`}
                                    </Header>
                                    {(isMyProfile && !isPreviewMode)
                                    && (
                                        <ProfilePrivacySettings
                                            columnName='friends_visibility'
                                            columnValue={friends_visibility}
                                            // iconName={currentPrivacyType}
                                        />
                                    )}
                                </div>
                        )}
                    </div>
                    <p className='textAboutuser'>{description}</p>
                    <div className="userButtonsWrap">
                        {(isMyProfile && !isPreviewMode)
                        && (
                            <Fragment>
                                <Button
                                    className='blue-bordr-btn-round-def m-w-100'
                                    onClick={handlePreviewPage}
                                >
                                View what others see
                                </Button>
                                <EditBasicProfile />
                                <Dropdown className='userProfile_drpbtn threeDotBtn' direction='left'>
                                    <Dropdown.Menu >
                                        <Dropdown.Item
                                            text='Copy profile URL'
                                            onClick={this.handleCopyLink}
                                        />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Fragment>
                        )}
                        {isPreviewMode
                        && (
                            <Fragment>
                            <Button
                                className='blue-btn-rounded-def'
                                disabled={true}
                                >
                                    Add Friend
                            </Button>
                            <Button
                                className='blue-bordr-btn-round-def'
                                disabled={true}
                            >
                                Give
                            </Button>
                            <Dropdown 
                                className='userProfile_drpbtn threeDotBtn'
                                direction='left'
                                disabled={true}
                            >
                                    <Dropdown.Menu >
                                        <Dropdown.Item
                                            text='Copy profile URL'
                                            onClick={this.handleCopyLink}
                                        />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Fragment>
                        )}
                        {(!isMyProfile && !isFriendPending && !isFriend && !isBlocked)
                        && (
                                <Button
                                    className="blue-btn-rounded"
                                    onClick={() => this.handleAddToFriends(user_id, email)}
                                    disabled={addButtonClicked}
                                    primary
                                >
                                    Add Friend
                                </Button>
                            )
                        }
                        {
                            isProfileOut && (
                                <Dropdown
                                    className='userProfile_drpbtn'
                                    icon='chevron down'
                                    direction='left'
                                    trigger={(
                                        <Button
                                            className="blue-bordr-btn-round-def"
                                        >
                                            Pending
                                        </Button>
                                    )} 
                                >
                                    <Dropdown.Menu >
                                        <Dropdown.Item
                                            text='Cancel friend request'
                                            onClick={this.handleRejectRequest}
                                        />
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        }
                        {
                            isProfileIn && (
                                <Dropdown 
                                    className='userProfile_drpbtn m-w-100' 
                                    icon='chevron down' 
                                    direction='left'
                                    trigger={(
                                        <Button
                                        className='blue-btn-rounded-def'
                                >
                                    Respond to friend request
                                </Button>
                                )} >
                                    <Dropdown.Menu >
                                        <Dropdown.Item
                                            onClick={() => this.handleAcceptFriend(user_id, email)}
                                            text='Accept'
                                        />
                                        <Dropdown.Item
                                            onClick={this.handleRejectRequest}
                                            text='Ignore'
                                        />
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        }
                        {
                            isFriend && (
                                <Link className="lnkChange" route={`/chats/${user_id}`}>
                                    <Button
                                        className="blue-btn-rounded"
                                        primary
                                    >
                                        Message
                                    </Button>
                                </Link>
                            )
                        }
                        {isBlocked
                        && (
                            <Button
                                    className="grey-btn-rounded-def"
                                    // onClick={() => this.handleAddToFriends(user_id, email)}
                                    disabled={true}
                                >
                                    Block
                                </Button>
                        )}
                        {!isMyProfile
                        && (
                            <Fragment>
                                {!isBlocked
                                && (
                                    <Link className="lnkChange" route="/give/to/friend/new">
                                        <Button
                                            className="blue-bordr-btn-round"
                                            onClick={() => this.giveButtonClick(email, `${first_name} ${last_name}`, avatar)}
                                        >
                                            Give
                                        </Button>
                                </Link>
                                )}
                                <Dropdown className='userProfile_drpbtn threeDotBtn' direction='left'>
                                    <Dropdown.Menu >
                                        <Dropdown.Item
                                            text='Copy profile URL'
                                            onClick={this.handleCopyLink}
                                        />
                                        {isFriend
                                        && (
                                        <Dropdown.Item
                                            text='Unfriend'
                                            onClick={this.handleUnfriendModal}
                                        />
                                        )}
                                        {!isBlocked
                                        && (
                                        <Dropdown.Item
                                            text='Block'
                                            onClick={this.handleBlockModal}
                                        />
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Fragment>
                        )
                        }
                        {/* TODO Buttons logic */}
                    </div>
                </div>
            </Fragment>
        );
    }
}

UserBasicProfile.defaultProps = {
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            avatar: '',
            city: '',
            causes_visibility: null,
            description: '',
            first_name: '',
            last_name: '',
            number_of_friends: null,
            province: '',
            friends_visibility: null,
        },
    },
}

UserBasicProfile.propTypes = {
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            city: string,
            causes_visibility: number,
            description: string,
            first_name: string,
            last_name: string,
            number_of_friends: number,
            province: string,
            friends_visibility: number,
        }),
    }),
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileProfilelink: state.userProfile.userProfileProfilelink,
        previewMode: state.userProfile.previewMode,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(UserBasicProfile));
export {
    connectedComponent as default,
    UserBasicProfile,
    mapStateToProps,
};
