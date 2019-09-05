import React from 'react';
import {
    Container,
    Header,
    Button,
    Input,
    Divider,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getInitalGivingGroupsAndCampaigns,
} from '../../../actions/user';
import { Link } from '../../../routes';
import PlaceholderGrid from '../../shared/PlaceHolder';

import GroupsAndCampaignsList from './GroupsAndCampaignsList';

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
                showloaderForCampaigns,
                showloaderForAdministeredGroups,
                showloaderForMemberGroups,
            });
        }
    }

    renderList(showLoader, type, typeData) {
        const {
            dispatch,
            displayError,
        } = this.props;
        if (showLoader) {
            return (
                <PlaceholderGrid row={2} column={3} />
            );
        } else if (!_.isEmpty(typeData) && !_.isEmpty(typeData.data)
                    && typeData.data.length > 0) {
            return (<GroupsAndCampaignsList
                listingType={type}
                displayData={typeData}
                dispatch={dispatch}
                errorMessage={displayError}
            />);
        } else if(!_.isEmpty(typeData) && _.isEmpty(typeData.data)){
            return "No data";
        }

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
                                <Link route='/groups/new'>
                                    <Button fluid className="success-btn-rounded-def">Create a new Group</Button>
                                </Link>
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
                    {/* { (showloaderForAdministeredGroups) ? <PlaceholderGrid row={2} column={3} /> : (
                        <GroupsAndCampaignsList
                            listingType='administeredGroups'
                            displayData={administeredGroups}
                            dispatch={dispatch}
                            errorMessage={displayError}
                        />
                    )} */}
                </div>
                <Divider />
                <div className="pt-2 pb-2">
                    <p className="bold font-s-16">Giving Groups you have joined</p>
                </div>
                <div className="pt-1 pb-3">
                    {this.renderList(showloaderForMemberGroups, 'groupsWithMemberships', groupsWithMemberships)}
                </div>
                <Divider />
                <div className="pt-2 pb-2">
                    <p className="bold font-s-16">Campaigns you manage</p>
                </div>
                <div className="pt-1 pb-3">
                    {this.renderList(showloaderForCampaigns, 'administeredCampaigns', administeredCampaigns)}
                </div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        administeredCampaigns: state.user.administeredCampaigns,
        administeredGroups: state.user.administeredGroups,
        currentUser: state.user.info,
        displayError: state.user.leaveErrorMessage,
        groupsWithMemberships: state.user.groupsWithMemberships,
    };
}

export default (connect(mapStateToProps)(GroupsAndCampaigns));
