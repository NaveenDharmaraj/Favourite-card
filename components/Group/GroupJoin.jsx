import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Button,
} from 'semantic-ui-react';
import {
    PropTypes,
    bool,
    func,
    string,
    number,
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
        };
        this.handleUserJoin = this.handleUserJoin.bind(this);
        this.handleLeaveGroup = this.handleLeaveGroup.bind(this);
        this.openLeaveModal = this.openLeaveModal.bind(this);
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
        joinGroup(dispatch, slug, groupId, loadMembers);
        this.setState({
            joinClicked: true,
            showLeaveModal: false,
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
        leaveGroup(dispatch, slug, groupId, loadMembers);
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
                id: groupId,
            },
            isAuthenticated,
        } = this.props;
        const {
            joinClicked,
            showLeaveModal,
        } = this.state;
        debugger;
        let joinButton = null;
        let leaveButton = null;
        let showError = false;
        let showMangeGroups = false;
        if (!_isEmpty(errorMessage) && errorMessage.id === groupId) {
            showError = true;
            if (errorMessage.adminError) {
                showMangeGroups = true;
            }
        }
        if (isAuthenticated) {
            if (!isMember) {
                joinButton = (
                    <Button
                        onClick={this.handleUserJoin}
                        className="blue-bordr-btn-round-def CampaignBtn"
                        // disabled={joinClicked}
                    >
                    Join group
                    </Button>
                );
            } else {
                leaveButton = (
                    <Fragment>
                        {isMember
                       && (
                           <Button
                               onClick={this.openLeaveModal}
                               className="blue-bordr-btn-round-def CampaignBtn"
                               // disabled={userJoinClicked}
                           >
                            Leave group
                           </Button>
                       )}

                        {/* <Dropdown floating icon="setting">
                            <Dropdown.Menu>
                                {isMember
                                    && (
                                        <Dropdown.Item
                                            text="Leave Group"
                                            onClick={() => {
                                                this.openLeaveModal();
                                            }}
                                        />
                                    )}
                            </Dropdown.Menu>
                        </Dropdown> */}
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
                                open={this.openLeaveModal}
                                errorMessage={errorMessage}
                                leaveButtonLoader={buttonLoader}
                            />
                        )}
                    </Fragment>
                );
            }
        } else {
            joinButton = (
                <div className="">
                    <Link route={`/users/login?returnTo=/groups/${slug}`}>
                        <Button
                            className="blue-bordr-btn-round-def"
                        >
                        Join
                        </Button>
                    </Link>
                </div>
            );
        }
        return (
            <div>
                { !isMember && joinButton }
                {isMember && leaveButton}
            </div>
        );
    }
}

GroupJoin.defaultProps = {
    buttonLoader: false,
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
    currentUser: {
        id: string,
    },
    dispatch: func,
    errorMessage: {
        adminError: number,
        id: string,
    },
    groupDetails: {
        attributes: {
            avatar: string,
            groupType: string,
            location: string,
            name: string,
            slug: string,
        },
        id: string,
    },
    groupMembersDetails: {},
    isAuthenticated: bool,
};

function mapStateToProps(state) {
    return {
        buttonLoader: state.group.leaveButtonLoader,
        currentUser: state.user.info,
        groupDetails: state.group.groupDetails,
        groupMembersDetails: state.group.groupMembersDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GroupJoin);
