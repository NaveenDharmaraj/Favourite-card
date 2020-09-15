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
    func,
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
            userProfileMemberGroupData: {
                data: memberData,
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
                        location={getLocation(admin.attributes.city, admin.attributes.province)}
                    />,
                );
            });
        }
        return memberArray;
    }

    render() {
        const {
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
        return (
            <div className='userPrfl_tabSec'>
                <div className="tabHeader">
                    <Header>Joined Giving Groups</Header>
                    {isMyProfile && !_isEmpty(currentPrivacyType)
                        && (
                            <ProfilePrivacySettings
                                iconName={currentPrivacyType}
                            />
                        )}
                </div>
                {!_isEmpty(memberData)
                    ? (
                        <div className="cardwrap">
                            {this.showMemberCard()}
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

UserMemberGroupList.defaultProps = {
    userFriendProfileData: {
        attributes: {
            giving_group_member_visibility: null,
            profile_type: '',
        },
    },
    userProfileMemberGroupData: {
        data: [],
    },
};

UserMemberGroupList.propTypes = {
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            giving_group_member_visibility: number,
            profile_type: string,
        }),
    }),
    userProfileMemberGroupData: PropTypes.shape({
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileMemberGroupData: state.userProfile.userProfileMemberGroupData,
        userProfileMemberGroupsLoadStatus: state.userProfile.userProfileMemberGroupsLoadStatus,
    };
}


export default (connect(mapStateToProps)(UserMemberGroupList));
