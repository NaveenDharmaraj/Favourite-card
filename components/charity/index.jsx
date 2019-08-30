import React from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
    string,
} from 'prop-types';

import BreadcrumbDetails from '../shared/BreadCrumbs';

import UserDetails from './UserDetails';
import CharityDetails from './CharityDetails';
import ProfileDetails from './ProfileDetails';

const CharityProfileWrapper = (props) => {
    const {
        charityDetails: {
            charityDetails: {
                attributes: {
                    name,
                },
            },
        },
    } = props;
    const pathArr = [
        'Explore',
        'Charities',
        name,
    ];
    return (
        <React.Fragment>
            <div className="top-breadcrumb">
                <BreadcrumbDetails
                    pathDetails={pathArr}
                />
            </div>
            <div className="profile-header-image charity" />
            <CharityDetails />
            <UserDetails />
            <ProfileDetails />
        </React.Fragment>
    );
};


CharityProfileWrapper.defaultProps = {
    charityDetails: PropTypes.shape({
        charityDetails: PropTypes.shape({
            attributes: PropTypes.shape({
                name: '',
            }),
        }),
    }),
};

CharityProfileWrapper.propTypes = {
    charityDetails: PropTypes.shape({
        charityDetails: PropTypes.shape({
            attributes: PropTypes.shape({
                name: string,
            }),
        }),
    }),
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
    };
}

export default connect(mapStateToProps)(CharityProfileWrapper);
