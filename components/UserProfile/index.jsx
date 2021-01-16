import React, {
    Fragment,
} from 'react';
import {
    Container,
    Responsive,
    Grid,
    Header,
    Dropdown,
    Button,
    Icon,
} from 'semantic-ui-react';
import {
    string,
    number,
    PropTypes,
    func,
    bool,
} from 'prop-types';
import {
    connect,
} from 'react-redux';
import { Router } from '../../routes';
import { withRouter } from 'next/router';
import { withTranslation } from '../../i18n';

import UserBasicProfile from './BasicProfile';
import ProfileDetails from './ProfileDetails';
import UserRightColumnList from './UserRightColumnList';
import UserFriendList from './UserFriendList';

class UserProfileWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFriendsPage: props.showFriendsPage || false,
        };
        this.showPreviewPage = this.showPreviewPage.bind(this);
        this.hidePreviewPage = this.hidePreviewPage.bind(this);
        this.showFriendPage = this.showFriendPage.bind(this);
        this.hideFriendPage = this.hideFriendPage.bind(this);
        this.togglePreviewPage = this.togglePreviewPage.bind(this);
    }
    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        if (!(this.props.router.asPath && (this.props.router.asPath.includes('/user') ||
            this.props.router.asPath.includes('/users')
        ))) {
            dispatch({
                payload: {
                    previewMode: {
                        isPreviewMode: false,
                        previewValue: 0,
                    },
                },
                type: 'USER_PROFILE_PREVIEW_MODE',
            });
        }
    }
    showPreviewPage() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
                previewMode: {
                    isPreviewMode: true,
                    previewValue: 0,
                },
            },
            type: 'USER_PROFILE_PREVIEW_MODE',
        });
        window.scrollTo(0,0);
    }

    hidePreviewPage() {
        const {
            currentUser: {
                id: currentUserId,
            },
            dispatch,
        } = this.props;
        dispatch({
            payload: {
                previewMode: {
                    isPreviewMode: false,
                    previewValue: 0,
                },
            },
            type: 'USER_PROFILE_PREVIEW_MODE',
        });
        Router.pushRoute(`/users/profile/${currentUserId}`);
    }

    showFriendPage() {
        this.setState({
            showFriendsPage: true,
        });
    }

    hideFriendPage() {
        this.setState({
            showFriendsPage: false,
        });
    }

    togglePreviewPage(event, data) {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
                previewMode: {
                    isPreviewMode: true,
                    previewValue: data.value,
                },
            },
            type: 'USER_PROFILE_PREVIEW_MODE',
        });
    }

    render() {
        const {
            currentUser: {
                id: currentUserId,
            },
            friendUserId,
            friendPageStep,
            previewMode: {
                isPreviewMode,
                previewValue,
            },
            userFriendProfileData: {
                attributes: {
                    causes_visibility,
                    giving_goal_visibility,
                    profile_type,
                },
            },
        } = this.props;
        const {
            showFriendsPage,
        } = this.state;
        const isMyFriendsPage = (friendPageStep === 'myfriends');
        const updatedFriendId =  Number(friendUserId) ? friendUserId : currentUserId;
        const isSingleColumnLayout = (profile_type !== 'my_profile' && causes_visibility === 2 && giving_goal_visibility === 2);
        const options = [
            {
                key: 'Public',
                text: (
                    <span className="text">
                        <Icon className="globe" />
                    Public
                    </span>
                ),
                value: 0,
            },
            {
                key: 'Friends',
                text: (
                    <span className="text">
                        <Icon className="users" />
                    Friends
                    </span>
                ),
                value: 1,
            },
        ];
        const isBlocked = (profile_type.substring(0, 7) === 'blocked') ? true : false;
        return (
            <Fragment>
                {isPreviewMode
                    && (
                        <div className="previewHeader">
                            <Container>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column computer={8} tablet={8} mobile={16}>
                                            <Header as="h4">
                                                <Header.Content>
                                                    <div>This is how your profile looks to:</div>
                                                    <Dropdown
                                                        inline
                                                        options={options}
                                                        value={previewValue}
                                                        icon="chevron down"
                                                        onChange={this.togglePreviewPage}
                                                    />
                                                </Header.Content>
                                            </Header>
                                        </Grid.Column>
                                        <Grid.Column computer={8} tablet={8} mobile={16}>
                                            <div className='returnPrfl'>
                                                <Button
                                                    className='white-btn-rounded-def'
                                                    onClick={this.hidePreviewPage}
                                                >
                                                    Return to your personal profile view
                                            </Button>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Container>
                        </div>
                    )}
                {(!showFriendsPage && !isMyFriendsPage)
                    ? (
                        <Container>
                            <div className="userProfileScreen">
                                <div className="userHeaderBanner" />
                                <div className="usercontentsecWrap">
                                    <div className="userleftColumn">
                                        <div className="userdetailsWrap">
                                            <UserBasicProfile
                                                handlePreviewPage={this.showPreviewPage}
                                                hanldeFriendPage={this.showFriendPage}
                                            />
                                        </div>
                                        {!isBlocked && <ProfileDetails
                                            friendUserId={updatedFriendId}
                                        />
                                        }
                                    </div>
                                    {(!isSingleColumnLayout && !isBlocked)
                                        && (
                                            <div className="userrightColumn">
                                                <Responsive minWidth={768}>
                                                    <UserRightColumnList
                                                        friendUserId={updatedFriendId}
                                                    />
                                                </Responsive>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </Container>
                    )
                    : (
                        <UserFriendList
                            hideFriendPage={this.hideFriendPage}
                            isMyFriendsPage={isMyFriendsPage}
                            friendPageStep={this.props.friendPageStep}
                        />
                    )}
            </Fragment>
        );
    }
}

UserProfileWrapper.defaultProps = {
    currentUser: {
        id: '',
    },
    dispatch: () => { },
    friendUserId: '',
    previewMode: {
        isPreviewMode: false,
        previewValue: '',
    },
    userFriendProfileData: {
        attributes: {
            causes_visibility: null,
            giving_goal_visibility: null,
            profile_type: '',
        },
    },
};

UserProfileWrapper.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    dispatch: func,
    friendUserId: string,
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
        previewValue: string,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            causes_visibility: number,
            giving_goal_visibility: number,
            profile_type: string,
        }),
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
    };
}

const connectedComponent = withRouter(withTranslation([
    'common',
])(connect(mapStateToProps)(UserProfileWrapper)));
export {
    connectedComponent as default,
    UserProfileWrapper,
    mapStateToProps,
};
