
import React from 'react';
import { Header, Button } from 'semantic-ui-react';
import getConfig from 'next/config';

import { withTranslation } from '../../i18n';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const CampaignSupporters = (props) => {
    const {
        supportingDetails: {
            attributes: {
                peopleInCampaign,
                groupsCount,
                slug,
            }
        },
        t: formatMessage,
    } = props;
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header className="headingColor" as="h4">{formatMessage('campaignProfile:campaignSupporters')}</Header>
                <div className="boxcard mr-1">
                    <i aria-hidden="true" className="privacy icon" />
                    <Header as="h2">{peopleInCampaign}</Header>
                    <p>{formatMessage('campaignProfile:people')}</p>
                </div>
                <div className="boxcard">
                    <i aria-hidden="true" className="group icon" />
                    <Header as="h2">{groupsCount}</Header>
                    <p>{formatMessage('campaignProfile:givingGroup')}</p>
                </div>
                <Header as="h4" className="headingColor">{formatMessage('campaignProfile:supportCampaign')}</Header>
                <p>{formatMessage('campaignProfile:givingGroupPeople')}</p>
                <a href={`${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/step/one`}>
                    <Button className="success-btn-rounded-def medium btnboxWidth">{formatMessage('campaignProfile:createGroupBtn')}</Button>
                </a>
            </div>
        </div>
    )
}

export default withTranslation('campaignProfile')(CampaignSupporters);
