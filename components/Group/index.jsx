import React, {
    Component,
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    func,
    PropTypes,
    string,
    bool,
    array,
} from 'prop-types';
import {
    Container,
    Grid,
    Responsive,
    Divider,
    Segment,
    Header,
    Button,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import { Link } from '../../routes';

import avatarIcon from '../../static/images/no-data-avatar-user-profile.png';
import BreadcrumbDetails from '../shared/BreadCrumbs';
import ProfileTitle from '../shared/ProfileTitle';
import ProfilePageHead from '../shared/ProfilePageHead';
import { generateDeepLink } from '../../actions/profile';
import { handleInvitationAccepts } from '../../actions/user';

import GroupAdmins from './GroupAdmins';
import AboutGroup from './AboutGroup';
import ProfileDetails from './ProfileDetails';
import GroupRightColumnList from './GroupRightColumnList';

class GroupProfileWrapper extends Component {
    componentDidMount() {
        const {
            deepLink,
        } = this.props;
        if (_isEmpty(deepLink)) {
            const {
                currentUser: {
                    id,
                },
                groupDetails: {
                    id: profileId,
                },
                dispatch,
            } = this.props;
            let deepLinkApiUrl = `deeplink?profileType=groupprofile&profileId=${profileId}`;
            if (!_isEmpty(id)) {
                deepLinkApiUrl += `&sourceId=${id}`;
            }
            generateDeepLink(deepLinkApiUrl, dispatch);
        }
    }
    handleAcceptInvite = (e) => {
        const { 
            currentUser: {
                attributes: {
                    email
                },
            },
            groupDetails: {
                id:groupId,
            },
            dispatch,
            step,
        } = this.props;
        const reqObj = { 
            groupId,
            invitationType: 'groupInvite',
            sourceId: step,
        }
        dispatch(handleInvitationAccepts(reqObj, email));
    }

    render() {
        const {
            dispatch,
            groupBeneficiaries: {
                data,
            },
            groupDetails: {
                attributes: {
                    activeMatch,
                    avatar,
                    causes,
                    liked,
                    location,
                    name,
                    hasActiveMatch,
                    slug,
                },
                id: profileId,
                type,
            },
            groupInviteDetails: {
                attributes: {
                    senderAvatar,
                    senderDisplayName,
                    senderFullName,
                },
                id,
            },
            groupMatchingHistory: {
                data: matchHistory,
            },
            isAuthenticated,
            step,
        } = this.props;
        const beneficiariesCount = !_isEmpty(data) ? data : null;
        const {
            groupDetails,
        } = this.props;
        const pathArr = [
            'Explore',
            'Giving Groups',
            name,
        ];
        return (
            <Fragment>
                {!_isEmpty(id) && (
                    <div className="giving_group_top">
                        <Container>
                            <Segment className="box_color">
                                <div className="group_icon">
                                    <img src={senderAvatar || avatarIcon} alt="user-avatar" />
                                </div>
                                <div className="group_text">
                                    <Header as="h5">
                                        {senderDisplayName || senderFullName}
                                        {' '}
                                    has invited you to join this Giving Group.
                                    </Header>
                                    <p>Join this group to show your support and connect with other group members.</p>
                                </div>
                                {isAuthenticated ? (<div className="giving_group_btn">
                                    <Button className="white-btn-round_join_group" onClick={this.handleAcceptInvite}>Join group</Button>
                                </div>) :
                                (<div className="giving_group_btn"><Link route={`/users/login?returnTo=/groups/${slug}&invitationType=groupInvite&sourceId=${step}`}>
                                    <Button
                                        className="white-btn-round_join_group"
                                    >
                                        Join group
                                    </Button>
                                </Link></div>)}
                            </Segment>
                        </Container>
                    </div>
                )}
                <div className="top-breadcrumb">
                    <BreadcrumbDetails
                        pathDetails={pathArr}
                    />
                </div>
                <div className="GivingGroupProfileWapper">
                    <Container>
                        <div className="ch_headerImage greenBg greenBgnew" />
                        <Grid.Row>
                            <Grid>
                                <Grid.Column mobile={16} tablet={10} computer={11}>
                                    <Grid.Row>
                                        <Grid>
                                            <ProfileTitle
                                                avatar={avatar}
                                                type={type}
                                                causes={causes}
                                                following={liked}
                                                location={location}
                                                name={name}
                                                profileId={profileId}
                                            >
                                                <ProfilePageHead
                                                    beneficiariesCount={beneficiariesCount}
                                                    pageDetails={groupDetails}
                                                    dispatch={dispatch}
                                                    hasActiveMatch={hasActiveMatch}
                                                    inviteToken={step}
                                                />
                                            </ProfileTitle>
                                        </Grid>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column mobile={16}>
                                            <Responsive minWidth={320} maxWidth={767}>
                                                <GroupRightColumnList
                                                    activeMatch={activeMatch}
                                                    type={type}
                                                    hasActiveMatch={hasActiveMatch}
                                                    matchHistory={matchHistory}
                                                />
                                            </Responsive>
                                        </Grid.Column>
                                        <Divider className="mt-2 mobile_border" />
                                        <Grid.Column mobile={16} tablet={16} computer={16} className="ch_paragraph">
                                            <GroupAdmins />
                                        </Grid.Column>
                                        <Divider />
                                    </Grid.Row>
                                    <AboutGroup />
                                    <ProfileDetails />
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={5}>
                                    <Responsive minWidth={767}>
                                        <GroupRightColumnList
                                            activeMatch={activeMatch}
                                            type={type}
                                            hasActiveMatch={hasActiveMatch}
                                            matchHistory={matchHistory}
                                        />
                                    </Responsive>
                                </Grid.Column>
                            </Grid>
                        </Grid.Row>
                    </Container>
                </div>
            </Fragment>
        );
    }
}

GroupProfileWrapper.defaultProps = {
    currentUser: {
        id: '',
    },
    dispatch: () => { },
    groupBeneficiaries: {
        data: [],
    },
    groupDetails: {
        attributes: {
            activeMatch: {},
            avatar: '',
            causes: [],
            hasActiveMatch: false,
            liked: false,
            location: '',
            name: '',
        },
        id: '',
        type: '',
    },
    groupInviteDetails: {
        attributes: {},
        id: '',
    },
    groupMatchingHistory: {
        data: [],
    },
    isAuthenticated: false
};

GroupProfileWrapper.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    dispatch: func,
    groupBeneficiaries: PropTypes.shape({
        data: array,
    }),
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            activeMatch: PropTypes.shape({}),
            avatar: string,
            causes: array,
            hasActiveMatch: bool,
            liked: bool,
            location: string,
            name: string,
        }),
        id: string,
        type: string,
    }),
    groupInviteDetails: PropTypes.shape({
        attributes: PropTypes.shape({}),
        id: string,
    }),
    groupMatchingHistory: PropTypes.shape({
        data: array,
    }),
    isAuthenticated: bool,
};

function mapStateToProps(state) {
    return {
        groupBeneficiaries: state.group.groupBeneficiaries,
        groupDetails: state.group.groupDetails,
        groupInviteDetails: state.group.groupInviteDetails,
        groupMatchingHistory: state.group.groupMatchingHistory,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

const connectedComponent = (connect(mapStateToProps)(GroupProfileWrapper));
export {
    connectedComponent as default,
    GroupProfileWrapper,
    mapStateToProps,
};
