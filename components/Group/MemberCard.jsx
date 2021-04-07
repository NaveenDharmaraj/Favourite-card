import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    List,
    Image,
    Button,
    Table,
    Dropdown,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
    func,
    string,
    PropTypes,
} from 'prop-types';

import imagePlaceholder from '../../static/images/no-data-avatar-user-profile.png';
import { Link } from '../../routes';
import { withTranslation } from '../../i18n';
import {
    getLocation,
} from '../../helpers/profiles/utils';
import {
    addFriendRequest,
} from '../../actions/group';
import {
    acceptFriend,
    ingnoreFriendRequest,
} from '../../actions/userProfile';

class MemberCard extends React.Component {
    constructor(props) {
        super(props);
        let updatedStatus = !_isEmpty(props.memberData.attributes.friendStatus) ? props.memberData.attributes.friendStatus : '';
        if (props.memberData.attributes.friendIgnoredStatus === "IGNORED" && props.memberData.attributes.friendStatus !== "PENDING_OUT") {
            updatedStatus = '';
        }
        this.state = {
            updatedStatus,
            buttonState: false,
        };
        this.addFriend = this.addFriend.bind(this);
    }

    addFriend() {
        const {
            dispatch,
            currentUser: {
                attributes: {
                    avatar: currentUserAvatar,
                    displayName: currentUserDisplayName,
                    email: currentUserEmail,
                    firstName: currentUserFirstName,
                },
                id: currentUserId,
            },
            memberData: {
                attributes: {
                    email: friendEmail,
                },
                id: memberUserId,
            },
        } = this.props;
        const user = {
            currentUserAvatar,
            currentUserDisplayName,
            currentUserEmail,
            currentUserFirstName,
            currentUserId,
            friendEmail,
            memberUserId,
        };
        this.setState({
            buttonState: true,
        });
        dispatch(addFriendRequest(user)).then(() => {
            this.setState({
                updatedStatus: 'PENDING_OUT',
                buttonState: false,
            });
        });
    }
    rejectInvite(type, rejectType = 'ignore') {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: currentUserId,
            },
            dispatch,
            memberData: {
                id: memberUserId,
            },
        } = this.props;
        dispatch(ingnoreFriendRequest(currentUserId, memberUserId, email, type, rejectType))
            .then(() => {
                this.setState({
                    updatedStatus: ''
                })
            })
            .catch(() => {
                //handle error
            });
    }
    handleAcceptRequest() {
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
            memberData: {
                attributes: {
                    email: friendEmail,
                },
                id: memberUserId,
            },
            dispatch,
        } = this.props;
        if (!_isEmpty(email)) {
            acceptFriend(dispatch, id, email, avatar, firstName, Number(memberUserId), friendEmail)
                .then(() => {
                    this.setState({
                        updatedStatus: 'ACCEPTED'
                    })
                })
                .catch(() => {
                    //handle error
                })
        }
    }
    render() {
        const {
            memberData: {
                attributes: {
                    avatar,
                    displayName,
                    friendStatus,
                    isGroupAdmin,
                    city,
                    province,
                },
                id: memberUserId,
            },
            currentUser: {
                id: currentUserId,
            },
            t: formatMessage,
        } = this.props;
        const {
            buttonState,
            updatedStatus,
        } = this.state;
        let buttonText = '';
        let buttonClass = 'blue-btn-rounded-def';
        switch (updatedStatus) {
            case 'ACCEPTED':
                buttonText = formatMessage('groupProfile:messageText');
                break;
            case 'PENDING_IN':
                buttonText = formatMessage('groupProfile:accept');
                buttonClass = 'blue-bordr-btn-round-def';
                break;
            case 'PENDING_OUT':
                buttonText = formatMessage('groupProfile:pending');
                buttonClass = 'blue-bordr-btn-round-def';
                break;
            case 'BLOCKED_OUT':
                buttonText = formatMessage('groupProfile:blocked');
                buttonClass = 'blue-bordr-btn-round-def';
                break;
            default:
                buttonText = formatMessage('groupProfile:addFriend');
                buttonClass = 'blue-bordr-btn-round-def';
                break;
        }
        const isUserBlocked = (friendStatus && friendStatus === 'BLOCKED_IN');
        const isBlockedMember = (friendStatus && friendStatus === 'BLOCKED_OUT');
        const isCurrentUser = (currentUserId === memberUserId);
        const userDisplayName = isUserBlocked ? formatMessage('groupProfile:anonymousUser') : displayName;
        const hideButton = (isCurrentUser || isUserBlocked);
        const buttonElement = (
            <Button
                className={`${buttonClass} c-small`}
            >
                {buttonText}
            </Button>
        );
        return (
            <Table.Body>
                <Table.Row className="EmilyData">
                    <Table.Cell className="EmilyGroup">
                        <List verticalAlign="middle">
                            <List.Item>
                                <Image className="imgEmily" src={isUserBlocked ? imagePlaceholder : avatar} />
                                <List.Content>
                                    <List.Header className="EmilyAdmin">
                                        {`${userDisplayName} ${isGroupAdmin ? `• ${formatMessage('groupProfile:admin')}` : ''}`}
                                        {isGroupAdmin
                                            && (
                                                <span>
                                                    <i aria-hidden="true" className="icon star outline" />
                                                </span>
                                            )}
                                    </List.Header>
                                    <List.Description>
                                        <p>
                                            {getLocation(city, province)}
                                        </p>
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Table.Cell>
                    <Table.Cell className="amount">
                        {!hideButton &&
                            <Fragment>
                                {(!_isEmpty(updatedStatus) && updatedStatus === 'ACCEPTED')
                                    && (
                                        <Link route={`/chats/${memberUserId}`}>
                                            { buttonElement}
                                        </Link>
                                    )}
                                {(!_isEmpty(updatedStatus) && updatedStatus === 'PENDING_IN')
                                    && (
                                        <Fragment>
                                            <Button
                                                className={`${buttonClass} c-small`}
                                                onClick={() => this.handleAcceptRequest()}
                                            >
                                                {buttonText}
                                            </Button>
                                            <a className='ignore' onClick={() => this.rejectInvite('friends', 'ignore')}>Ignore</a>
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
                                                    <Dropdown.Item onClick={() => this.rejectInvite('friendSearch', 'cancel')}>
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
                                            onClick={() => this.addFriend()}
                                            disabled={buttonState || isBlockedMember}
                                        >
                                            {buttonText}
                                        </Button>
                                    )}
                            </Fragment>
                        }
                    </Table.Cell>
                </Table.Row>
            </Table.Body >
        );
    }
}

MemberCard.defaultProps = {
    currentUser: {
        attributes: {
            avatar: '',
            displayName: '',
            email: '',
            firstName: '',
        },
        id: '',
    },
    dispatch: () => { },
    memberData: {
        attributes: {
            avatar: '',
            city: '',
            displayName: '',
            email: '',
            friendStatus: '',
            isGroupAdmin: false,
            province: '',
        },
        id: '',
    },
    t: () => { },
};

MemberCard.propTypes = {
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            displayName: string,
            email: string,
            firstName: string,
        }),
        id: string,
    }),
    dispatch: func,
    memberData: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            city: string,
            displayName: string,
            email: string,
            friendStatus: string,
            isGroupAdmin: bool,
            province: string,
        }),
        id: string,
    }),
    t: func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(MemberCard));
export {
    connectedComponent as default,
    MemberCard,
    mapStateToProps,
};
