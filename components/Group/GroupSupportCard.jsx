import React from 'react';
import {
    Grid,
    Header,
    Image,
} from 'semantic-ui-react';
import {
    string,
    bool,
    func,
} from 'prop-types';

import { Link } from '../../routes';
import { withTranslation } from '../../i18n';

const GroupSupportCard = (props) => {
    const {
        avatar,
        name,
        slug,
        isCampaign,
        t: formatMessage,
    } = props;
    const type = isCampaign ? 'campaigns' : 'charities';
    return (
        <Link route={`/${type}/${slug}`}>
            <div className="MatchingPartnerWapper">
                <div className="h_profileMatching">
                    <Image src={avatar} className="profileImgMargin" />
                </div>
                <div className="MatchingPartner">
                    <Header as="h3">{name}</Header>
                    <p className={`textGreen ${!isCampaign ? 'orange' : ''}`}>{isCampaign ? formatMessage('common:campaigns') : formatMessage('common:charity')}</p>
                </div>
            </div>
        </Link>
    );
};

GroupSupportCard.defaultProps = {
    avatar: '',
    isCampaign: false,
    name: '',
    slug: '',
    t: () => {},
};

GroupSupportCard.propTypes = {
    avatar: string,
    isCampaign: bool,
    name: string,
    slug: string,
    t: func,
};


export default withTranslation([
    'common',
    'groupProfile',
])(GroupSupportCard);
