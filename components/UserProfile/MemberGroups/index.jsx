/* eslint-disable react/prop-types */
import React from 'react';
import {
    Container,
    Header,
    Grid,
    Button,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
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
    displayRecordCount,
    displaySeeMoreButton,
} from '../../../helpers/profiles/utils';
import ProfileCard from '../../shared/ProfileCard';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';
import PlaceholderGrid from '../../shared/PlaceHolder';

class UserMemberGroupList extends React.Component {
    constructor(props){
        super(props);
        const {
            userProfileMemberGroupData: {
                data: memberData,
            },
        } = props;
        this.state = {
            currentPageNumber: _isEmpty(memberData) ? 1 : Math.floor(_size(memberData)/10),
        }
    }
    
    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
            userProfileMemberGroupData: {
                data: memberData,
            },
        } = this.props;
        const {
            currentPageNumber
        } = this.state;
        _isEmpty(memberData) && dispatch(getUserMemberGroup(friendUserId, id, currentPageNumber, false));
    }

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
                        totalMoneyRaised={admin.attributes.totalMoneyRaised}
                    />,
                );
            });
        }
        return memberArray;
    }
    handleSeeMore = () => {
        const {
            currentPageNumber
        } = this.state;
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
        } = this.props;
        dispatch(getUserMemberGroup(friendUserId, id, currentPageNumber + 1, true))
            .then(() => {
                this.setState((prevState) => ({
                    currentPageNumber: prevState.currentPageNumber + 1
                }))
            })
            .catch((err) => {
                // handle error
            })
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
                totalMemberGroupRecordCount,
            },
            userProfileMemberGroupsLoadStatus,
            userProfileMemberGroupsSeeMoreLoader,
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
                <div className="seeMore bigBtn mt-2-sm mt-2-xs">
                    {
                        (!_isEmpty(memberData) && (_size(memberData) < totalMemberGroupRecordCount )) &&
                        displaySeeMoreButton(userProfileMemberGroupsSeeMoreLoader, this.handleSeeMore)
                    }
                    {totalMemberGroupRecordCount > 0 && displayRecordCount(memberData, totalMemberGroupRecordCount)}
                </div>
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
        totalMemberGroupRecordCount: 0,
    },
    userProfileMemberGroupsLoadStatus: true,
    userProfileMemberGroupsSeeMoreLoader: false
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
        totalMemberGroupRecordCount: number,
    }),
    userProfileMemberGroupsLoadStatus: bool,
    userProfileMemberGroupsSeeMoreLoader: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileMemberGroupData: state.userProfile.userProfileMemberGroupData,
        userProfileMemberGroupsLoadStatus: state.userProfile.userProfileMemberGroupsLoadStatus,
        userProfileMemberGroupsSeeMoreLoader: state.userProfile.userProfileMemberGroupsSeeMoreLoader,
    };
}


export default (connect(mapStateToProps)(UserMemberGroupList));
