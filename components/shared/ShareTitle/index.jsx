import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    array,
    bool,
    string,
    PropTypes,
} from 'prop-types';
import {
    Grid,
    Image,
    Header,
} from 'semantic-ui-react';

import ShareProfile from '../ShareProfile';

class ProfileDetails extends React.Component {

    render() {
        const {
            charityDetails: {
                attributes: {
                    avatar,
                    beneficiaryType,
                    causes,
                    following,
                    location,
                    name,
                },
                id: profileId,
                type,
            },
        } = this.props;
        let getCauses = null;

        if (!_isEmpty(causes)) {
            getCauses = causes.map((cause) => (
                <span data-test="Charity_CharityDetails_causes" className="badge">
                    {cause.display_name}
                </span>
            ));
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
                            {beneficiaryType}
                        </Header>
                        <Header as="h3">
                            {name}
                            <br />
                        </Header>
                        <Header as="p">
                            {location}
                        </Header>
                        <div className="ch_badge-group">
                            {getCauses}
                        </div>
                        <div className="ch_share">
                            <ShareProfile
                                liked={following}
                                profileId={profileId}
                                type={type}
                                name={name}
                            />
                        </div>
                    </div>
                </Grid.Column>
            </Fragment>
        );
    }
}

ProfileDetails.defaultProps = {
    charityDetails: {
        attributes: {
            avatar: '',
            beneficiaryType: '',
            causes: [],
            following: false,
            location: '',
            name: '',
            slug: '',
        },
        id: '',
        type: '',
    },
};

ProfileDetails.propTypes = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            beneficiaryType: string,
            causes: array,
            following: bool,
            location: string,
            name: string,
            slug: string,
        }),
        id: string,
        type: string,
    }),
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
    };
}

const connectedComponent = connect(mapStateToProps)(ProfileDetails);
export {
    connectedComponent as default,
    ProfileDetails,
    mapStateToProps,
};
