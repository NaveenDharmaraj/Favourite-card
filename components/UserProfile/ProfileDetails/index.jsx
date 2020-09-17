import React, {
    Fragment,
} from 'react';
import {
    Responsive,
    Tab,
    Image,
    Icon,
    Grid,
    Button,
    Dropdown,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';
import UserRightColumnList from '../UserRightColumnList';
import UserAdminGroupList from '../AdminGroups';
import UserMemberGroupList from '../MemberGroups';
import FavouritesList from '../Favourites';

const ProfileDetails = (props) => {
    const {
        friendUserId,
        previewMode: {
            isPreviewMode,
        },
        userFriendProfileData: {
            attributes: {
                profile_type,
                favourites_visibility,
                giving_group_manage_visibility,
                giving_group_member_visibility,
            },
        },
    } = props;
    const isMyProfile = (profile_type === 'my_profile');
    const showAdminGroups = (giving_group_manage_visibility === 0
        || (profile_type === 'friends_profile' && giving_group_manage_visibility === 1)
        || (isMyProfile && !isPreviewMode));

    const showMemberGroups = (giving_group_member_visibility === 0
            || (profile_type === 'friends_profile' && giving_group_member_visibility === 1)
            || (isMyProfile && !isPreviewMode));
    
    const showFavouriteGroups = (favourites_visibility === 0
        || (profile_type === 'friends_profile' && favourites_visibility === 1)
        || (isMyProfile && !isPreviewMode));

    let panes = [];
    if (showAdminGroups) {
        panes = [
            ...panes,
            {
                menuItem: 'Managed Giving Groups',
                render: () => (
                    <Tab.Pane>
                        <UserAdminGroupList
                            friendUserId={friendUserId}
                        />
                    </Tab.Pane>
                ),
            },
        ];
    }
    if (showMemberGroups) {
        panes = [
            ...panes,
            {
                menuItem: 'Joined Giving Groups', 
                render: () => (
                    <Tab.Pane>
                        <UserMemberGroupList
                            friendUserId={friendUserId}
                        />
                    </Tab.Pane>
                ),
            },
        ];
    }
    if (showFavouriteGroups) {
        panes = [
            ...panes,
            {
                menuItem: 'Favourites',
                render: () => (
                    <Tab.Pane>
                        <FavouritesList
                            friendUserId={friendUserId}
                        />
                    </Tab.Pane>
                ),
            },
        ];
    }
    return (
        <Fragment>
            <Responsive minWidth={768}>
                <Tab
                    className="userprfleTab"
                    menu={{
                        pointing: true,
                        secondary: true,
                    }}
                    panes={panes}
                />
            </Responsive>
            <Responsive minWidth={320} maxWidth={767}>
                <UserRightColumnList
                    friendUserId={friendUserId}
                />
                {showAdminGroups
                && (
                    <UserAdminGroupList
                        friendUserId={friendUserId}
                    />
                )}
                {showMemberGroups
                && (
                    <UserMemberGroupList
                        friendUserId={friendUserId}
                    />
                )
                }
                {showFavouriteGroups
                && (
                    <FavouritesList
                        friendUserId={friendUserId}
                    />
                )}
            </Responsive>
        </Fragment>
    );
};

ProfileDetails.defaultProps = {
    friendUserId: '',
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            profile_type: '',
            favourites_visibility: null,
            giving_group_manage_visibility: null,
            giving_group_member_visibility: null,
        },
    },
};

ProfileDetails.propTypes = {
    friendUserId: string,
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: {
        attributes: {
            profile_type: string,
            favourites_visibility: number,
            giving_group_manage_visibility: number,
            giving_group_member_visibility: number,
        },
    },
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(ProfileDetails));
export {
    connectedComponent as default,
    ProfileDetails,
    mapStateToProps,
};
