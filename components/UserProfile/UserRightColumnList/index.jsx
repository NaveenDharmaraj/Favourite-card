import React, {
    Fragment,
} from 'react';
import {
    Container,
    Header,
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

import UserGoal from './UserGoal';
import UserCauses from './UserCauses';

const UserRightColumnList = (props) => {
    const {
        friendUserId,
        previewMode: {
            isPreviewMode,
        },
        userFriendProfileData: {
            attributes: {
                causes_visibility,
                giving_goal_visibility,
                profile_type,
            },
        },
    } = props;
    const isMyProfile = (profile_type === 'my_profile');
    const showGivingGoal = (giving_goal_visibility === 0 || (profile_type === 'friends_profile' && giving_goal_visibility === 1) || (isMyProfile && !isPreviewMode));
    const showCauses = (causes_visibility === 0 || (profile_type === 'friends_profile' && causes_visibility === 1) || (isMyProfile && !isPreviewMode));
    return (
        <Fragment>
            {showGivingGoal
            && <UserGoal />}
            {showCauses
            && (
                <UserCauses
                    friendUserId={friendUserId}
                />
            )}
        </Fragment>
    );
};

UserRightColumnList.defaultProps = {
    friendUserId: '',
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            causes_visibility: null,
            giving_goal_visibility: null,
        },
    },
};

UserRightColumnList.propTypes = {
    friendUserId: string,
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            causes_visibility: number,
            giving_goal_visibility: number,
        }),
    }),
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
])(connect(mapStateToProps)(UserRightColumnList));
export {
    connectedComponent as default,
    UserRightColumnList,
    mapStateToProps,
};
