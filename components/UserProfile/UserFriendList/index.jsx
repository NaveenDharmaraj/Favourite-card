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
    bool,
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

class UserFriendList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidMount() {
        const {
            currentUser: {
                attributes: {
                    email,
                },
            },
            dispatch,
        } = this.props;
        getMyFriendsList(dispatch, email, 1);
        getFriendsInvitations(dispatch, email, 1);
    }

    render() {
        const {
            hideFriendPage,
        } = this.props;
        return (
            <Container>
                <div className="userProfileScreen">
                    <div className="userHeaderBanner" />
                    <div className="usercontentsecWrap">
                        <div className="userleftColumn">
                            <div className="userdetailsWrap">
                                <div className='user_profileImage'>
                                    <p>IMAGE</p>
                                </div>
                                <div className='user_profileDetails'>
                                    <Header className="usrName">Tammy Tuba</Header>
                                    <div className="userCity_friends">
                                        <p>Vancouver, BC</p>
                                        <div className="userfriends">
                                            <Header as='h5'>12 friends</Header>
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
                                        <Header as='h3'>Your friends</Header>
                                        <div className='invitationsWrap'>
                                            <Header as='h4'>Invitations</Header>
                                            <List divided verticalAlign="middle" className="users_List">
                                                <List.Item>
                                                    <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                    <List.Content>
                                                        <List.Header as='a'>Kiandra Lowe</List.Header>
                                                        <List.Description >Vancouver, BC</List.Description>
                                                    </List.Content>
                                                    <List.Content floated="right">
                                                        <Button
                                                            className="blue-bordr-btn-round-def c-small"
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Icon className="trash alternate outline"></Icon>
                                                    </List.Content>
                                                </List.Item>
                                            </List>
                                        </div>
                                        <div className='friendsSearch'>
                                            <Header as='h4'>Friends</Header>
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
                                            <List.Item>
                                                <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                <List.Content>
                                                    <List.Header as='a'>Kiandra Lowe</List.Header>
                                                    <List.Description >Vancouver, BC</List.Description>
                                                </List.Content>
                                                <List.Content floated="right">
                                                    <Button
                                                        className="blue-btn-rounded-def c-small"
                                                    >
                                                        Message
                                                    </Button>
                                                </List.Content>
                                            </List.Item>
                                        </List>
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
    dispatch: () => {},
    currentUser: {
        attributes: {
            email: '',
        },
    },
};

UserFriendList.propTypes = {
    dispatch: func,
    currentUser: {
        attributes: {
            email: string,
        },
    },
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