import React from 'react';
import {
    Container,
    Responsive,
} from 'semantic-ui-react';
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import {
    connect,
} from 'react-redux';

import { withTranslation } from '../../i18n';

import UserBasicProfile from './BasicProfile';
import ProfileDetails from './ProfileDetails';
import UserRightColumnList from './UserRightColumnList';

const UserProfileWrapper = (props) => {
    const {
        friendUserId,
        userFriendProfileData: {
            attributes: {
                causes_visibility,
                giving_goal_visibility,
                profile_type,
            },
        },
    } = props;
    const isSingleColumnLayout = (profile_type !== 'my_profile' && causes_visibility === 2 && giving_goal_visibility === 2);
    return (
        <Container>
            <div className="userProfileScreen">
                <div className="userHeaderBanner" />
                <div className="usercontentsecWrap">
                    <div className="userleftColumn">
                        <div className="userdetailsWrap">
                            <UserBasicProfile />
                        </div>
                        <ProfileDetails
                            friendUserId={friendUserId}
                        />
                    </div>
                    {!isSingleColumnLayout
                    && (
                        <div className="userrightColumn">
                            <Responsive minWidth={768}>
                                <UserRightColumnList
                                    friendUserId={friendUserId}
                                />
                            </Responsive>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

UserProfileWrapper.defaultProps = {
    friendUserId: '',
    userFriendProfileData: {
        attributes: {
            causes_visibility: null,
            giving_goal_visibility: null,
            profile_type: '',
        },
    },
};

UserProfileWrapper.propTypes = {
    friendUserId: string,
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            causes_visibility: number,
            giving_goal_visibility: number,
            profile_type: string,
        }),
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(UserProfileWrapper));
export {
    connectedComponent as default,
    UserProfileWrapper,
    mapStateToProps,
};
