
import React from 'react';
import { Header } from 'semantic-ui-react';
import ProfilePageHead from '../../components/shared/ProfilePageHead';

const CampaignSupporters = (props) => {
    const {
        supportingDetails,
        supportingDetails: {
            attributes: {
                peopleInCampaign,
                groupsCount,
            }
        }
    } = props;
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header className="headingColor" as="h4">Campaign supporters</Header>
                <div className="boxcard mr-1">
                    <i aria-hidden="true" className="privacy icon" />
                    <Header as="h2">{peopleInCampaign}</Header>
                    <p>People</p>
                </div>
                <div className="boxcard">
                    <i aria-hidden="true" className="group icon"/>
                    <Header as="h2">{groupsCount}</Header>
                    <p>Giving Groups</p>
                </div>
                <Header as="h4" className="headingColor">Support this Campaign by starting a Giving Group</Header>
                <p>Giving Groups bring multiple people together to give. You can pool or raise money to support causes or charities together. </p>
                <ProfilePageHead
                    pageDetails={supportingDetails}
                    blockButtonType="create"
                />
            </div>
        </div>
    )
}

export default CampaignSupporters;
