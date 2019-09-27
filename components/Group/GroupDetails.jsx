import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
    string,
    func,
    number,
} from 'prop-types';
import {
    Button,
    Container,
    Header,
    Icon,
    Image,
    Form,
    Grid,
    List,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import { Link } from '../../routes';
import {
    joinGroup,
} from '../../actions/group';
import {
    generateDeepLink,
} from '../../actions/profile';
import ShareDetails from '../shared/ShareSectionProfilePage';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class GroupDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinClicked: false,
            userJoinClicked: false,
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleUserJoin = this.handleUserJoin.bind(this);
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
            },
        } = this.props;
        if (isAuthenticated && _.isEmpty(deepLinkUrl)) {
            generateDeepLink(`deeplink?profileType=charityprofile&sourceId=${userId}&profileId=${groupId}`, dispatch);
        }
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

    render() {
        const {
            deepLinkUrl,
            groupDetails: {
                attributes: {
                    avatar,
                    causes,
                    name,
                    location,
                    slug,
                    isMember,
                    isAdmin,
                },
            },
            isAuthenticated,
            currentUser: {
                id: userId,
            },
        } = this.props;
        const {
            joinClicked,
            userJoinClicked,
        } = this.state;
        let getCauses = null;
        let giveButton = null;
        let joinButton = null;
        let permissionButtons = null;
        let manageButton = null;

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
                    <Grid.Column>
                        <div className="buttonWraper">
                            <Link route={`/give/to/group/${slug}/new`}>
                                <Button primary fluid className="blue-btn-rounded">
                                Give
                                </Button>
                            </Link>
                        </div>
                    </Grid.Column>
                )

            );
            joinButton = (
                (!isMember && !isAdmin)
                && (
                    <Grid.Column>
                        <div className="buttonWraper">
                            <Button
                                onClick={this.handleUserJoin}
                                fluid
                                className="blue-bordr-btn-round"
                                disabled={userJoinClicked}
                            >
                            Join
                            </Button>
                        </div>
                    </Grid.Column>
                )
            );
            manageButton = (
                isAdmin
                && (
                    <Grid.Column>
                        <div className="buttonWraper">
                            <a href={(`${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`)}>
                                <Button fluid className="blue-bordr-btn-round">Manage</Button>
                            </a>
                        </div>
                    </Grid.Column>
                )
            );
        } else {
            giveButton = (
                <Grid.Column>
                    <div className="buttonWraper">
                        <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                            <Button primary fluid className="blue-btn-rounded">Give</Button>
                        </a>
                    </div>
                </Grid.Column>
            );
            joinButton = (
                <Grid.Column>
                    <div className="buttonWraper">
                        <Button
                            onClick={this.handleJoin}
                            fluid
                            className="blue-bordr-btn-round"
                        >
                        Join
                        </Button>
                    </div>
                </Grid.Column>
            );
        }
        if (!isAuthenticated && joinClicked) {
            permissionButtons = (
                <Fragment>
                    <Grid.Column>
                        <div className="buttonWraper">
                            <Link route={`/users/new`}>
                                <Button primary fluid className="blue-btn-rounded">Sign up</Button>
                            </Link>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div className="buttonWraper">
                            <Link route={`/users/login`}>
                                <Button primary fluid className="blue-btn-rounded">Sign in</Button>
                            </Link>
                        </div>
                    </Grid.Column>
                </Fragment>
            );
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
                            <Grid.Column mobile={16} tablet={9} computer={8}>
                                <Grid stackable columns={3}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <div className="ProfileHeaderWraper">
                                                <Header as="h3">
                                                    {name}
                                                    <Header.Subheader>
                                                        {location}
                                                    </Header.Subheader>
                                                </Header>
                                                
                                            </div>
                                        </Grid.Column>
                                        {!joinClicked && giveButton}
                                        {!joinClicked && joinButton}
                                        {joinClicked && permissionButtons}
                                        {manageButton}
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
    currentUser: {
        id: null,
    },
    dispatch: _.noop,
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
    currentUser: {
        id: string,
    },
    dispatch: func,
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
        currentUser: state.user.info,
        deepLinkUrl: state.profile.deepLinkUrl,
        disableFollow: state.profile.disableFollow,
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GroupDetails);
