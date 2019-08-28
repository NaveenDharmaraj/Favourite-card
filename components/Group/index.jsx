import React from 'react';
import { connect } from 'react-redux';
import {
    arrayOf,
    PropTypes,
    string,
    number,
    func,
} from 'prop-types';

import BreadcrumbDetails from '../shared/BreadCrumbs';

import GroupDetails from './GroupDetails';
import DonationDetails from './DonationDetails';
import ProfileDetails from './ProfileDetails';

const GroupProfileWrapper = (props) => {
    const {
        groupDetails: {
            attributes: {
                name,
            },
        },
    } = props;
    const pathArr = [
        'Explore',
        'Giving Groups',
        name,
    ];
    return (
        <React.Fragment>
            <div className="top-breadcrumb">
                <BreadcrumbDetails
                    pathDetails={pathArr}
                />
            </div>
            <div className="profile-header-image campaign" />
            <GroupDetails />
            <div className="profile-info-wraper pb-3">
                <DonationDetails />
            </div>
            <div className="pb-3">
                <ProfileDetails />
            </div>
        </React.Fragment>
    );
};

GroupProfileWrapper.defaultProps = {
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            name: '',
        }),
    }),
};

GroupProfileWrapper.propTypes = {
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            name: string,
        }),
    }),
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(GroupProfileWrapper);
