import React, {
    Fragment,
} from 'react';
import {
    List,
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
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { Link } from '../../../routes';
import {
    getLocation,
} from '../../../helpers/profiles/utils';
import { withTranslation } from '../../../i18n';
import {
    acceptFriendRequest,
    getMyFriendsList,
    getFriendsInvitations,
    rejectFriendInvite,
} from '../../../actions/userProfile';

class FriendListCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleAcceptRequest = this.handleAcceptRequest.bind(this);
        this.rejectInvite = this.rejectInvite.bind(this);
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

    rejectInvite(friendUserId, email_hash) {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: currentUserId,
            },
            dispatch,
        } = this.props;
        // const email = !_isEmpty(email_hash) ? Buffer.from(email_hash, 'base64').toString('ascii') : '';
        rejectFriendInvite(dispatch, currentUserId, friendUserId, email);
    }

    render() {
        const {
            currentUser: {
                id: UserId,
            },
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
            hideFriendPage,
            isMyProfile,
        } = this.props;
        // const isMyProfile = (user_id === Number(UserId));
        let buttonText = '';
        let buttonClass = 'blue-btn-rounded-def';
        let searchFriendStatus = (!_isEmpty(friend_status) ? friend_status : '');
        let updatedStatus = ((_isEmpty(status) && !_isEmpty(searchFriendStatus)) ? searchFriendStatus : status);
        switch (updatedStatus) {
            case 'ACCEPTED':
                buttonText = 'Message';
                break;
            case 'PENDING_IN':
                buttonText = 'Accept';
                buttonClass = 'blue-bordr-btn-round-def';
                break;
            default:
                buttonText = 'Add friend';
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
                <Image avatar src={avatar} />
                <List.Content>
                    <List.Header as="a" onClick={hideFriendPage}>
                        <Link className="lnkChange" route={`/users/profile/${user_id}`}>
                            {`${first_name} ${last_name}`}
                        </Link>
                    </List.Header>
                    <List.Description>{getLocation(city, province)}</List.Description>
                </List.Content>
                {isMyProfile
                && (
                    <List.Content floated="right">
                        {(!_isEmpty(updatedStatus) && updatedStatus === 'ACCEPTED')
                            && (
                                <Link route={`/chats/${user_id}`}>
                                    { buttonElement }
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
                            </Fragment>
                        )}
                        {(type === 'invitation')
                        && (
                            <Icon
                                className="trash alternate outline"
                                onClick={() => this.rejectInvite(user_id, email_hash)}
                            />
                        )}
                    </List.Content>
                )}
            </List.Item>
        );
    }
}

FriendListCard.defaultProps = {
    currentUser: {
        id: '',
    },
    data: {
        avatar: '',
        city: '',
        first_name: '',
        last_name: '',
        province: '',
        status: '',
        friend_status: '',
    },
};

FriendListCard.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    data: PropTypes.shape({
        avatar: string,
        city: string,
        first_name: string,
        last_name: string,
        province: string,
        status: string,
        friend_status: string,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
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
