/* eslint-disable camelcase */
import React, {
    Fragment,
} from 'react';
import {
    Container,
    Header,
    Image,
    Icon,
    List,
    Button,
    Input,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    array,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';
import {
    acceptFriendRequest,
    getMyFriendsList,
    getFriendsInvitations,
} from '../../../actions/userProfile';
import {
    getLocation,
} from '../../../helpers/profiles/utils';

import FriendListCard from './friendListCard';

class UserFriendList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.showFriendsList = this.showFriendsList.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id: UserId,
            },
            dispatch,
            userFriendProfileData: {
                attributes: {
                    email_hash,
                    user_id,
                },
            },
        } = this.props;
        const isMyprofile = user_id === Number(UserId);
        const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        debugger;
        getMyFriendsList(dispatch, email, 1);
        if (isMyprofile) {
            getFriendsInvitations(dispatch, email, 1);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    showFriendsList(dataArray, type) {
        const friendListArray = [];
        dataArray.map((data) => {
            friendListArray.push(
                <FriendListCard
                    data={data.attributes}
                    type={type}
                />,
            );
        });
        return friendListArray;
    }

    render() {
        const {
            hideFriendPage,
            userFriendProfileData: {
                attributes: {
                    avatar,
                    display_name,
                    first_name,
                    last_name,
                    number_of_friends,
                    profile_type,
                    city,
                    province,
                    email_hash,
                },
            },
            userFriendsInvitationsList: {
                data: invitationData,
            },
            userMyFriendsList: {
                data: friendData,
            },
        } = this.props;
        const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        const isMyProfile = (profile_type === 'my_profile');
        const headerText = isMyProfile ? 'Your friends' : (`${display_name}'s friends`);
        return (
            <Container>
                <div className="userProfileScreen">
                    <div className="userHeaderBanner" />
                    <div className="usercontentsecWrap">
                        <div className="userleftColumn">
                            <div className="userdetailsWrap">
                                <div className="user_profileImage">
                                    <Image src={avatar} />
                                </div>
                                <div className="user_profileDetails">
                                    <Header className="usrName">{`${first_name} ${last_name}`}</Header>
                                    <div className="userCity_friends">
                                        <p>{getLocation(city, province)}</p>
                                        <div className="userfriends">
                                            <Header as='h5'>{number_of_friends} friends</Header>
                                        </div>
                                    </div>
                                    <div className="userButtonsWrap">
                                        <Button
                                            className='blue-bordr-btn-round-def'
                                            onClick={hideFriendPage}
                                        >
                                            Return to profile
                                        </Button>
                                    </div>
                                    <div className='userfriendsWrap'>
                                        <Header as='h3'>{headerText}</Header>
                                        {(isMyProfile && !_isEmpty(invitationData))
                                        && (
                                            <div className='invitationsWrap'>
                                                <Header as='h4'>Invitations</Header>
                                                <List divided verticalAlign="middle" className="users_List">
                                                    {this.showFriendsList(invitationData, 'invitation')}
                                                </List>
                                            </div>
                                        )}
                                        {!_isEmpty(friendData)
                                        && (
                                            <Fragment>
                                                <div className="friendsSearch">
                                                    <Header as="h4">Friends</Header>
                                                    <div className="searchBox">
                                                        <Input
                                                            className="searchInput"
                                                            placeholder="Search topics"
                                                            fluid
                                                        />
                                                        <a
                                                            className="search-btn"
                                                        >
                                                        </a>
                                                    </div>
                                                </div>
                                                <List divided verticalAlign="middle" className="users_List">
                                                    {this.showFriendsList(friendData, 'friends')}
                                                </List>
                                            </Fragment>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

UserFriendList.defaultProps = {
    currentUser: {
        id: '',
    },
    dispatch: () => {},
    hideFriendPage: () => {},
    userFriendProfileData: {
        attributes: {
            avatar: '',
            city: '',
            display_name: '',
            email_hash: '',
            first_name: '',
            last_name: '',
            number_of_friends: null,
            profile_type: '',
            province: '',
            user_id: '',
        },
    },
    userFriendsInvitationsList: {
        data: [],
    },
    userMyFriendsList: {
        data: [],
    },
};

UserFriendList.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    dispatch: func,
    hideFriendPage: () => {},
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            city: string,
            display_name: string,
            email_hash: string,
            first_name: string,
            last_name: string,
            number_of_friends: number,
            profile_type: string,
            province: string,
            user_id: string,
        }),
    }),
    userFriendsInvitationsList: PropTypes.shape({
        data: array,
    }),
    userMyFriendsList: PropTypes.shape({
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userFriendsInvitationsList: state.userProfile.userFriendsInvitationsList,
        userMyFriendsList: state.userProfile.userMyFriendsList,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(UserFriendList));
export {
    connectedComponent as default,
    UserFriendList,
    mapStateToProps,
};
