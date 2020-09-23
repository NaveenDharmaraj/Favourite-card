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
    bool,
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
            userFriendProfileData: {
                attributes: {
                    profile_type,
                },
            },
            previewMode: {
                isPreviewMode,
            },
        } = this.props;
        const adminArray = [];
        // const isMyProfile = (profile_type === 'my_profile');
        if (!_isEmpty(adminData)) {
            adminData.map((admin) => {
                adminArray.push(
                    <ProfileCard
                        avatar={admin.attributes.avatar}
                        type="Giving Group"
                        name={admin.attributes.name}
                        causes={admin.attributes.groupType}
                        isMyProfile={(profile_type === 'my_profile')}
                        isCampaign={!_isEmpty(admin.attributes.is_campaign) ? admin.attributes.is_campaign : false}
                        Profiletype={!_isEmpty(admin.attributes.type) ? admin.attributes.type : 'group'}
                        location={getLocation(admin.attributes.city, admin.attributes.province)}
                        slug={admin.attributes.slug}
                        isPreviewMode={isPreviewMode}
                        canEdit
                        totalMoneyRaised={admin.attributes.totalMoneyRaised}
                    />,
                );
            });
        }
        return adminArray;
    }

    render() {
        const {
            previewMode: {
                isPreviewMode,
            },
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
        let noData = null;
        if (isMyProfile) {
            noData = <p>NO DATA MY PROFILE</p>;
        } else {
            noData = (
                <div className="nodata-friendsprfl">
                Nothing to show here yet
                </div>
            );
        }
        let dataElement = '';
        if (!_isEmpty(adminData)) {
            dataElement = (
                <div className="cardwrap">
                    {this.showAdminCard()}
                </div>
            );
        } else {
            dataElement = noData;
        }
        return (
            <div className="userPrfl_tabSec">
                <div className="tabHeader">
                    <Header>Managed Giving Groups</Header>
                    {(isMyProfile && !isPreviewMode)
                        && (
                            <ProfilePrivacySettings
                                columnName='giving_group_manage_visibility'
                                columnValue={giving_group_manage_visibility}
                                iconName={currentPrivacyType}
                            />
                        )}
                </div>
                {userProfileAdminGroupsLoadStatus
                    ? <PlaceholderGrid row={2} column={3} />
                    : dataElement
                }
            </div>
        );
    }
}

UserAdminGroupList.defaultProps = {
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            giving_group_manage_visibility: null,
            profile_type: '',
        },
    },
    userProfileAdminGroupData: {
        data: [],
    },
    userProfileAdminGroupsLoadStatus: true,
};

UserAdminGroupList.propTypes = {
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            giving_group_manage_visibility: number,
            profile_type: string,
        }),
    }),
    userProfileAdminGroupData: PropTypes.shape({
        data: array,
    }),
    userProfileAdminGroupsLoadStatus: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileAdminGroupData: state.userProfile.userProfileAdminGroupData,
        userProfileAdminGroupsLoadStatus: state.userProfile.userProfileAdminGroupsLoadStatus,
    };
}

export default (connect(mapStateToProps)(UserAdminGroupList));
