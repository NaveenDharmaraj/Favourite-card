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
    Tab,
    Modal,
    Form,
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
    getMyFriendsList,
    getFriendsInvitations,
    searchMyfriend,
} from '../../../actions/userProfile';
import {
    getLocation,
} from '../../../helpers/profiles/utils';

import FriendListCard from './friendListCard';

class UserFriendList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchClicked: false,
            inviteModalStatus: false,
        };
        this.showFriendsList = this.showFriendsList.bind(this);
        this.handleOnChangeSearch = this.handleOnChangeSearch.bind(this);
        this.handleSearchFriendList = this.handleSearchFriendList.bind(this);
        this.showInviteModal = this.showInviteModal.bind(this);
        this.hideInviteModal = this.hideInviteModal.bind(this);
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
        getMyFriendsList(dispatch, email, 1);
        if (isMyprofile) {
            getFriendsInvitations(dispatch, email, 1);
        }
    }

    showFriendsList(dataArray, type, isMyProfile) {
        const {
            hideFriendPage,
        } = this.props;
        const friendListArray = [];
        dataArray.map((data) => {
            friendListArray.push(
                <FriendListCard
                    data={data.attributes}
                    type={type}
                    hideFriendPage={hideFriendPage}
                    isMyProfile={isMyProfile}
                />,
            );
        });
        return friendListArray;
    }

    handleOnChangeSearch(event, data) {
        this.setState({
            searchText: data.value,
        });
    }

    handleSearchFriendList() {
        const {
            dispatch,
            currentUser: {
                id: UserId,
            },
            userFriendProfileData: {
                attributes: {
                    email_hash,
                },
            },
        } = this.props;
        const {
            searchText,
        } = this.state;
        const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        if (!_isEmpty(searchText)) {
            searchMyfriend(dispatch, UserId, searchText);
        } else {
            getMyFriendsList(dispatch, email, 1);
        }
        // this.setState({
        //     searchText: '',
        // });
        this.setState({
            searchClicked: true,
        });
    }

    showInviteModal() {
        this.setState({
            inviteModalStatus: true,
        });
    }

    hideInviteModal() {
        this.setState({
            inviteModalStatus: false,
        });
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
        const {
            searchText,
            searchClicked,
            inviteModalStatus,
        } = this.state;
        const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        const isMyProfile = (profile_type === 'my_profile');
        const headerText = isMyProfile ? 'Your friends' : (`${display_name}'s friends`);
        let panes = [
            {
                menuItem: 'Your friends',
                render: () => (
                    <Tab.Pane>
                        {(isMyProfile && !_isEmpty(invitationData))
                        && (
                            <div className="invitationsWrap">
                                <Header as="h4">Invitations</Header>
                                <List divided verticalAlign="middle" className="users_List">
                                    {this.showFriendsList(invitationData, 'invitation', isMyProfile)}
                                </List>
                            </div>
                        )}
                        <div className="friendsSearch">
                            <Header as="h4">Friends</Header>
                            <div className="searchBox">
                                <Input
                                    className="searchInput"
                                    placeholder="Search friends"
                                    fluid
                                    onChange={this.handleOnChangeSearch}
                                    value={searchText}
                                />
                                <a
                                    className="search-btn"
                                    onClick={this.handleSearchFriendList}
                                >
                                </a>
                            </div>
                        </div>
                        <List divided verticalAlign="middle" className="users_List">
                            {(!_isEmpty(friendData))
                            && (
                                this.showFriendsList(friendData, 'friends', isMyProfile)
                            )
                            }
                            {(_isEmpty(friendData) && searchClicked)
                            && (
                                <p>
                                    Sorry, there are no friends by that name.
                                </p>
                            )}
                        </List>
                    </Tab.Pane>
                ),
            },
        ];

        if (isMyProfile) {
            panes = [
                ...panes,
                {
                    menuItem: 'Find friends',
                    render: () => (
                        <Tab.Pane>
                            <div className='findFriendsWrap'>
                                <Image src="../static/images/find-friends.png" />
                                <Header>Find friends, send them charitable dollars, and give together.</Header>
                                <p className='invite_text_1'>You can find friends by name, and they can search for your personal profile too. You can also invite friends not yet on Charitable Impact.</p>
                                <p className='invite_text_2'>Your discoverability can be changed in Account Settings.</p>
                                <Button className='blue-btn-rounded-def' onClick={this.showInviteModal}>
                                    Invite friends
                                </Button>
                                <Modal
                                    size="tiny"
                                    dimmer="inverted"
                                    closeIcon
                                    className="chimp-modal inviteModal"
                                    open={inviteModalStatus}
                                    onClose={this.hideInviteModal}
                                >
                                    <Modal.Header>Invite friends to join you on Charitable Impact</Modal.Header>
                                    <Modal.Content>
                                    
                                        <div className='inviteField'>
                                            <label>Enter as many email addresses as you like, separated by a comma:</label>
                                            <div className='fieldWrap'>
                                                <div className='label-input-wrap'>
                                                    <div className="email-labels">
                                                        {/* <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label>
                                                        <label className="label">abc@jkl.xyz <Icon className='delete'></Icon></label> */}
                                                    </div>
                                                    <Form.Input/> 
                                                </div>
                                                <Button className='blue-btn-rounded-def'>Invite</Button>
                                            </div>
                                        </div>
                                        <div className='inviteField copylink'>
                                            <label>Or share a link:</label>
                                            <div className='fieldWrap'>
                                                <div className='label-input-wrap'>
                                                    <Form.Input value='https://charitableimpact.com/share-this-awesome-link'/> 
                                                </div>
                                                <Button className='blue-bordr-btn-round-def'>Copy link</Button>
                                            </div>
                                        </div>
                
                                        <div className='socailLinks'>
                                            <a>
                                                <Icon className='twitter'/>
                                            </a>
                                            <a>
                                                <Icon className='facebook'/>
                                            </a>
                                        </div>
                                    
                                </Modal.Content>
                            </Modal>
                            </div>
                        </Tab.Pane>
                    ),
                },
            ];
        }

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
                                    <div className="userfriendsWrap">
                                        {isMyProfile
                                            ? (
                                                <Tab
                                                    className="userprfleTab userfriendtab"
                                                    menu={{
                                                        secondary: true,
                                                        pointing: true,
                                                    }}
                                                    panes={panes}
                                                />
                                            )
                                            : (
                                                <Fragment>
                                                    <div className="friendsSearch">
                                                        <Header as="h4">Friends</Header>
                                                        <div className="searchBox">
                                                            <Input
                                                                className="searchInput"
                                                                placeholder="Search friends"
                                                                fluid
                                                                onChange={this.handleOnChangeSearch}
                                                                value={searchText}
                                                            />
                                                            <a
                                                                className="search-btn"
                                                                onClick={this.handleSearchFriendList}
                                                            >
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <List divided verticalAlign="middle" className="users_List">
                                                        {(!_isEmpty(friendData))
                                                        && (
                                                            this.showFriendsList(friendData, 'friends', isMyProfile)
                                                        )
                                                        }
                                                        {(_isEmpty(friendData) && searchClicked)
                                                        && (
                                                            <p>
                                                                Sorry, there are no friends by that name.
                                                            </p>
                                                        )}
                                                    </List>
                                                </Fragment>
                                            )}
                                        
                                    </div>
                                    {/* <div className='userfriendsWrap'>
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
                                        <div className="friendsSearch">
                                            <Header as="h4">Friends</Header>
                                            <div className="searchBox">
                                                <Input
                                                    className="searchInput"
                                                    placeholder="Search friends"
                                                    fluid
                                                    onChange={this.handleOnChangeSearch}
                                                    value={searchText}
                                                />
                                                <a
                                                    className="search-btn"
                                                    onClick={this.handleSearchFriendList}
                                                >
                                                </a>
                                            </div>
                                        </div>
                                        <List divided verticalAlign="middle" className="users_List">
                                            {(!_isEmpty(friendData))
                                            && (
                                                this.showFriendsList(friendData, 'friends')
                                            )
                                            }
                                            {(_isEmpty(friendData) && searchClicked)
                                            && (
                                                <p>
                                                    Sorry, there are no friends by that name.
                                                </p>
                                            )}
                                        </List>
                                    </div> */}
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
