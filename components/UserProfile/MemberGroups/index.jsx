/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Grid,
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
    getUserMemberGroup,
} from '../../../actions/userProfile';
import {
    getLocation,
    getPrivacyType,
} from '../../../helpers/profiles/utils';
import ProfileCard from '../../shared/ProfileCard';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';

class UserMemberGroupList extends React.Component {
    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
        } = this.props;
        getUserMemberGroup(dispatch, friendUserId, id);
    }

    // componentWillUnmount() {
    //     const {
    //         dispatch,
    //     } = this.props;
    //     dispatch({
    //         payload: {
    //         },
    //         type: 'USER_PROFILE_MEMBER_GROUP',
    //     });
    // }

    showMemberCard() {
        const {
            userFriendProfileData: {
                attributes: {
                    profile_type,
                },
            },
            userProfileMemberGroupData: {
                data: memberData,
            },
            previewMode: {
                isPreviewMode,
            },
        } = this.props;
        const memberArray = [];
        if (!_isEmpty(memberData)) {
            memberData.map((admin) => {
                memberArray.push(
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
                        canEdit={false}
                    />,
                );
            });
        }
        return memberArray;
    }

    render() {
        const {
            previewMode: {
                isPreviewMode,
            },
            userFriendProfileData: {
                attributes: {
                    giving_group_member_visibility,
                    profile_type,
                },
            },
            userProfileMemberGroupData: {
                data: memberData,
            },
            userProfileMemberGroupsLoadStatus,
        } = this.props;
        const isMyProfile = (profile_type === 'my_profile');
        const currentPrivacyType = getPrivacyType(giving_group_member_visibility);
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
        if (!_isEmpty(memberData)) {
            dataElement = (
                <div className="cardwrap">
                    {this.showMemberCard()}
                </div>
            );
        } else {
            dataElement = noData;
        }
        return (
            <div className='userPrfl_tabSec'>
                <div className="tabHeader">
                    <Header>Joined Giving Groups</Header>
                    {(isMyProfile && !isPreviewMode)
                        && (
                            <ProfilePrivacySettings
                                columnName='giving_group_member_visibility'
                                columnValue={giving_group_member_visibility}
                                iconName={currentPrivacyType}
                            />
                        )}
                </div>
                {userProfileMemberGroupsLoadStatus
                    ? <PlaceholderGrid row={2} column={3} />
                    : dataElement
                }
            </div>
        );
    }
}

UserMemberGroupList.defaultProps = {
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            giving_group_member_visibility: null,
            profile_type: '',
        },
    },
    userProfileMemberGroupData: {
        data: [],
    },
    userProfileMemberGroupsLoadStatus: true,
};

UserMemberGroupList.propTypes = {
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            giving_group_member_visibility: number,
            profile_type: string,
        }),
    }),
    userProfileMemberGroupData: PropTypes.shape({
        data: array,
    }),
    userProfileMemberGroupsLoadStatus: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileMemberGroupData: state.userProfile.userProfileMemberGroupData,
        userProfileMemberGroupsLoadStatus: state.userProfile.userProfileMemberGroupsLoadStatus,
    };
}


export default (connect(mapStateToProps)(UserMemberGroupList));
