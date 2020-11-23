import React from 'react';
import { connect } from 'react-redux';
import {
    List,
    Image,
    Button,
    Table,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
    func,
    string,
    PropTypes,
} from 'prop-types';

import imagePlaceholder from '../../static/images/no-data-avatar-user-profile.png';
import { withTranslation } from '../../i18n';
import {
    getLocation,
} from '../../helpers/profiles/utils';
import {
    addFriendRequest,
} from '../../actions/group';

class MemberCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                buttonState: false,
            });
        });
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
        } = this.state;
        const statusMapping = {
            BLOCKED_OUT: formatMessage('groupProfile:blocked'),
            default: formatMessage('groupProfile:addFriend'),
            PENDING_IN: formatMessage('groupProfile:pending'),
            PENDING_OUT: formatMessage('groupProfile:pending'),
        };
        let friendStatusText = '';
        const isUserBlocked = (friendStatus && friendStatus === 'BLOCKED_IN');
        const isBlockedMember = (friendStatus && friendStatus === 'BLOCKED_OUT');
        const isRequestPending = (friendStatus && friendStatus.substring(0, 7) === 'PENDING');
        const isFriend = (friendStatus && friendStatus === 'ACCEPTED');
        const isCurrentUser = (currentUserId === memberUserId);
        const userDisplayName = isUserBlocked ? formatMessage('groupProfile:anonymousUser') : displayName;
        const disableButton = (isRequestPending | isBlockedMember);
        const hideButton = (isCurrentUser || isFriend || isUserBlocked);

        if (!hideButton) {
            friendStatusText = (_isEmpty(friendStatus)
                ? statusMapping.default : statusMapping[friendStatus]);
        }

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
                        {!hideButton
                                && (
                                    <Button
                                        className={`btnFrinend ${(disableButton) ? 'blue-btn-rounded-def' : 'blue-bordr-btn-round-def'}`}
                                        disabled={disableButton || buttonState}
                                        onClick={this.addFriend}
                                    >
                                        {friendStatusText}
                                    </Button>
                                )}
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
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
    dispatch: () => {},
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
    t: () => {},
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