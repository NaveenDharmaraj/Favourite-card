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
    getInitalGivingGroupsAndCampaigns,
} from '../../../actions/user';
import { Link } from '../../../routes';
import PlaceholderGrid from '../../shared/PlaceHolder';
import noDataImgCampain from '../../../static/images/campaignprofile_nodata_illustration.png';
import noDataggManage from '../../../static/images/givinggroupsyoumanage_nodata_illustration.png';
import noDataggJoin from '../../../static/images/givinggroupsyoujoined_nodata_illustration.png';

import GroupsAndCampaignsList from './GroupsAndCampaignsList';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class GroupsAndCampaigns extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showloaderForAdministeredGroups: !props.administeredGroups,
            showloaderForCampaigns: !props.administeredCampaigns,
            showloaderForMemberGroups: !props.groupsWithMemberships,
        };
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getInitalGivingGroupsAndCampaigns(dispatch, currentUser.id);
    }

    componentDidUpdate(prevProps) {
        const {
            administeredCampaigns,
            administeredGroups,
            groupsWithMemberships,
        } = this.props;
        let {
            showloaderForAdministeredGroups,
            showloaderForCampaigns,
            showloaderForMemberGroups,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(administeredCampaigns, prevProps.administeredCampaigns)) {
                showloaderForCampaigns = false;
            }
            if (!_.isEqual(administeredGroups, prevProps.administeredGroups)) {
                showloaderForAdministeredGroups = false;
            }
            if (!_.isEqual(groupsWithMemberships, prevProps.groupsWithMemberships)) {
                showloaderForMemberGroups = false;
            }
            this.setState({
                showloaderForAdministeredGroups,
                showloaderForCampaigns,
                showloaderForMemberGroups,
            });
        }
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
                                        <Image src={noDataggManage} className="noDataLeftImg"/>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <div className="givingGroupNoDataContent">
                                            <Header as="h4">
                                                <Header.Content>
                                                Groups you manage will appear here
                                                </Header.Content>
                                            </Header>
                                            <div>
                                                <a href={`${RAILS_APP_URL_ORIGIN}/groups/new`}>
                                                    <Button className="success-btn-rounded-def">Create a Giving Group</Button>
                                                </a>
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
                                                <Link route="/search?result_type=Group">
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
                                                <a href={`${RAILS_APP_URL_ORIGIN}/groups/new`}>
                                                    <Button className="success-btn-rounded-def">Create a Giving Group</Button>
                                                </a>
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
            showloaderForCampaigns,
            showloaderForAdministeredGroups,
            showloaderForMemberGroups,
        } = this.state;
        const {
            administeredGroups,
            administeredCampaigns,
            groupsWithMemberships,
        } = this.props;
        return (
            <Container>
                <div className="grpcampHeader">
                    <div className="grpcampBanner">
                        <div className="grpcampBannerContainer">
                            <div className="grpcampBannerTxt">
                                <Header as="h3" icon>
                                    Giving Groups & Campaigns
                                    <Header.Subheader>
                                    You can give more as a part of group, and you can raise more when it’s easy to manage.
                                    </Header.Subheader>
                                </Header>
                                <a href={`${RAILS_APP_URL_ORIGIN}/groups/new`}>
                                    <Button fluid className="success-btn-rounded-def">Create a new Group</Button>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* <div className="grpcampSearch">
                        <div className="grpcampSearchContainer">
                            <Input icon='search' placeholder='Search your Giving Groups & Campaigns' fluid/>
                        </div>
                    </div> */}
                </div>
                <div className="pt-2 pb-2">
                    <p className="bold font-s-16">Giving Groups you manage</p>
                </div>
                <div className="pt-1 pb-3">
                    {this.renderList(showloaderForAdministeredGroups, 'administeredGroups', administeredGroups)}
                </div>
                <Divider />
                <div className="pt-2 pb-2">
                    <p className="bold font-s-16">Giving Groups you have joined</p>
                </div>
                <div className="pt-1 pb-3">
                    {this.renderList(showloaderForMemberGroups, 'groupsWithMemberships', groupsWithMemberships)}
                </div>
                <Divider />
                {(administeredCampaigns && administeredCampaigns.dataCount && administeredCampaigns.dataCount > 0) ? (
                    <Fragment>
                        <div className="pt-2 pb-2">
                            <p className="bold font-s-16">Campaigns you manage</p>
                        </div>
                        <div className="pt-1 pb-3">
                            {this.renderList(showloaderForCampaigns, 'administeredCampaigns', administeredCampaigns)}
                        </div>
                    </Fragment>
                ) : null

                }
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        administeredCampaigns: state.user.administeredCampaigns,
        administeredGroups: state.user.administeredGroups,
        closeLeaveModal: state.user.closeLeaveModal,
        currentUser: state.user.info,
        displayError: state.user.leaveErrorMessage,
        groupsWithMemberships: state.user.groupsWithMemberships,
        leaveButtonLoader: state.user.leaveButtonLoader,
    };
}

export default (connect(mapStateToProps)(GroupsAndCampaigns));
