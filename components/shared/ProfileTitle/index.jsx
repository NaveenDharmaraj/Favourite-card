import React, { Fragment } from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
    Image,
    Header,
} from 'semantic-ui-react';
import {
    PropTypes,
    func,
} from 'prop-types';

import { withTranslation } from '../../../i18n';
import ShareProfile from '../ShareProfile';

function ProfileTitle(props) {
    const {
        avatar,
        type,
        causes,
        following,
        location,
        name,
        profileId,
        children,
        beneficiaryType,
        t: formatMessage,
    } = props;
    let causesList = null;
    if (!_isEmpty(causes)) {
        causesList = causes.map((cause) => (
            <span data-test="Charity_CharityDetails_causes" className="badge">
                {cause.display_name}
            </span>
        ));
    }
    let profileType = '';
    let isCharityPage = false;
    if (typeof beneficiaryType !== 'undefined' && !_isEmpty(beneficiaryType)) {
        profileType = beneficiaryType;
        isCharityPage = true;
    } else if (type === 'groups') {
        profileType = formatMessage('common:givingGroup');
    } else if (type === 'campaigns') {
        profileType = formatMessage('common:campaigns');
    }

    return (
        <Fragment>
            <Grid.Column mobile={16} tablet={4} computer={4} className="ch_profileWrap">
                <div className="ch_profileImage">
                    <Image
                        src={avatar}
                    />
                </div>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={12} computer={12}>
                <div className={`ch_profileDetails ${!isCharityPage ? 'groupProfileColor' : ''}`}>
                    <Header as="h5">
                        {profileType}
                    </Header>
                    <Header as="h3">
                        {name}
                        <br />
                    </Header>
                    <Header as="p">
                        {location}
                    </Header>
                    <div className="ch_badge-group">
                        {causesList}
                    </div>
                    <div className="ch_share">
                        <ShareProfile
                            liked={following}
                            profileId={profileId}
                            type={type}
                            name={name}
                            children={children}
                        />
                    </div>
                </div>
            </Grid.Column>
        </Fragment>
    );
}

ProfileTitle.defaultProps = {
    avatar: '',
    beneficiaryType: '',
    causes: [],
    following: false,
    location: '',
    name: '',
    profileId: '',
    t: () => {},
    type: '',
};

ProfileTitle.propTypes = {
    avatar: PropTypes.string,
    beneficiaryType: PropTypes.string,
    causes: PropTypes.arrayOf(
        PropTypes.shape({}),
    ),
    following: PropTypes.bool,
    location: PropTypes.string,
    name: PropTypes.string,
    profileId: PropTypes.string,
    t: func,
    type: PropTypes.string,
};

export default withTranslation('common')(ProfileTitle);
