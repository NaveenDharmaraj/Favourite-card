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
            addButtonClicked: false,
        };
        this.addFriend = this.addFriend.bind(this);
    }

    addFriend() {
        const {
            memberData: {
                attributes: {
                    email: friendEmail,
                },
                id: friendUserId,
            },
            currentUser: {
                attributes: {
                    avatar: currentUserAvatar,
                    displayName: currentUserDisplayName,
                    email: currentUserEmail,
                    firstName: currentUserFirstName,
                },
                id: currentUserId,
            },
            dispatch,
        } = this.props;
        this.setState({
            addButtonClicked: true,
        });
        const user = {
            currentUserAvatar,
            currentUserDisplayName,
            currentUserEmail,
            currentUserFirstName,
            currentUserId,
            friendEmail,
            friendUserId,
        };
        dispatch(addFriendRequest(user));
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
                id: userId,
            },
            currentUser: {
                id: currentUserId,
            },
        } = this.props;
        const {
            addButtonClicked,
        } = this.state;
        let hideButton = false;
        let friendStatusText = '';
        const isBlocked = (friendStatus && friendStatus.substring(0, 7) === 'BLOCKED');
        const isRequestPending = (friendStatus && friendStatus.substring(0, 7) === 'PENDING');
        const isFriend = (friendStatus && friendStatus === 'ACCEPTED');
        const isCurrentUser = (currentUserId === userId);

        if ((isCurrentUser || isFriend || isBlocked)) {
            hideButton = true;
        }

        if (_isEmpty(friendStatus) && !addButtonClicked) {
            friendStatusText = 'Add friend';
        } else if (isRequestPending || addButtonClicked) {
            friendStatusText = 'Pending';
        }
        return (
            <Table.Body>
                <Table.Row className="EmilyData">
                    <Table.Cell className="EmilyGroup">
                        <List verticalAlign="middle">
                            <List.Item>
                                <Image className="imgEmily" src={avatar} />
                                <List.Content>
                                    <List.Header className="EmilyAdmin">
                                        {`${displayName} ${isGroupAdmin ? `• Admin` : ''}`}
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
                                    className={`btnFrinend ${isRequestPending ? 'blue-btn-rounded-def' : 'blue-bordr-btn-round-def'}`}
                                    disabled={addButtonClicked || isRequestPending}
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
        id: '',
    },
    dispatch: () => {},
    memberData: {
        attributes: {
            avatar: '',
            city: '',
            displayName: '',
            friendStatus: '',
            isGroupAdmin: false,
            province: '',
        },
        id: '',
    },
};

MemberCard.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    dispatch: func,
    memberData: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            city: string,
            displayName: string,
            friendStatus: string,
            isGroupAdmin: bool,
            province: string,
        }),
        id: string,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default connect(mapStateToProps)(MemberCard);
