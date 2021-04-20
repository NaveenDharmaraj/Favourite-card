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
    Search,
    Loader,
} from 'semantic-ui-react';
import { Router } from '../../../routes';
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
import _isEqual from 'lodash/isEqual';
import dynamic from 'next/dynamic';

import { withTranslation } from '../../../i18n';
import {
    getMyFriendsList,
    getFriendsInvitations,
    searchMyfriend,
    generateDeeplinkSignup,
    searchFriendByUserInput,
    getFriendsByText,
    clearFindFriendsList,
    actionTypes,
} from '../../../actions/userProfile';
import Pagination from '../../shared/Pagination';
import {
    getLocation,
} from '../../../helpers/profiles/utils';
import friendAvatarPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';

import FriendListCard from './friendListCard';

const FindFriends = dynamic(() => import('./findFriends'));

class UserFriendList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentActivePage: 1,
            currentFindFriendsActivePage: 1,
            searchText: '',
            searchClicked: false,
            showSearchResultDropdown: false,
            friendSearchText: '',
            showDropdownLoader: false,
            friendDropdownList: [],
            scrollbarFixHeight: '',
        };
        this.showFriendsList = this.showFriendsList.bind(this);
        this.handleOnChangeSearch = this.handleOnChangeSearch.bind(this);
        this.handleSearchFriendList = this.handleSearchFriendList.bind(this);
        this.handleTypeAheadSearch = this.handleTypeAheadSearch.bind(this);
        this.getFriendDropdownList = this.getFriendDropdownList.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.handleFriendSearch = this.handleFriendSearch.bind(this);
        this.handleResultSelect = this.handleResultSelect.bind(this);
        this.onPageChanged = this.onPageChanged.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: userId,
            },
            dispatch,
            userFriendProfileData: {
                attributes: {
                    email_hash,
                },
            },
            updatedFriendId,
        } = this.props;
        const isMyprofile = Number(updatedFriendId) === Number(userId);
        const currentEmail = isMyprofile ? email : !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        dispatch(getMyFriendsList(currentEmail, 1, isMyprofile ? null : userId));
        dispatch(generateDeeplinkSignup('signup'));
        if (isMyprofile) {
            dispatch(getFriendsInvitations(email, 1));
        }
          
    }

    componentDidUpdate(prevProps) {
        const {
            friendTypeAheadData,
            userFriendProfileData,
        } = this.props;
        if (!_isEqual(userFriendProfileData, prevProps.userFriendProfileData)) {
            const {
                currentUser: {
                    attributes: {
                        email,
                    },
                    id: userId,
                },
                dispatch,
                userFriendProfileData: {
                    attributes: {
                        email_hash,
                    },
                },
                updatedFriendId,
            } = this.props;
            const isMyprofile = Number(updatedFriendId) === Number(userId);
            const currentEmail = isMyprofile ? email : !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
            dispatch(getMyFriendsList(currentEmail, 1, isMyprofile ? null : userId));
        };
        if (!_isEmpty(friendTypeAheadData) && !_isEqual(friendTypeAheadData, prevProps.friendTypeAheadData)) {
            this.setState({
                friendDropdownList: this.getFriendDropdownList(),
            });
        }
    }

    componentWillUnmount() {
        const {
            dispatch
        } = this.props;
        this.clearSearch();
        dispatch({
            type: actionTypes.USER_PROFILE_BASIC_FRIEND,
            payload: {}
        })
        dispatch({
            payload: {
            },
            type: 'USER_PROFILE_RESET_DATA',
        });
    }

    showFriendsList(dataArray, type, isMyProfile) {
        const friendListArray = [];
        dataArray.map((data) => {
            friendListArray.push(
                <FriendListCard
                    data={data.attributes}
                    type={type}
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
                id: userId,
            },
            userFriendProfileData: {
                attributes: {
                    email_hash,
                    user_id,
                },
            },
        } = this.props;
        const {
            searchText,
        } = this.state;
        const isMyprofile = user_id === Number(userId);
        const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        if (!_isEmpty(searchText)) {
            dispatch(searchMyfriend(user_id, searchText));
        } else {
            dispatch(getMyFriendsList(email, 1, isMyprofile ? null : userId));
        }
        this.setState({
            searchClicked: true,
        });
    }

    handleTypeAheadSearch(event, data) {
        const {
            currentUser: {
                id: userId,
            },
            dispatch,
        } = this.props;
        const fsa = {
            payload: {
                data: [],
            },
            type: 'USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH',
        };
        dispatch(fsa);
        dispatch(clearFindFriendsList());
        this.setState({
            friendDropdownList: [],
            showSearchResultDropdown: false,
        });
        const queryString = !_isEmpty(event.target.value) ? event.target.value : '';
        this.setState({
            friendSearchText: queryString,
        });
        if (!_isEmpty(queryString) && queryString.length >= 4) {
            this.setState({
                showDropdownLoader: true,
            });
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
            const self = this;
            this.timeout = setTimeout(function () {
                dispatch(searchFriendByUserInput(queryString, userId)).then(() => {
                    self.setState({
                        showDropdownLoader: false,
                        showSearchResultDropdown: true,
                    });

                    let resultsHeight = document.querySelector('.overflowScrollbarFx .results').clientHeight;
                    self.setState({
                        scrollbarFixHeight: resultsHeight + 78,
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
                    title: `${friend.attributes.first_name} ${friend.attributes.last_name}`,
                    image: {
                        className: 'avatarImage',
                        avatar: true,
                        src: ((!_isEmpty(friend.attributes.avatar))
                            ? friend.attributes.avatar
                            : friendAvatarPlaceholder),
                    }
                };
                resultArr.push(option);
            })
        }
        return resultArr;
    }

    clearSearch() {
        const {
            dispatch,
        } = this.props;
        this.setState({
            searchText: '',
            friendSearchText: '',
            showSearchResultDropdown: false,
        });
        const fsa = {
            payload: {
                data: [],
            },
            type: 'USER_PROFILE_FRIEND_TYPE_AHEAD_SEARCH',
        };
        dispatch(clearFindFriendsList());
        dispatch(fsa);
        dispatch({
            type: actionTypes.USER_PROFILE_MY_FRIENDS,
            payload: {},
        })
    }
    clearMyfriends = () => {
        this.setState({
            searchText: '',
        });
        const {
            currentUser: {
                id: userId,
            },
            dispatch,
            userFriendProfileData: {
                attributes: {
                    email_hash,
                    user_id,
                },
            },
        } = this.props;
        const isMyprofile = user_id === Number(userId);
        const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        dispatch(getMyFriendsList(email, 1, isMyprofile ? null : userId));
    }
    handleFriendSearch = () => {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const {
            friendSearchText,
        } = this.state;
        (friendSearchText && friendSearchText.length > 3) && dispatch(getFriendsByText(id, friendSearchText, 1));
        this.setState({
            showSearchResultDropdown: false,
        });
    }

    handleResultSelect(event, data) {
        Router.pushRoute(`/users/profile/${data.result.id}`)
    }

    onPageChanged(event, data) {
        const {
            dispatch,
            currentUser: {
                id: userId,
            },
            userFriendProfileData: {
                attributes: {
                    email_hash,
                    user_id,
                },
            },
        } = this.props;
        const isMyprofile = user_id === Number(userId);
        const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        dispatch(getMyFriendsList(email, data.activePage, isMyprofile ? null : userId));
        this.setState({
            currentActivePage: data.activePage,
        });
    }
    onFindFriendsPageChanged = (event, data) => {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const {
            friendSearchText,
        } = this.state;
        (friendSearchText && friendSearchText.length > 3) && dispatch(getFriendsByText(id, friendSearchText, data.activePage));
        this.setState({
            currentFindFriendsActivePage: data.activePage,
        });
    }
    onTabChange = (e, data) => {
        (data && data.activeIndex != 1) && this.clearSearch();
        if (data.activeIndex === 0) {
            const {
                currentUser: {
                    id: userId,
                },
                dispatch,
                userFriendProfileData: {
                    attributes: {
                        email_hash,
                        user_id,
                    },
                },
            } = this.props;
            const isMyprofile = user_id === Number(userId);
            const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
            dispatch(getMyFriendsList(email, 1, isMyprofile ? null : userId));
        }
        data.activeIndex === 0 ? Router.pushRoute('/user/profile/friends/myFriends') :
            Router.pushRoute('/user/profile/friends/findFriends');

    }
    renderProfilePage = () => {
        const {
            currentUser: {
                id,
            },
            userFriendProfileData: {
                attributes: {
                    user_id,
                },
            },
        } = this.props;
        id == user_id ? Router.pushRoute('/user/profile/basic') : Router.pushRoute(`/users/profile/${user_id}`);
    }
    render() {
        const {
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
                pageCount: friendDataPageCount,
            },
            userFindFriendsList: {
                count,
                data: userFriendList,
                pageCount: findFriendDataPageCount,
            },
            userProfileFindFriendsLoader,
            userMyFriendsListLoader,
            isMyFriendsPage,
        } = this.props;
        const {
            currentActivePage,
            currentFindFriendsActivePage,
            searchText,
            searchClicked,
            friendSearchText,
            showDropdownLoader,
            showSearchResultDropdown,
            friendDropdownList,
            scrollbarFixHeight
        } = this.state;
        const friendText = (number_of_friends == 1) ? 'friend' : 'friends';
        const activeIndex = this.props.friendPageStep === 'findFriends' ? 1 : 0;
        // const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        const isMyProfile = (profile_type === 'my_profile');
        // const headerText = isMyProfile ? 'Your friends' : (`${display_name}'s friends`);

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
                        <>
                            {!userMyFriendsListLoader &&
                                <Fragment>
                                    {(isMyProfile && _isEmpty(invitationData) && _isEmpty(friendData) && !searchClicked) ?
                                        <>
                                            <Header as="h4">Friends</Header>
                                            <div className="findFriendswrapper">
                                                <FindFriends
                                                    dispatch={this.props.dispatch}
                                                    showFindFriendsLink={true}
                                                />
                                            </div>
                                        </>
                                        :
                                        <div className="friendsSearch">
                                            <Header as="h4">Friends</Header>
                                            <div className="searchBox">
                                                <Input
                                                    className="searchInput"
                                                    placeholder="Search friends"
                                                    fluid
                                                    onChange={this.handleOnChangeSearch}
                                                    value={searchText}
                                                    onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleSearchFriendList() : null; }}
                                                />
                                                {searchText.length >= 1 && <Icon name='close' onClick={() => this.clearMyfriends()} />}
                                                <a
                                                    className="search-btn"
                                                    onClick={this.handleSearchFriendList}
                                                >
                                                </a>
                                            </div>
                                        </div>
                                    }
                                </Fragment>
                            }
                        </>
                        <List divided verticalAlign="middle" className="users_List">
                            {userMyFriendsListLoader ?
                                (
                                    <div className="myfriends-loader-wrapper">
                                        <Loader active />
                                    </div>
                                )
                                : !_isEmpty(friendData) ?
                                    this.showFriendsList(friendData, 'friends', isMyProfile)
                                    :
                                    (_isEmpty(friendData) && searchClicked)
                                    && (
                                        <p className='noData'>
                                            Sorry, there are no friends by that name.
                                        </p>
                                    )
                            }
                        </List>
                        {(!_isEmpty(friendData) && friendDataPageCount > 1) &&
                            <div className="paginationWraper">
                                <div className="db-pagination right-align pt-2">
                                    <Pagination
                                        activePage={currentActivePage}
                                        totalPages={friendDataPageCount}
                                        onPageChanged={this.onPageChanged}
                                    />
                                </div>
                            </div>
                        }
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
                                <div className={(showSearchResultDropdown) ? 'overflowScrollbarFx' : ''} style={(showSearchResultDropdown) ? { height: scrollbarFixHeight } : {}}>
                                    <Search
                                        open={showSearchResultDropdown}
                                        fluid
                                        placeholder="Find friends on Charitable Impact"
                                        {...(showDropdownLoader ? ({ loading: true }) : undefined)}
                                        onResultSelect={this.handleResultSelect}
                                        onSearchChange={this.handleTypeAheadSearch}
                                        onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleFriendSearch() : null; }}
                                        results={friendDropdownList}
                                        value={friendSearchText}
                                        minCharacters={4}
                                        showNoResults={showDropdownLoader ? false : true}
                                        icon={
                                            <Fragment>
                                                {friendSearchText && <Icon
                                                    className='delete'
                                                    onClick={this.clearSearch}
                                                />
                                                }
                                                <Icon
                                                    className='search'
                                                    onClick={this.handleFriendSearch}
                                                />
                                            </Fragment>
                                        }
                                    />
                                </div>
                            </div>
                            <div className="findFriendswrapper">
                                {userProfileFindFriendsLoader ?
                                    <Loader active />
                                    :
                                    !_isEmpty(userFriendList)
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
                                                {(!_isEmpty(userFriendList) && findFriendDataPageCount > 1) &&
                                                    <div className="paginationWraper">
                                                        <div className="db-pagination right-align pt-2">
                                                            <Pagination
                                                                activePage={currentFindFriendsActivePage}
                                                                totalPages={findFriendDataPageCount}
                                                                onPageChanged={this.onFindFriendsPageChanged}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        )
                                        : (
                                            <FindFriends
                                                showFindFriendsLink={false}
                                                dispatch={this.props.dispatch}
                                            />
                                        )}
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
                                    <Header className="usrName">{`${display_name}`}</Header>
                                    <div className="userCity_friends">
                                        {(!_isEmpty(getLocation(city, province)))
                                            && (
                                                <p>{getLocation(city, province)}</p>
                                            )}

                                        <div className="userfriends">
                                            <Header as='h5'><span>{number_of_friends} {friendText}</span></Header>
                                        </div>
                                    </div>
                                    {!isMyFriendsPage
                                        && (
                                            <div className="userButtonsWrap">
                                                <Button
                                                    className='blue-bordr-btn-round-def'
                                                    onClick={this.renderProfilePage}
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
                                                    onTabChange={this.onTabChange}
                                                    activeIndex={activeIndex}
                                                />
                                            )
                                            : (
                                                <Fragment>
                                                    <Header as='h3'>{`${first_name}`}'s friends</Header>
                                                    {!userMyFriendsListLoader &&
                                                        <Fragment>
                                                            {_isEmpty(friendData) ?
                                                                (
                                                                    <>
                                                                        <Header as="h4">Friends</Header>
                                                                        <div className="nodata-friendsprfl">
                                                                            {first_name} {last_name} has not added friends on Charitable Impact yet.
                                                                </div>
                                                                    </>
                                                                )
                                                                :
                                                                <div className="friendsSearch">
                                                                    <Header as="h4">Friends</Header>
                                                                    <div className="searchBox">
                                                                        <Input
                                                                            className="searchInput"
                                                                            placeholder="Search friends"
                                                                            fluid
                                                                            onChange={this.handleOnChangeSearch}
                                                                            value={searchText}
                                                                            onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleSearchFriendList() : null; }}
                                                                        />
                                                                        {searchText.length >= 1 && <Icon name='close' onClick={() => this.clearMyfriends()} />}
                                                                        <a
                                                                            className="search-btn"
                                                                            onClick={this.handleSearchFriendList}
                                                                        >
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </Fragment>
                                                    }
                                                    <List divided verticalAlign="middle" className="users_List">
                                                        {userMyFriendsListLoader ?
                                                            (
                                                                <div className="myfriends-loader-wrapper">
                                                                    <Loader active />
                                                                </div>
                                                            )
                                                            : !_isEmpty(friendData) ?
                                                                this.showFriendsList(friendData, 'friends', isMyProfile)
                                                                :
                                                                (_isEmpty(friendData) && searchClicked)
                                                                && (
                                                                    <p className='noData'>
                                                                        Sorry, there are no friends by that name.
                                                                    </p>
                                                                )
                                                        }
                                                        {(!_isEmpty(friendData) && friendDataPageCount > 1) &&
                                                            <div className="paginationWraper">
                                                                <div className="db-pagination right-align pt-2">
                                                                    <Pagination
                                                                        activePage={currentActivePage}
                                                                        totalPages={friendDataPageCount}
                                                                        onPageChanged={this.onPageChanged}
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
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
    dispatch: () => { },
    friendTypeAheadData: [],
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
    userProfileFindFriendsLoader: false,
    isMyFriendsPage: false,
};

UserFriendList.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    dispatch: func,
    friendTypeAheadData: array,
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
    userProfileFindFriendsLoader: bool,
    isMyFriendsPage: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userFriendsInvitationsList: state.userProfile.userFriendsInvitationsList,
        userMyFriendsList: state.userProfile.userMyFriendsList,
        friendTypeAheadData: state.userProfile.friendTypeAheadData,
        userFindFriendsList: state.userProfile.userFindFriendsList,
        userMyFriendsListLoader: state.userProfile.userMyFriendsListLoader,
        userProfileFindFriendsLoader: state.userProfile.userProfileFindFriendsLoader,
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
