import React, {
    Fragment,
} from 'react';
import {
    Card,
    Header,
    Image,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { Link } from '../../../routes';
import { withTranslation } from '../../../i18n';
import {
    formatCurrency,
} from '../../../helpers/give/utils';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const ProfileCard = (props) => {
    const {
        avatar,
        type,
        name,
        causes,
        location,
        isMyProfile,
        isCampaign,
        Profiletype,
        slug,
        isPreviewMode,
        canEdit,
        totalMoneyRaised,
        isFavourite,
    } = props;
    let route = 'charities';
    const currency = 'USD';
    const language = 'en';
    let editLink = `${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`;
    if (Profiletype === 'group') {
        route = (isCampaign) ? 'campaigns' : 'groups';
        editLink = (isCampaign) ? `${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics` : editLink;
    }
    return (
        <Card>
            <Card.Content>
                <Fragment>
                    <div className="cardPrflImg">
                        <Link className="lnkChange" route={`/${route}/${slug}`} passHref>
                            <Image src={avatar} />
                        </Link>
                    </div>
                    <div className="cardcontentWrap">
                        <Header as="h6" className={`${(Profiletype === 'group' ? 'groupClr' : 'charityClr')}`}>
                            {type}
                            {(isMyProfile && (Profiletype === 'group') && !isPreviewMode && canEdit)
                            && (
                                <a className="edit" href={editLink}>Edit</a>
                            )}
                            {isFavourite && isMyProfile
                            && (
                                <i aria-hidden="true" class="heart icon" />
                            )}
                        </Header>
                        <Link className="lnkChange" route={`/${route}/${slug}`} passHref>
                            <Header as="h4">{name}</Header>
                        </Link>
                        <p>{causes}</p>
                        <p>{location}</p>
                        {!_isEmpty(totalMoneyRaised)
                        && (
                            <p>{`Total Raised: ${formatCurrency(totalMoneyRaised, language, currency)}`}</p>
                        )}
                    </div>
                </Fragment>
            </Card.Content>
        </Card>
    );
};

ProfileCard.defaultProps = {
    avatar: '',
    canEdit: false,
    causes: '',
    isCampaign: false,
    isFavourite: false,
    isMyProfile: false,
    isPreviewMode: false,
    location: '',
    name: '',
    Profiletype: '',
    slug: '',
    totalMoneyRaised: '',
    type: '',
};

ProfileCard.propTypes = {
    avatar: string,
    canEdit: bool,
    causes: string,
    isCampaign: bool,
    isFavourite: bool,
    isMyProfile: bool,
    isPreviewMode: bool,
    location: string,
    name: string,
    Profiletype: string,
    slug: string,
    totalMoneyRaised: string,
    type: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(ProfileCard));
export {
    connectedComponent as default,
    ProfileCard,
    mapStateToProps,
};
