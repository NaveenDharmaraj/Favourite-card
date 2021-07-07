
import React from 'react';
import { Header, Button } from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';

import { Link } from '../../routes';
import { withTranslation } from '../../i18n';

const CampaignSupporters = (props) => {
    const {
        peopleInCampaign,
        groupsCount,
        slug,
        t: formatMessage,
    } = props;
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header className="headingColor" as="h4">{formatMessage('campaignProfile:campaignSupporters')}</Header>
                <div className="boxcardWrapper">
                    <div className="boxcard">
                        <i aria-hidden="true" className="privacy icon" />
                        <Header as="h2">{peopleInCampaign}</Header>
                        <p>{formatMessage('campaignProfile:people')}</p>
                    </div>
                    <div className="boxcard">
                        <i aria-hidden="true" className="group icon" />
                        <Header as="h2">{groupsCount}</Header>
                        <p>{formatMessage('campaignProfile:givingGroup')}</p>
                    </div>
                </div>
                <Header as="h4" className="headingColor">{formatMessage('campaignProfile:supportCampaign')}</Header>
                <p>{formatMessage('campaignProfile:givingGroupPeople')}</p>
                <Link route={`/campaigns/${slug}/step/one`}>
                    <Button
                        className="success-btn-rounded-def medium btnboxWidth"
                    >
                        {formatMessage('campaignProfile:createGroupBtn')}
                    </Button>
                </Link>
            </div>
        </div>
    )
}

CampaignSupporters.defaultProps = {
    groupsCount: '',
    peopleInCampaign: '',
    slug: '',
    t: () => { },
}

// eslint-disable-next-line react/no-typos
CampaignSupporters.PropTypes = {
    groupsCount: PropTypes.string,
    peopleInCampaign: PropTypes.string,
    slug: PropTypes.string,
    t: PropTypes.func,
}

export default withTranslation('campaignProfile')(CampaignSupporters);
