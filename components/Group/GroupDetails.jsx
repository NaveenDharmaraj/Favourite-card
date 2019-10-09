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
import ShareDetails from '../shared/ShareSectionProfilePage';
import LeaveModal from '../../components/shared/LeaveModal';

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
            deepLinkUrl,
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
        if (isAuthenticated) {
            generateDeepLink(`deeplink?profileType=groupprofile&sourceId=${userId}&profileId=${groupId}`, dispatch);
        }
        if (isAuthenticated) {
            getGroupBeneficiariesCount(dispatch, related);
        }
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
            groupDetails: {
                attributes: {
                    slug,
                },
            },
        } = this.props;
        joinGroup(dispatch, slug);
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
            groupDetails: {
                attributes: {
                    slug,
                },
                id: groupId,
            },
        } = this.props;
        leaveGroup(dispatch, slug, groupId);
        this.setState({
            userJoinClicked: false,
        });
    }

    render() {
        const {
            buttonLoader,
            beneficiariesCount,
            deepLinkUrl,
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
                        <Link route={`/users/login`}>
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
                            <Grid.Column mobile={16} tablet={9} computer={9}>
                                <Grid stackable>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={6} computer={5}>
                                            <div className="ProfileHeaderWraper">
                                                <Header as="h3">
                                                    {name}
                                                    <Header.Subheader>
                                                        {location}
                                                    </Header.Subheader>
                                                </Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={12} computer={11}>
                                            <div className="gpRightButtons">
                                                {!joinClicked && giveButton}
                                                {!joinClicked && joinButton}
                                                {joinClicked && permissionButtons}
                                                {isAdmin && giveFromGroupButton }
                                                {isMember
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
                                <div className=" badge-group mt-1">
                                    {getCauses}
                                </div>
                            </Grid.Column>
                            {isAuthenticated
                            && (
                                <ShareDetails
                                    deepLinkUrl={deepLinkUrl}
                                    profileDetails={this.props.groupDetails}
                                    userId={userId}
                                />
                            )}
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
    groupDetails: {
        attributes: {
            avatar: '',
            groupType: '',
            location: '',
            name: '',
            slug: '',
        },
    },
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
    groupDetails: {
        attributes: {
            avatar: string,
            groupType: string,
            location: string,
            name: string,
            slug: string,
        },
    },
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
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GroupDetails);
