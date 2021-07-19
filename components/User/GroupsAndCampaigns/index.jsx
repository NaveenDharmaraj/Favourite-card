import React, { Fragment } from 'react';
import {
    Container,
    Grid,
    Header,
    Image,
    Button,
    Divider,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';
import {
    bool,
} from 'prop-types';

import {
    getInitalGivingGroupsAndCampaigns,
} from '../../../actions/user';
import {
    getUserProfileBasic,
} from '../../../actions/userProfile';
import { Link } from '../../../routes';
import PlaceholderGrid from '../../shared/PlaceHolder';
import noDataImgCampain from '../../../static/images/campaignprofile_nodata_illustration.png';
import noDataggManage from '../../../static/images/givinggroupsyoumanage_nodata_illustration.png';
import noDataggJoin from '../../../static/images/givinggroupsyoujoined_nodata_illustration.png';
import { createGivingGroupFlowSteps } from '../../../helpers/createGrouputils';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';

import GroupsAndCampaignsList from './GroupsAndCampaignsList';

const { publicRuntimeConfig } = getConfig();

const {
    HELP_CENTRE_URL,
} = publicRuntimeConfig;

class GroupsAndCampaigns extends React.Component {
    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getInitalGivingGroupsAndCampaigns(dispatch, currentUser.id);
        getUserProfileBasic(dispatch, currentUser.attributes.email, currentUser.id, currentUser.id);
    }

    renderList(showLoader, type, typeData) {
        const {
            dispatch,
            displayError,
            leaveButtonLoader,
            closeLeaveModal,
        } = this.props;
        if (showLoader) {
            return (
                <PlaceholderGrid row={2} column={3} />
            );
        } if (!_.isEmpty(typeData) && !_.isEmpty(typeData.data)
            && typeData.data.length > 0) {
            return (
                <GroupsAndCampaignsList
                    listingType={type}
                    displayData={typeData}
                    dispatch={dispatch}
                    errorMessage={displayError}
                    closeLeaveModal={closeLeaveModal}
                    leaveButtonLoader={leaveButtonLoader}
                />
            );
        } if (!_.isEmpty(typeData) && _.isEmpty(typeData.data)) {
            let data = '';
            switch (type) {
                case 'administeredGroups':
                    data = (
                        <div className="ggManage noData mt-1 mb-2">
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <Image src={noDataggManage} className="noDataLeftImg" />
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <div className="givingGroupNoDataContent">
                                            <Header as="h4">
                                                <Header.Content>
                                                    Groups you manage will appear here
                                                </Header.Content>
                                            </Header>
                                            <div>
                                                <Link route={`/groups/step/one`}>
                                                    <Button className="success-btn-rounded-def">Create a Giving Group</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    );
                    break;
                case 'groupsWithMemberships':
                    data = (
                        <div className="ggJoin noData mt-1 mb-2">
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <Image src={noDataggJoin} className="noDataLeftImg" />
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <div className="givingGroupNoDataContent">
                                            <Header as="h4">
                                                <Header.Content>
                                                    Groups you've joined will appear here
                                                </Header.Content>
                                            </Header>
                                            <div>
                                                <Link route="/search?result_type=Group" passHref>
                                                    <Button className="white-btn-rounded-def">Find a Giving Group</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    );
                    break;
                case 'administeredCampaigns':
                    data = (
                        <div className="givingGroup noData mt-1 mb-2">
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <Image src={noDataImgCampain} className="noDataLeftImg" />
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <div className="givingGroupNoDataContent">
                                            <Header as="h4">
                                                <Header.Content>
                                                    Support this Campaign by creating a Giving Group
                                                    <Header.Subheader>
                                                        A Giving Group is like a fundraising page where multiple people can combine forces, pool or raise money, and support causes together.
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Header>
                                            <div>
                                                <Link route={`/groups/step/one`}>
                                                    <Button className="success-btn-rounded-def">Create a Giving Group</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    );
                    break;
                default:
                    break;
            }
            return data;
        }
        return null;
    }

    render() {
        const {
            administeredGroups,
            administeredCampaigns,
            groupsWithMemberships,
            userProfileBasicData,
            showloaderForAdministeredGroups,
            showloaderForMemberGroups,
            showloaderForCampaignsAdmins,
        } = this.props;
        let givingGroupsMemberVisible = 0;
        let givingGroupsManageVisible = 0;
        if (!_.isEmpty(userProfileBasicData) && userProfileBasicData.data) {
            givingGroupsMemberVisible = userProfileBasicData.data[0].attributes.giving_group_member_visibility;
            givingGroupsManageVisible = userProfileBasicData.data[0].attributes.giving_group_manage_visibility;
        }
        const memberPrivacyColumn = 'giving_group_member_visibility';
        const managePrivacyColumn = 'giving_group_manage_visibility';
        return (
            <Container>
                <div className="grpcampHeader">
                    <div className="grpcampBanner">
                        <div className="grpcampBannerContainer"> 
                            <div className="grpcampBannerTxt">
                                <Header as="h3" icon>
                                    Give together
                                </Header>
                                <Header.Subheader>
                                        With a
                                    <span className="semi_Giving"> Giving Group</span>
                                        , multiple people can combine forces, pool or raise money together.
                                </Header.Subheader>
                                <p className="registered">
                                        Money raised in a Giving Group goes towards supporting one or more
                                        &nbsp;
                                    <span className="semi_Giving">
                                        registered Canadian charities
                                    </span>
                                    &nbsp;
                                    of your choice.
                                </p>
                                
                                <div className="Create_wrapper">
                                    <Link route={createGivingGroupFlowSteps.stepOne}>
                                        <Button fluid className="success-btn-rounded-def">Create a new Giving Group</Button>
                                    </Link>
                                    <p className="how_Giving_Groups_work">
                                    Or,&nbsp;
                                        <a href={`${HELP_CENTRE_URL}article/147-what-is-a-giving-group`}>
                                            learn more
                                        </a>
                                        &nbsp;
                                        about how Giving Groups work
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* <div className="grpcampSearch">
                        <div className="grpcampSearchContainer">
                            <Input icon='search' placeholder='Search your Giving Groups & Campaigns' fluid/>
                        </div>
                    </div> */}
                </div>
                <div className=" mt-2 pb-2 tabHeader">
                    <Header>Giving Groups you manage</Header>
                    <ProfilePrivacySettings
                        columnName={managePrivacyColumn}
                        columnValue={givingGroupsManageVisible}
                    />
                </div>
                <div className="pt-1 pb-3">
                    {this.renderList(showloaderForAdministeredGroups, 'administeredGroups', administeredGroups)}
                </div>
                <Divider />
                <div className=" mt-2 pb-2 tabHeader">
                    <Header>Giving Groups you have joined</Header>
                    <ProfilePrivacySettings
                        columnName={memberPrivacyColumn}
                        columnValue={givingGroupsMemberVisible}
                    />
                </div>
                <div className="pt-1 pb-3">
                    {this.renderList(showloaderForMemberGroups, 'groupsWithMemberships', groupsWithMemberships)}
                </div>
                <Divider />
                {administeredCampaigns && administeredCampaigns.data && (administeredCampaigns.data.length > 0 ?
                    (
                        <Fragment>
                            <div className="pt-2 pb-2">
                                <p className="bold font-s-16">Campaigns you manage</p>
                            </div>
                            <div className="pt-1 pb-3">
                                {this.renderList(showloaderForCampaignsAdmins, 'administeredCampaigns', administeredCampaigns)}
                            </div>
                        </Fragment>
                    ) : null)
                }
            </Container>
        );
    }
}

GroupsAndCampaigns.defaultProps = {
    showloaderForAdministeredGroups: true,
    showloaderForCampaignsAdmins: true,
    showloaderForMemberGroups: true,
};

GroupsAndCampaigns.propTypes = {
    showloaderForAdministeredGroups: bool,
    showloaderForCampaignsAdmins: bool,
    showloaderForMemberGroups: bool,
};

function mapStateToProps(state) {
    return {
        administeredCampaigns: state.user.administeredCampaigns,
        administeredGroups: state.user.administeredGroups,
        closeLeaveModal: state.user.closeLeaveModal,
        currentUser: state.user.info,
        displayError: state.user.leaveErrorMessage,
        groupsWithMemberships: state.user.groupsWithMemberships,
        leaveButtonLoader: state.user.leaveButtonLoader,
        showloaderForAdministeredGroups: state.user.showloaderForAdministeredGroups,
        showloaderForCampaignsAdmins: state.user.showloaderForCampaignsAdmins,
        showloaderForMemberGroups: state.user.showloaderForMemberGroups,
        userProfileBasicData: state.userProfile.userProfileBasicData,
    };
}

export default (connect(mapStateToProps)(GroupsAndCampaigns));
