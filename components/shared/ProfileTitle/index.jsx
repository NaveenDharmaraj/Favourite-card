import React, { Fragment } from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
    Image,
    Header,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
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
    } = props;
    let causesList = null;
    if (!_isEmpty(causes)) {
        causesList = causes.map((cause) => (
            <span data-test="Charity_CharityDetails_causes" className="badge">
                {cause.display_name}
            </span>
        ));
    }
    let profileType = type;
    if (typeof beneficiaryType !== 'undefined' && !_isEmpty(beneficiaryType)) {
        profileType = beneficiaryType;
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
            <Grid.Column mobile={16} tablet={11} computer={11} className="">
                <div className="ch_profileDetails">
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
    type: '',
    causes: '',
    following: false,
    location: '',
    name: '',
    profileId: '',
    beneficiaryType: '',
};

ProfileTitle.propTypes = {
    avatar: PropTypes.string,
    type: PropTypes.string,
    causes: PropTypes.string,
    following: PropTypes.bool,
    location: PropTypes.string,
    name: PropTypes.string,
    profileId: PropTypes.string,
    beneficiaryType: PropTypes.string,
};

export default ProfileTitle;  
