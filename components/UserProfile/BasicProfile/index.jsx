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
} from '../../../actions/userProfile';
import {
    storeEmailIdToGive,
} from '../../../actions/dashboard';

import {
    getLocation,
    getPrivacyType,
} from '../../../helpers/profiles/utils';

import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';

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

    giveButtonClick(email, name) {
        const {
            dispatch,
        } = this.props;
        storeEmailIdToGive(dispatch, email, name);
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

    render() {
        const {
            userFriendProfileData: {
                attributes: {
                    avatar,
                    city,
                    causes_visibility,
                    description,
                    first_name,
                    last_name,
                    number_of_friends,
                    province,
                    profile_type,
                    friends_visibility,
                },
            },
            // userData,
            // userProfileProfilelink,
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
        const isMyProfile = (profile_type === 'my_profile');
        const currentPrivacyType = getPrivacyType(friends_visibility);
        const friendText = (number_of_friends > 1) ? 'friends' : 'friend';
        // const avatar = (typeof userData.avatar === 'undefined') || (userData.avatar === null) ? UserPlaceholder : userData.avatar;
        // const friendsVisibility = (typeof userData.friends_visibility === 'undefined') ? 0 : userData.friends_visibility;
        // let isBlocked = false;
        // let isFriendPending = false;
        // let isFriend = false; let isLimited = false; let isProfileOut = false; let isProfileIn = false;
        // let email = '';
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
                    <div className="userCity_friends">
                        <p>{getLocation(city,province)}</p>
                        {(number_of_friends > 0)
                        && (
                            <div className="userfriends">
                                <Header as='h5'>{`${(number_of_friends) && number_of_friends} ${friendText}`}</Header>
                                {isMyProfile && !_isEmpty(currentPrivacyType)
                                && (
                                    <ProfilePrivacySettings iconName={currentPrivacyType}/>
                                )}
                            </div>
                        )}
                    </div>
                    <p className='textAboutuser'>{description}</p>
                    <div className="userButtonsWrap">
                        {/* TODO Buttons logic */}
                    </div>
                </div>
            </Fragment>
        );
    }
}

UserBasicProfile.defaultProps = {
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
