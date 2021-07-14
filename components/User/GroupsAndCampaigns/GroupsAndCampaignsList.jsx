import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Button,
} from 'semantic-ui-react';

import {
    getGroupsAndCampaigns,
    leaveGroup,
} from '../../../actions/user';
import {
    getLocation,
} from '../../../helpers/profiles/utils';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import ProfileCard from '../../shared/ProfileCard';

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

    getGroupsAndCampaignsList() {
        const {
            listingType,
            displayData,
            leaveButtonLoader,
            errorMessage,
            closeLeaveModal,
        } = this.props;
        const groupsAndCampaignsList = [];
        if (displayData && displayData.data && _.size(displayData.data) > 0) {
            displayData.data.map((group) => {
                groupsAndCampaignsList.push(
                    <ProfileCard
                        avatar={group.attributes.avatar}
                        type={listingType === ('administeredCampaigns') ? 'Campaign' : 'Giving Group'}
                        name={group.attributes.name}
                        causes={group.attributes.groupType}
                        isMyProfile
                        isCampaign={listingType === ('administeredCampaigns')}
                        Profiletype="group"
                        location={getLocation(group.attributes.city, group.attributes.province)}
                        slug={group.attributes.slug}
                        isPreviewMode={false}
                        canEdit={listingType !== 'groupsWithMemberships'}
                        totalMoneyRaised={group.attributes.totalMoneyRaised}
                        showLeave={listingType === 'groupsWithMemberships'}
                        entityId={group.id}
                        callLeaveGroup={this.callLeaveGroup}
                        leaveButtonLoader={leaveButtonLoader}
                        errorMessage={errorMessage}
                        closeLeaveModal={closeLeaveModal}
                    />,
                );
            });
        }
        return groupsAndCampaignsList;
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
                        className="blue-bordr-btn-round-def mb-1 seeMoreBtn"
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
        } = this.props;
        return (
            <Fragment>
                <div className="cardwrap">
                    {this.getGroupsAndCampaignsList()}
                </div>
                <div className="text-center mt-2-xs">
                    {this.renderSeeMore(listingType)}
                    {this.renderCount()}
                </div>
            </Fragment>

        );
    }
}
export default GroupsAndCampaignsList;
