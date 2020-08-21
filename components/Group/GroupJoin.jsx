import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import {
    Button,
    Dropdown,
} from 'semantic-ui-react';
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import { connect } from 'react-redux';

import { Link } from '../../routes';
import {
    joinGroup,
    leaveGroup,
} from '../../actions/group';
import LeaveModal from '../shared/LeaveModal';

class GroupJoin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinClicked: false,
            showLeaveModal: false,
        };
        this.handleUserJoin = this.handleUserJoin.bind(this);
        this.handleLeaveGroup = this.handleLeaveGroup.bind(this);
        this.openLeaveModal = this.openLeaveModal.bind(this);
        this.closeLeaveModal = this.closeLeaveModal.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            closeLeaveModal,
            groupDetails: {
                attributes: {
                    isMember,
                },
            },
        } = this.props;
        if (!_isEqual(this.props, prevProps)) {
            if (closeLeaveModal) {
                this.setState({
                    showLeaveModal: false,
                });
            }
            if ((!_isEqual(prevProps.groupDetails.attributes.isMember, isMember)
                    && isMember)) {
                this.setState({
                    joinClicked: false,
                });
            }
        }
    }

    handleUserJoin() {
        const {
            dispatch,
            groupDetails: {
                attributes: {
                    slug,
                },
                id: groupId,
            },
            groupMembersDetails,
        } = this.props;
        const loadMembers = !_isEmpty(groupMembersDetails);
        dispatch(joinGroup(slug, groupId, loadMembers));
        this.setState({
            joinClicked: true,
        });
    }

    handleLeaveGroup() {
        const {
            dispatch,
            groupDetails: {
                attributes: {
                    slug,
                },
                id: groupId,
            },
            groupMembersDetails,
        } = this.props;
        const loadMembers = !_isEmpty(groupMembersDetails);
        dispatch(leaveGroup(slug, groupId, loadMembers));
    }

    openLeaveModal() {
        this.setState({
            showLeaveModal: true,
        });
    }

    closeLeaveModal() {
        this.setState({
            showLeaveModal: false,
        });
    }

    render() {
        const {
            buttonLoader,
            currentUser: {
                id: userId,
            },
            errorMessage,
            groupDetails: {
                attributes: {
                    isMember,
                    name,
                    slug,
                },
            },
            isAuthenticated,
        } = this.props;
        const {
            joinClicked,
            showLeaveModal,
        } = this.state;
        let joinButton = null;
        let leaveButton = null;
        let showError = false;
        let showMangeGroups = false;
        if (errorMessage && !_isEmpty(errorMessage.adminError)) {
            showError = true;
            if (errorMessage.adminError === 1) {
                showMangeGroups = true;
            }
        }
        if (isAuthenticated) {
            if (!isMember) {
                joinButton = (
                    <Fragment>
                        <Button
                            onClick={this.handleUserJoin}
                            className="blue-bordr-btn-round-def CampaignBtn"
                            disabled={joinClicked}
                        >
                        Join group
                        </Button>
                        <p>
                            Join this group to get updates, show your support, and connect with other group members.
                        </p>
                    </Fragment>
                );
            } else {
                leaveButton = (
                    <Fragment>
                        <a role="listitem" className="item">
                            <Dropdown
                                className="rightBottom"
                                icon="ellipsis horizontal"
                                closeOnBlur
                            >
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Leave group" onClick={this.openLeaveModal} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </a>
                        {showLeaveModal
                        && (
                            <LeaveModal
                                showError={showError}
                                showMangeGroups={showMangeGroups}
                                slug={slug}
                                name={name}
                                id={userId}
                                callLeaveGroup={this.handleLeaveGroup}
                                close={this.closeLeaveModal}
                                errorMessage={errorMessage}
                                leaveButtonLoader={buttonLoader}
                            />
                        )}
                    </Fragment>
                );
            }
        } else {
            joinButton = (
                <Link route={`/users/login?returnTo=/groups/${slug}`}>
                    <Button
                        className="blue-bordr-btn-round-def"
                    >
                    Join group
                    </Button>
                </Link>
            );
        }
        return (
            <Fragment>
                {isMember
                    ? leaveButton
                    : joinButton
                }
            </Fragment>
        );
    }
}

GroupJoin.defaultProps = {
    buttonLoader: false,
    closeLeaveModal: false,
    currentUser: {
        id: null,
    },
    dispatch: () => {},
    errorMessage: {
        adminError: null,
        id: '',
    },
    groupDetails: {
        attributes: {
            avatar: '',
            groupType: '',
            isMember: false,
            location: '',
            name: '',
            slug: '',
        },
        id: '',
    },
    groupMembersDetails: {},
    isAuthenticated: false,
};

GroupJoin.propTypes = {
    buttonLoader: bool,
    closeLeaveModal: bool,
    currentUser: PropTypes.shape({
        id: string,
    }),
    dispatch: func,
    errorMessage: PropTypes.shape({
        adminError: number,
        id: string,
    }),
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            groupType: string,
            isMember: bool,
            location: string,
            name: string,
            slug: string,
        }),
        id: string,
    }),
    groupMembersDetails: PropTypes.shape({}),
    isAuthenticated: bool,
};

function mapStateToProps(state) {
    return {
        buttonLoader: state.group.leaveButtonLoader,
        closeLeaveModal: state.group.closeLeaveModal,
        currentUser: state.user.info,
        errorMessage: state.group.errorMessage,
        groupDetails: state.group.groupDetails,
        groupMembersDetails: state.group.groupMembersDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GroupJoin);
