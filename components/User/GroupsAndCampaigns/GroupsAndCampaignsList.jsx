import React from 'react';
import {
    Grid,
    Icon,
    Button,
} from 'semantic-ui-react'
import {
    getGroupsAndCampaigns,
    leaveGroup,
} from '../../../actions/user';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import GroupsAndCampaignsCard from './GroupAndCampaingsCard';

class GroupsAndCampaignsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
        };
        this.handleSeeMore = this.handleSeeMore.bind(this);
        this.callLeaveGroup = this.callLeaveGroup.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.displayData, prevProps.displayData)) {
            this.setState({
                loader: false,
            });
        }
    }

    callLeaveGroup(deleteId) {
        const {
            listingType,
            displayData,
            dispatch,
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        const item = _.find(displayData.data, { id: deleteId });
        if (item) {
            leaveGroup(dispatch, item, displayData, listingType);
        }
    }

    handleSeeMore(type) {
        const {
            dispatch,
            displayData,
        } = this.props
        dismissAllUxCritialErrors(dispatch);
        this.setState({
            loader: true,
        });
        getGroupsAndCampaigns(dispatch, displayData.nextLink, type, true, displayData.data);
    }

    renderSeeMore(type) {
        const {
            loader,
        } = this.state;
        const content = loader ? (
            <Icon loading color="black" name="spinner" />
        ) : (
            <div className="text-centre">
                <Button
                    onClick={()=>this.handleSeeMore(type)}
                    basic
                    color="blue"
                    content="See more"
                />
            </div>
        );
        return content;
    }

    render() {
        const {
            listingType,
            displayData,
            errorMessage,
        } = this.props;
        const{
            showModal
        } = this.state;
        let groupsAndCampaignsList = 'No Data';
        if (displayData && displayData.data && _.size(displayData.data) > 0) {
            groupsAndCampaignsList = displayData.data.map((group, index) => {
                return (
                    <GroupsAndCampaignsCard
                        listingType = {listingType}
                        data = {group}
                        errorMessage = {errorMessage}
                        parentLeaveGroup = {this.callLeaveGroup}
                    />
                )

            });
        }
        return (
            <div className="pb-1">
                <Grid  columns='equal' stackable doubling columns={3}>
                    <Grid.Row>
                        {groupsAndCampaignsList}
                    </Grid.Row>
                </Grid>
                {
                    (!_.isEmpty(displayData) && !_.isEmpty(displayData.nextLink)) ?
                        this.renderSeeMore(listingType, displayData.nextLink) : null
                }
            </div>

        );
    }
}
export default GroupsAndCampaignsList;
