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
    Dropdown,
    Search,
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
    bool,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import ReactHtmlParser from 'react-html-parser';

import { withTranslation } from '../../../i18n';
import {
    getMyFriendsList,
    getFriendsInvitations,
    searchMyfriend,
    generateDeeplinkSignup,
    inviteFriends,
    searchFriendByUserInput,
    getFriendsByText,
} from '../../../actions/userProfile';
import {
    getLocation,
} from '../../../helpers/profiles/utils';
import findFriendImg from '../../../static/images/find-friends.png';
import friendAvatarPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';

import FriendListCard from './friendListCard';

class UserFriendList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchClicked: false,
            inviteModalStatus: false,
            userEmailId: '',
            inviteButtonClicked: false,
            errorMessage: null,
            signUpDeeplink: '',
            statusMessage: false,
            successMessage: '',
            userEmailId: '',
            userEmailIdsArray:[],
            isValidEmails: true,
            friendSearchText: '',
            showDropdownLoader: false,
            friendDropdownList: [],
        };
        this.showFriendsList = this.showFriendsList.bind(this);
        this.handleOnChangeSearch = this.handleOnChangeSearch.bind(this);
        this.handleSearchFriendList = this.handleSearchFriendList.bind(this);
        this.showInviteModal = this.showInviteModal.bind(this);
        this.hideInviteModal = this.hideInviteModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInviteFriendsClick = this.handleInviteFriendsClick.bind(this);
        this.handleCopyLink = this.handleCopyLink.bind(this);
        this.handleInviteClick = this.handleInviteClick.bind(this);
        this.validateEmailIds = this.validateEmailIds.bind(this);
        this.handleShareClick = this.handleShareClick.bind(this);
        this.handleTypeAheadSearch = this.handleTypeAheadSearch.bind(this);
        this.getFriendDropdownList = this.getFriendDropdownList.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.handleFriendSearch = this.handleFriendSearch.bind(this);
        this.handleResultSelect = this.handleResultSelect.bind(this);
        let timer = null
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
        generateDeeplinkSignup(dispatch, 'signup');
        if (isMyprofile) {
            getFriendsInvitations(dispatch, email, 1);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            userProfileSignUpDeeplink,
            friendTypeAheadData,
            userFindFriendsList,
        } = this.props;
        if (!_.isEqual(userProfileSignUpDeeplink, prevProps.userProfileSignUpDeeplink)) {
            this.setState({
                signUpDeeplink: userProfileSignUpDeeplink.data.attributes['short-link'],
            })
        };
        if (!_.isEqual(friendTypeAheadData, prevProps.friendTypeAheadData)) {
            this.setState({
                // showDropdownLoader: false,
                friendDropdownList: this.getFriendDropdownList(),
            });
        }
        // if (!_.isEqual(userFindFriendsList, prevProps.userFindFriendsList)) {
            
        // }
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

    handleInviteClick() {
        this.setState({
            statusMessage: false,
            userEmailId: '',
            userEmailIdsArray:[],
            isValidEmails: true,
        })
    }

    handleInputChange(event, data) {
        const {
            value,
        } = !_.isEmpty(data) ? data : event.target;
        let {
            userEmailId,
        } = this.state;
        userEmailId = value;
        this.setState({
            userEmailId,
        });
    }

    handleKeyDown = (evt) => {
        let {
            userEmailIdsArray,
            userEmailId,
        } = this.state;
        if (["Enter", "Tab", " ", ","].includes(evt.key)) {
            evt.preventDefault();
            var value = userEmailId.trim();
            let isEmailIdValid = this.isEmail(userEmailId);
            this.setState({ isValidEmails: isEmailIdValid });
            if (value && isEmailIdValid) {
            this.setState({
                userEmailIdsArray: [...userEmailIdsArray, userEmailId],
                userEmailId: "",
            });
            }
        }
    };

    isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    handleDelete = item => {
        this.setState({
          userEmailIdsArray: this.state.userEmailIdsArray.filter(i => i !== item)
        });
    };

    validateEmailIds(emailIds) {        
        let isValidEmail = true;
        // let splitedEmails = emailIds.split(',');
        if(emailIds.length === 0) {
            return false
        }
        for (let i = 0; i < emailIds.length; i++) {
            isValidEmail = /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(emailIds[i]);
            if(!isValidEmail) {
                return false;
            }
        }
        return true;
    }

    handleInviteFriendsClick() {
        this.setState({
            inviteButtonClicked: true,
            statusMessage: false,
        });
        const {
            userEmailId,
            userEmailIdsArray,
        } = this.state;
        let emailIdsArray = userEmailIdsArray;
        if(!_isEmpty(userEmailId)) {
            var value = userEmailId.trim();
            let isEmailIdValid = this.isEmail(userEmailId);
            this.setState({ isValidEmails: isEmailIdValid });
            // if (value && isEmailIdValid) {
                emailIdsArray = [...userEmailIdsArray, userEmailId];               
            // }
        }
        const emailsValid = this.validateEmailIds(emailIdsArray);
        this.setState({ isValidEmails: emailsValid });
        if(emailIdsArray !== null && emailsValid) {
            const {
                dispatch,
            } = this.props;
            let userEmailIdList = emailIdsArray.join();
            inviteFriends(dispatch, userEmailIdList).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'Invite sent.',
                    statusMessage: true,
                    inviteButtonClicked: false,
                    userEmailId: '',
                    userEmailIdsArray:[],
                    inviteModalStatus: false,
                });
            }).catch((err) => {
                this.setState({
                    errorMessage: 'Error in sending invite.',
                    statusMessage: true,
                    inviteButtonClicked: false,
                    userEmailId: '',
                    userEmailIdsArray:[],
                });
            });
        } else {
            this.setState({
                inviteButtonClicked: false,
            });
        }
    }

    handleCopyLink = (e) => {
        this.textArea.select();
        document.execCommand('copy');        
        e.target.focus();
        this.setState({
            errorMessage: null,
            successMessage: 'Copied to clipboard',
            statusMessage: true,
        });
    };

    handleShareClick(type) {
        const {
            signUpDeeplink,
        } = this.state;
        switch (type) {
            case 'twitter':
                // title = encodeURIComponent(`Check out ${name} on @wearecharitable.`);
                window.open(`https://twitter.com/share?url=${signUpDeeplink}`, '_blank');
                break;
            case 'facebook':
                // title = encodeURIComponent(`Give to any canadian ${type}`);
                window.open(`http://www.facebook.com/sharer.php?u=${signUpDeeplink}`, '_blank');
                break;
            default:
                break;
        }
        this.setState({
            inviteModalStatus: false,
        });
    }

    handleTypeAheadSearch(event, data) {
        const {
            currentUser: {
                id: UserId,
            },
            dispatch,
        } = this.props;
        const fsa = {
            payload: {
                data: [],
            },
            type: 'USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH',
        };
        this.setState({
            friendDropdownList: [],
        });
        const queryString = !_isEmpty(event.target.value) ? event.target.value : '';
        this.setState({
            friendSearchText: queryString,
        });
        // if (!_isEmpty(queryString)) {
        //     this.setState({
        //         friendSearchText: queryString,
        //     });
        // }
        if (!_isEmpty(queryString) && queryString.length >= 4) {
            this.setState({
                showDropdownLoader: true,
            });
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
            const self = this;
            this.timeout = setTimeout(function() {
                dispatch(searchFriendByUserInput(queryString, UserId)).then(() => {
                    self.setState({
                        showDropdownLoader: false,
                    });
                })
            }, 300);
        }
    }

    getFriendDropdownList() {
        const {
            friendTypeAheadData,
        } = this.props;
        let resultArr = [];
        if (!_isEmpty(friendTypeAheadData)) {
            friendTypeAheadData.map((friend) => {
                let option = {
                    id: friend.attributes.user_id,
                    // key: `${friend.attributes.first_name} ${friend.attributes.last_name}`,
                    title: `${friend.attributes.first_name} ${friend.attributes.last_name}`,
                    // value: `${friend.attributes.first_name} ${friend.attributes.last_name}`,
                    image: {
                        className: 'avatarImage',
                        avatar: true,
                        src: ((!_isEmpty(friend.attributes.avatar))
                            ? friend.attributes.avatar
                            : friendAvatarPlaceholder),
                    }
                };
                // option.text = ReactHtmlParser(
                //     <span
                //         className='menuItem'
                //     >
                //         <Image
                //             avatar
                            // src={!_isEmpty(friend.attributes.avatar)
                            //     ? avatar
                            //     : friendAvatarPlaceholder}
                //         />
                //         {`${friend.attributes.first_name} ${friend.attributes.last_name}`}
                //     </span>
                // );
                resultArr.push(option);
            })
        }
        return resultArr;
    }

    //friendSearchText
    clearSearch() {
        const {
            dispatch,
        } = this.props;
        this.setState({
            friendSearchText: '',
        });
        const fsa = {
            payload: {
                data: [],
            },
            type: 'USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH',
        };
        dispatch(fsa);
    }

    handleFriendSearch() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const {
            friendSearchText,
        } = this.state;
        // this.setState({ currentActivePage: 1 });
        getFriendsByText(dispatch, id, friendSearchText, 1);
    }

    handleResultSelect(event, data) {
        const {
            dispatch,
            friendTypeAheadData,
        } = this.props;
        const selectedUser = [];
        this.setState({
            friendSearchText: data.result.title,
        });
        selectedUser.push(friendTypeAheadData[_findIndex(friendTypeAheadData, (friend) => friend.attributes.user_id === data.result.id)]);
        const fsa = {
            payload: {
                count: 1,
                data: selectedUser,
            },
            type: 'USER_PROFILE_FIND_FRIENDS',
        }
        dispatch(fsa);
    }

    render() {
        const {
            friendTypeAheadData,
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
            userFindFriendsList: {
                count,
                data: userFriendList,
            },
            isMyFriendsPage,
        } = this.props;
        const {
            searchText,
            searchClicked,
            inviteModalStatus,
            inviteButtonClicked,
            errorMessage,
            signUpDeeplink,
            statusMessage,
            successMessage,
            userEmailId,
            isValidEmails,
            userEmailIdsArray,
            friendSearchText,
            showDropdownLoader,
            friendDropdownList,
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
                            
                            <div className='findFriendsSearch'>
                                
                                <Search
                                    fluid
                                    placeholder="Find friends already on Charitable Impact"
                                    {...(showDropdownLoader ? ({loading: true}) : undefined)}
                                    // onResultSelect={(e, data) =>
                                    //     dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
                                    // }
                                    onResultSelect={this.handleResultSelect}
                                    onSearchChange={this.handleTypeAheadSearch}
                                    results={friendDropdownList}
                                    value={friendSearchText}
                                    icon={
                                    <Fragment>
                                        <Icon
                                            className='delete'
                                            onClick={this.clearSearch}
                                        />
                                        <Icon
                                            className='search'
                                            onClick={this.handleFriendSearch}
                                            />
                                    </Fragment>
                                    }
                                />
                            </div>
                            {!_isEmpty(userFriendList)
                            ? (
                                <div className='searchresultwrp'>
                                    {!_isEmpty(friendSearchText)
                                    && (
                                        <Fragment>
                                            <Header>{friendSearchText}</Header>
                                            <p>{`${count} results`}</p>
                                        </Fragment>
                                    )}
                                    <List divided verticalAlign="middle" className="users_List">
                                        {this.showFriendsList(userFriendList, 'friends', isMyProfile)}
                                    </List>
                                </div>
                            )
                        : (
                            <div className="findFriendsWrap">
                                <Image src={findFriendImg} />
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
                                            <label>
                                                Enter as many email addresses as you like, separated by a comma:
                                            </label>
                                            <div className='fieldWrap'>
                                                <div className='label-input-wrap'>
                                                    <div className="email-labels">
                                                        {!_isEmpty(userEmailIdsArray)
                                                        && (
                                                            userEmailIdsArray.map((email) => (
                                                                <label className="label">{email}
                                                                <Icon
                                                                    className='delete'
                                                                    onClick={() => this.handleDelete(email)}
                                                                />
                                                            </label>
                                                            ))
                                                        )}
                                                    </div>
                                                    <Form.Input
                                                        placeholder="Email Address"
                                                        error={!isValidEmails}
                                                        id="userEmailId"
                                                        name="userEmailId"
                                                        onKeyDown={this.handleKeyDown}
                                                        onChange={this.handleInputChange}
                                                        ref={(ip) => this.myInp = ip}
                                                        value={userEmailId}
                                                    />
                                                </div>
                                                <Button
                                                className="blue-btn-rounded-def"
                                                onClick={this.handleInviteFriendsClick}
                                                disabled={inviteButtonClicked}
                                                >
                                                    Invite
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="inviteField copylink">
                                            <label>Or share a link:</label>
                                            <div className="fieldWrap">
                                                <div className="label-input-wrap">
                                                    <Form.Field>
                                                        <input
                                                        value={signUpDeeplink}
                                                        ref={(textarea) => this.textArea = textarea}
                                                    />
                                                    </Form.Field>
                                                </div>
                                                <Button
                                                className="blue-bordr-btn-round-def"
                                                onClick={this.handleCopyLink}
                                                >
                                                    Copy link
                                                </Button>
                                            </div>
                                        </div>
                
                                        <div className="socailLinks">
                                            <a>
                                                <Icon
                                                className="twitter"
                                                onClick={() => this.handleShareClick('twitter')}
                                                />
                                            </a>
                                            <a>
                                                <Icon
                                                className="facebook"
                                                onClick={() => this.handleShareClick('facebook')}
                                                />
                                            </a>
                                        </div>
                                    
                                    </Modal.Content>
                                </Modal>
                            </div>
                        )}
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
                                        {(!_isEmpty(getLocation(city, province)))
                                        && (
                                            <p>{getLocation(city, province)}</p>
                                        )}
                                        
                                        <div className="userfriends">
                                            <Header as='h5'>{number_of_friends} friends</Header>
                                        </div>
                                    </div>
                                    {!isMyFriendsPage
                                    && (
                                        <div className="userButtonsWrap">
                                            <Button
                                                className='blue-bordr-btn-round-def'
                                                onClick={hideFriendPage}
                                            >
                                                Return to profile
                                            </Button>
                                        </div>
                                    )}
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
    friendTypeAheadData: [],
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
    userFindFriendsList: {
        count: null,
        data: [],
    },
    isMyFriendsPage: false,
};

UserFriendList.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    dispatch: func,
    friendTypeAheadData: array,
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
    userFindFriendsList: PropTypes.shape({
        count: number,
        data: array,
    }),
    isMyFriendsPage: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userFriendsInvitationsList: state.userProfile.userFriendsInvitationsList,
        userMyFriendsList: state.userProfile.userMyFriendsList,
        userProfileSignUpDeeplink: state.userProfile.userProfileSignUpDeeplink,
        friendTypeAheadData: state.userProfile.friendTypeAheadData,
        userFindFriendsList: state.userProfile.userFindFriendsList,
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
