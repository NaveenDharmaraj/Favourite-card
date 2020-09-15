/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Card,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    array,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';

import {
    getUserAdminGroup,
} from '../../../actions/userProfile';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';

import ProfileCard from '../../shared/ProfileCard';
import {
    getLocation,
    getPrivacyType,
} from '../../../helpers/profiles/utils';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';

class UserAdminGroupList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.showAdminCard = this.showAdminCard.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
        } = this.props;
        getUserAdminGroup(dispatch, friendUserId, id);
    }

    showAdminCard() {
        const {
            userProfileAdminGroupData: {
                data: adminData,
            },
        } = this.props;
        const adminArray = [];
        if (!_isEmpty(adminData)) {
            adminData.map((admin) => {
                adminArray.push(
                    <ProfileCard
                        avatar={admin.attributes.avatar}
                        type="Giving Group"
                        name={admin.attributes.name}
                        causes={admin.attributes.groupType}
                        location={getLocation(admin.attributes.city, admin.attributes.province)}
                    />,
                );
            });
        }
        return adminArray;
    }

    render() {
        const {
            userProfileAdminGroupData: {
                data: adminData,
            },
            userFriendProfileData: {
                attributes: {
                    giving_group_manage_visibility,
                    profile_type,
                },
            },
            userProfileAdminGroupsLoadStatus,
        } = this.props;
        const isMyProfile = (profile_type === 'my_profile');
        const currentPrivacyType = getPrivacyType(giving_group_manage_visibility);
        return (
            <div className="userPrfl_tabSec">
                <div className="tabHeader">
                    <Header>Managed Giving Groups</Header>
                    {isMyProfile && !_isEmpty(currentPrivacyType)
                        && (
                            <ProfilePrivacySettings
                                iconName={currentPrivacyType}
                            />
                        )}
                </div>
                {!_isEmpty(adminData)
                    ? (
                        <div className="cardwrap">
                            {this.showAdminCard()}
                        </div>
                    )
                    : (
                        <div className="nodata-friendsprfl">
                    Nothing to show here yet
                        </div>
                    )}
            </div>
        );
    }
}

UserAdminGroupList.defaultProps = {
    userFriendProfileData: {
        attributes: {
            giving_group_manage_visibility: null,
            profile_type: '',
        },
    },
    userProfileAdminGroupData: {
        data: [],
    },
};

UserAdminGroupList.propTypes = {
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            giving_group_manage_visibility: number,
            profile_type: string,
        }),
    }),
    userProfileAdminGroupData: PropTypes.shape({
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileAdminGroupData: state.userProfile.userProfileAdminGroupData,
        userProfileAdminGroupsLoadStatus: state.userProfile.userProfileAdminGroupsLoadStatus,
    };
}

export default (connect(mapStateToProps)(UserAdminGroupList));
