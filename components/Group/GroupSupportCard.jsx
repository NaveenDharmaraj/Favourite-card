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
            <div className="GivingGroupPadding">
                <Grid.Row className="MatchingPartnerWapper">
                    <Grid>
                        <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0">
                            <div className="h_profileMatching">
                                <Image src={avatar} className="profileImgMargin" />
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={13} tablet={13} computer={13}>
                            <div className="MatchingPartner">
                                <Header as="h3">{name}</Header>
                                <p className={`textGreen ${!isCampaign ? 'orange' : ''}`}>{formatMessage('groupProfile:matchingpartner')}</p>
                            </div>
                        </Grid.Column>
                    </Grid>
                </Grid.Row>
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


export default withTranslation('groupProfile')(GroupSupportCard);
