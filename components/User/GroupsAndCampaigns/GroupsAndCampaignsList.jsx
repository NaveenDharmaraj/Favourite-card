import React from 'react';
import _ from 'lodash';
import {
    Grid,
    Icon,
    Button,
} from 'semantic-ui-react';

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
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        this.setState({
            loader: true,
        });
        getGroupsAndCampaigns(dispatch, displayData.nextLink, type, true, displayData.data);
    }

    renderSeeMore(type) {
        const {
            displayData,
        } = this.props;
        if (!_.isEmpty(displayData) && !_.isEmpty(displayData.nextLink)) {
            const {
                loader,
            } = this.state;
            const content = (
                <div className="text-centre">
                    <Button
                        className="blue-bordr-btn-round-def"
                        onClick={() => this.handleSeeMore(type)}
                        loading={!!loader}
                        disabled={!!loader}
                        content="See More"
                    />
                </div>
            );
            return content;
        }
        return null;
    }

    renderCount() {
        const {
            displayData,
        } = this.props;
        if (!_.isEmpty(displayData) && displayData.data && _.size(displayData.data) > 0) {
            const countText = `Showing ${_.size(displayData.data)} of ${displayData.dataCount}`;
            return (
                <div className="result">{countText}</div>
            );
        }
        return null;
    }

    render() {
        const {
            listingType,
            displayData,
            errorMessage,
            leaveButtonLoader,
            closeLeaveModal,
        } = this.props;
        let groupsAndCampaignsList = 'No Data';
        if (displayData && displayData.data && _.size(displayData.data) > 0) {
            groupsAndCampaignsList = displayData.data.map((group, index) => {
                return (
                    <GroupsAndCampaignsCard
                        listingType={listingType}
                        data={group}
                        errorMessage={errorMessage}
                        leaveButtonLoader={leaveButtonLoader}
                        closeLeaveModal={closeLeaveModal}
                        parentLeaveGroup={this.callLeaveGroup}
                    />
                );
            });
        }
        return (
            <div className="pb-1">
                <Grid stackable doubling columns={3}>
                    <Grid.Row>
                        {groupsAndCampaignsList}
                    </Grid.Row>
                </Grid>
                <div className="text-center mt-2-xs">
                    {this.renderSeeMore(listingType)}
                    {this.renderCount()}
                </div>
            </div>

        );
    }
}
export default GroupsAndCampaignsList;
