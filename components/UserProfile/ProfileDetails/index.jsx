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
    } = props;
    const panes = [
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
                <UserAdminGroupList
                    friendUserId={friendUserId}
                />
                <UserMemberGroupList
                    friendUserId={friendUserId}
                />
                <FavouritesList
                    friendUserId={friendUserId}
                />
            </Responsive>
        </Fragment>
    );
};

ProfileDetails.defaultProps = {
    friendUserId: '',
};

ProfileDetails.propTypes = {
    friendUserId: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
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
