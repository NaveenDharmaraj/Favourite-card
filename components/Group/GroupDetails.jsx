import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    arrayOf,
    PropTypes,
    bool,
    string,
    func,
    number,
} from 'prop-types';
import {
    Button,
    Container,
    Header,
    Image,
    Grid,
    Dropdown,
    Responsive,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import {
    Link,
} from '../../routes';
import {
    joinGroup,
    getGroupBeneficiariesCount,
    leaveGroup,
} from '../../actions/group';
import {
    generateDeepLink,
} from '../../actions/profile';
import LeaveModal from '../../components/shared/LeaveModal';

import GroupShareDetails from './GroupShareDetails';
import GiveFromGroupModal from './GiveFromGroupModal';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class GroupDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinClicked: false,
            openLeaveModal: false,
            userJoinClicked: false,
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleUserJoin = this.handleUserJoin.bind(this);
        this.close = this.close.bind(this);
        this.callLeaveGroup = this.callLeaveGroup.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
            isAuthenticated,
            currentUser: {
                id: userId,
            },
            groupDetails: {
                id: groupId,
                relationships: {
                    groupBeneficiaries: {
                        links: {
                            related,
                        },
                    },
                },
            },
        } = this.props;
        let deepLinkApiUrl = `deeplink?profileType=groupprofile&profileId=${groupId}`;
        if (isAuthenticated) {
            deepLinkApiUrl += `&sourceId=${userId}`;
            getGroupBeneficiariesCount(dispatch, related);
        }
        generateDeepLink(deepLinkApiUrl, dispatch);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props, prevProps)) {
            if (this.props.closeLeaveModal === true) {
                this.setState({
                    openLeaveModal: false,
                });
            }
        }
    }

    close() {
        this.setState({
            openLeaveModal: false,
        });
    }

    handleJoin() {
        this.setState({
            joinClicked: true,
        });
    }

    handleUserJoin() {
        const {
            dispatch,
            groupAdminsDetails,
            groupDetails: {
                attributes: {
                    slug,
                },
                id: groupId,
            },
            groupMembersDetails,
        } = this.props;
        const loadMembers = (!_isEmpty(groupAdminsDetails) || !_isEmpty(groupMembersDetails));
        joinGroup(dispatch, slug, groupId, loadMembers);
        this.setState({
            userJoinClicked: true,
        });
    }

    open() {
        this.setState({
            openLeaveModal: true,
        });
    }

    callLeaveGroup() {
        const {
            dispatch,
            groupAdminsDetails,
            groupDetails: {
                attributes: {
                    slug,
                },
                id: groupId,
            },
            groupMembersDetails,
        } = this.props;
        const loadMembers = (!_isEmpty(groupAdminsDetails) || !_isEmpty(groupMembersDetails));
        leaveGroup(dispatch, slug, groupId, loadMembers);
        this.setState({
            userJoinClicked: false,
        });
    }

    render() {
        const {
            buttonLoader,
            beneficiariesCount,
            errorMessage,
            groupDetails: {
                attributes: {
                    avatar,
                    causes,
                    fundId,
                    name,
                    location,
                    slug,
                    isMember,
                    isAdmin,
                },
                id: groupId,
            },
            isAuthenticated,
            currentUser: {
                id: userId,
            },
        } = this.props;
        const {
            joinClicked,
            userJoinClicked,
            openLeaveModal,
        } = this.state;
        let getCauses = null;
        let giveButton = null;
        let joinButton = null;
        let permissionButtons = null;
        let giveFromGroupButton = null;
        let showError = false;
        let showMangeGroups = false;

        // TODO add ellipses if it exceeds some(get confirmation) limit
        if (!_isEmpty(causes)) {
            getCauses = causes.map((cause, index) => (
                index <= 2
                    ? (
                        <span className="badge">
                            {cause.display_name}
                        </span>
                    ) : (
                        <span className="badge">
                            {cause.display_name}
                        </span>
                    )
            ));
        }

        if (isAuthenticated) {
            giveButton = (
                (isMember || isAdmin)
                && (
                    <div className="buttonWraper">
                        <Link route={`/give/to/group/${slug}/new`}>
                            <Button primary className="blue-btn-rounded">
                            Give
                            </Button>
                        </Link>
                    </div>
                )

            );
            joinButton = (
                (!isMember && !isAdmin)
                && (
                    <div className="buttonWraper">
                        <Button
                            onClick={this.handleUserJoin}
                            className="blue-bordr-btn-round"
                            disabled={userJoinClicked}
                        >
                        Join
                        </Button>
                    </div>
                )
            );
            giveFromGroupButton = (
                (
                    <div className="buttonWraper">
                        {!_isEmpty(beneficiariesCount)
                            ? (
                                <Link route={`/give/to/charity/new?group_id=${groupId}&source_account_holder_id=${fundId}`}>
                                    <Button
                                        className="blue-bordr-btn-round"
                                    >
                                    Give from this Group
                                    </Button>
                                </Link>
                            )
                            : <GiveFromGroupModal />
                        }
                    </div>
                )
            );
        } else {
            giveButton = (
                <div className="buttonWraper">
                    <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                        <Button primary className="blue-btn-rounded">Give</Button>
                    </a>
                </div>
            );
            joinButton = (
                <div className="buttonWraper">
                    <Button
                        onClick={this.handleJoin}
                        className="blue-bordr-btn-round"
                    >
                    Join
                    </Button>
                </div>
            );
        }
        if (!isAuthenticated && joinClicked) {
            permissionButtons = (
                <Fragment>
                    <div className="buttonWraper">
                        <Link route={`/users/new`}>
                            <Button primary className="blue-btn-rounded">Sign up</Button>
                        </Link>
                    </div>
                    <div className="buttonWraper">
                        <Link route={`/users/login?returnTo=/groups/${slug}`}>
                            <Button primary className="blue-btn-rounded">Log in</Button>
                        </Link>
                    </div>
                </Fragment>
            );
        }
        if (!_.isEmpty(errorMessage) && errorMessage.id === groupId) {
            showError = true;
            if (errorMessage.adminError) {
                showMangeGroups = true;
            }
        }
        return (
            <div className="profile-header">
                <Container>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={3} computer={2}>
                                <div className="profile-img-rounded">
                                    <div className="pro-pic-wraper">
                                        <Image src={avatar} circular />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={13} computer={14}>
                                <Grid stackable>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={8}>
                                            <div className="ProfileHeaderWraper">
                                                <Header as="h3">
                                                    {name}
                                                    <Header.Subheader>
                                                        {location}
                                                    </Header.Subheader>
                                                </Header>
                                                <Responsive minWidth={320} maxWidth={991}>
                                                    <div className=" badge-group mt-1">
                                                        {getCauses}
                                                    </div>
                                                </Responsive>

                                            </div>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={16} computer={8}>
                                            <div className="gpRightButtons">

                                                {!joinClicked && giveButton}
                                                {!joinClicked && joinButton}
                                                {joinClicked && permissionButtons}
                                                {isAdmin && giveFromGroupButton }
                                                <GroupShareDetails />
                                                {(isMember || isAdmin)
                                                && (
                                                    <Fragment>
                                                        <Dropdown floating icon="setting">
                                                            <Dropdown.Menu>
                                                                {isAdmin
                                                                    && (
                                                                        <Dropdown.Item
                                                                            tag="a"
                                                                            href={(`${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`)}
                                                                            text="Edit Group"
                                                                        />
                                                                    )}
                                                                {isMember
                                                                && (
                                                                    <Dropdown.Item
                                                                        text="Leave Group"
                                                                        onClick={() => {
                                                                            this.open();
                                                                        }}
                                                                    />
                                                                )}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                        { openLeaveModal
                                                            && (
                                                                <LeaveModal
                                                                    showError={showError}
                                                                    showMangeGroups={showMangeGroups}
                                                                    slug={slug}
                                                                    name={name}
                                                                    id={userId}
                                                                    callLeaveGroup={this.callLeaveGroup}
                                                                    close={this.close}
                                                                    open={this.open}
                                                                    errorMessage={errorMessage}
                                                                    leaveButtonLoader={buttonLoader}
                                                                />
                                                            )
                                                        }
                                                    </Fragment>
                                                )
                                                }
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <Responsive minWidth={992}>
                                    <div className=" badge-group mt-1">
                                        {getCauses}
                                    </div>
                                </Responsive>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

GroupDetails.defaultProps = {
    beneficiariesCount: [],
    buttonLoader: false,
    currentUser: {
        id: null,
    },
    dispatch: _.noop,
    errorMessage: {
        adminError: null,
        id: '',
    },
    groupAdminsDetails: {},
    groupDetails: {
        attributes: {
            avatar: '',
            groupType: '',
            location: '',
            name: '',
            slug: '',
        },
    },
    groupMembersDetails: {},
    isAuthenticated: false,
};

GroupDetails.propTypes = {
    beneficiariesCount: arrayOf(PropTypes.element),
    buttonLoader: bool,
    currentUser: {
        id: string,
    },
    dispatch: func,
    errorMessage: {
        adminError: number,
        id: string,
    },
    groupAdminsDetails: {},
    groupDetails: {
        attributes: {
            avatar: string,
            groupType: string,
            location: string,
            name: string,
            slug: string,
        },
    },
    groupMembersDetails: {},
    isAuthenticated: bool,
};

function mapStateToProps(state) {
    return {
        beneficiariesCount: state.group.beneficiariesCount,
        buttonLoader: state.group.leaveButtonLoader,
        closeLeaveModal: state.group.closeLeaveModal,
        currentUser: state.user.info,
        deepLinkUrl: state.profile.deepLinkUrl,
        disableFollow: state.profile.disableFollow,
        errorMessage: state.group.errorMessage,
        groupAdminsDetails: state.group.groupAdminsDetails,
        groupDetails: state.group.groupDetails,
        groupMembersDetails: state.group.groupMembersDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GroupDetails);
