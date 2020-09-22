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
    } = props;
    let route = 'charities';
    let editLink = `${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`;
    if (Profiletype === 'group') {
        route = (isCampaign) ? 'campaigns' : 'groups';
        editLink = (isCampaign) ? `${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics` : editLink;
    }
    return (
        <Card>
            <Card.Content>
                {/* <Link className="lnkChange" route={`/${route}/${slug}`} passHref> */}
                <Fragment>
                    {/* <Link className="lnkChange" route={`/${route}/${slug}`} passHref> */}
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
                        </Header>
                        <Link className="lnkChange" route={`/${route}/${slug}`} passHref>
                            <Header as="h4">{name}</Header>
                        </Link>
                        <p>{causes}</p>
                        <p>{location}</p>
                        {/* <p>Total Raised: $2,000.00</p> */}
                    </div>
                    {/* </Link> */}
                </Fragment>
                {/* </Link> */}
            </Card.Content>
        </Card>
    );
};

ProfileCard.defaultProps = {
    avatar: '',
    canEdit: false,
    causes: '',
    isCampaign: false,
    isMyProfile: false,
    isPreviewMode: false,
    location: '',
    name: '',
    Profiletype: '',
    slug: '',
    type: '',
};

ProfileCard.propTypes = {
    avatar: string,
    canEdit: bool,
    causes: string,
    isCampaign: bool,
    isMyProfile: bool,
    isPreviewMode: bool,
    location: string,
    name: string,
    Profiletype: string,
    slug: string,
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
