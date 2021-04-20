import React, {
    Fragment,
} from 'react';
import {
    List,
    Header,
    Image,
    Icon,
    Button,
    Dropdown,
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
    array,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _indexOf from 'lodash/indexOf';
import _toNumber from 'lodash/toNumber';

import { Link } from '../../../routes';
import {
    getLocation,
} from '../../../helpers/profiles/utils';
import { withTranslation } from '../../../i18n';
import {
    acceptFriendRequest,
    ingnoreFriendRequest,
    sendFriendRequest,
} from '../../../actions/userProfile';
import friendAvatarPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';

class FriendListCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleAcceptRequest = this.handleAcceptRequest.bind(this);
        this.rejectInvite = this.rejectInvite.bind(this);
        this.handleAddFriendClick = this.handleAddFriendClick.bind(this);
        let updatedStatus = (_isEmpty(props.data.status) && !_isEmpty(props.data.friend_status)) ? props.data.friend_status : props.data.status;
        if (_indexOf(props.data.ignored_by_users, _toNumber(props.currentUser.id)) !== -1) {
            updatedStatus = undefined;
        }
        if (props.data.state === "IGNORED" && props.data.status !== "PENDING_OUT") {
            updatedStatus = '';
        }
        this.state = {
            updatedStatus,
        };
    }

    handleAcceptRequest(destinationEmail, destinationUserId) {
        const {
            currentUser: {
                id,
                attributes: {
                    avatar,
                    email,
                    firstName,
                    displayName,
                },
            },
            dispatch,
        } = this.props;
        if (!_isEmpty(email)) {
            acceptFriendRequest(dispatch, id, email, avatar, firstName, displayName, destinationEmail, destinationUserId, 1, 'MYFRIENDS', null)
        }
    }

    rejectInvite(friendUserId, email_hash, type, rejectType = 'ignore') {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: currentUserId,
            },
            dispatch,
        } = this.props;
        dispatch(ingnoreFriendRequest(currentUserId, friendUserId, email, type, rejectType));
    }

    handleAddFriendClick(userEmail, userId) {
        const {
            currentUser: {
                id: currentUserId,
                attributes: {
                    avatar,
                    displayName,
                    email,
                    firstName,
                },
            },
            dispatch,
        } = this.props;
        const requestObj = {
            recipientEmail: Buffer.from(userEmail, 'base64').toString('ascii'),
            recipientUserId: userId,
            requesterAvatar: avatar,
            requesterDisplayName: displayName,
            requesterEmail: email,
            requesterFirstName: firstName,
            requesterUserId: currentUserId,
        };
        dispatch(sendFriendRequest(requestObj)).then(() => {
            this.setState({
                updatedStatus: 'PENDING_OUT',
            });
        });
    }

    render() {
        const {
            data: {
                avatar,
                city,
                email_hash,
                first_name,
                last_name,
                province,
                status,
                user_id,
                friend_status,
            },
            type,
            isMyProfile,
        } = this.props;
        const {
            updatedStatus,
        } = this.state;
        let buttonText = '';
        let buttonClass = 'blue-btn-rounded-def';
        switch (updatedStatus) {
            case 'ACCEPTED':
                buttonText = 'Message';
                break;
            case 'PENDING_IN':
                buttonText = 'Accept';
                buttonClass = 'blue-bordr-btn-round-def';
                break;
            case 'PENDING_OUT':
                buttonText = 'Pending';
                buttonClass = 'blue-bordr-btn-round-def';
                break;
            default:
                buttonText = 'Add friend';
                buttonClass = 'blue-bordr-btn-round-def';
                break;
        }
        const buttonElement = (
            <Button
                className={`${buttonClass} c-small`}
            >
                {buttonText}
            </Button>
        );
        return (
            <List.Item>
                <Image avatar src={!_isEmpty(avatar) ? avatar : friendAvatarPlaceholder} />
                <List.Content>
                    <List.Header>
                        <Link className="lnkChange" route={`/users/profile/${user_id}`}>
                            {`${first_name} ${last_name}`}
                        </Link>
                    </List.Header>
                    <List.Description>{getLocation(city, province)}</List.Description>
                </List.Content>
                <List.Content floated="right">
                    {(!_isEmpty(updatedStatus) && updatedStatus === 'ACCEPTED')
                        && (
                            <Link route={`/chats/${user_id}`}>
                                { buttonElement}
                            </Link>
                        )}
                    {(!_isEmpty(updatedStatus) && updatedStatus === 'PENDING_IN')
                        && (
                            <Fragment>
                                <Button
                                    className={`${buttonClass} c-small`}
                                    onClick={() => this.handleAcceptRequest(email_hash, user_id)}
                                >
                                    {buttonText}
                                </Button>
                                <a className='ignore' onClick={() => this.rejectInvite(user_id, email_hash, type)}>Ignore</a>
                            </Fragment>
                        )}
                    {(!_isEmpty(updatedStatus) && updatedStatus === 'PENDING_OUT')
                        && (
                            <Fragment>
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
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => this.rejectInvite(user_id, email_hash, 'friendSearch', 'cancel')}>
                                            Cancel<span className='mob-hide'> friend</span> request
                                    </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Fragment>
                        )}
                    {(_isEmpty(updatedStatus) || (updatedStatus === 'LIMITED'))
                        && (
                            <Button
                                className={`${buttonClass} c-small`}
                                onClick={() => this.handleAddFriendClick(email_hash, user_id)}
                            >
                                {buttonText}
                            </Button>
                        )}
                </List.Content>
            </List.Item>
        );
    }
}

FriendListCard.defaultProps = {
    currentUser: {
        attributes: {
            avatar: '',
            displayName: '',
            email: '',
            firstName: '',
        },
        id: '',
    },
    data: {
        avatar: '',
        city: '',
        first_name: '',
        friend_status: '',
        ignored_by_users: [],
        last_name: '',
        province: '',
        status: '',
        state: '',
    },
    type: '',
    hideFriendPage: () => { },
    isMyProfile: false,
    userFindFriendsList: {
        count: null,
        data: [],
    },
};

FriendListCard.propTypes = {
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            displayName: string,
            email: string,
            firstName: string,
        }),
        id: string,
    }),
    data: PropTypes.shape({
        avatar: string,
        city: string,
        first_name: string,
        friend_status: string,
        ignored_by_users: array,
        last_name: string,
        province: string,
        status: string,
        state: string,
    }),
    type: string,
    isMyProfile: bool,
    userFindFriendsList: PropTypes.shape({
        count: number,
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFindFriendsList: state.userProfile.userFindFriendsList,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(FriendListCard));
export {
    connectedComponent as default,
    FriendListCard,
    mapStateToProps,
};
