import React from 'react';
import {
    connect,
} from 'react-redux';
import {
    string,
    func,
    PropTypes,
} from 'prop-types';
import {
    Dimmer,
    Loader,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';

import '../static/less/userProfile.less';
import Layout from '../components/shared/Layout';
import {
    getUserFriendProfile,
} from '../actions/userProfile';
import UserProfileWrapper from '../components/UserProfile';

class Myprofile extends React.Component {
    static async getInitialProps({ query }) {
        return {
            friendUserId: query.slug,
            namespacesRequired: [
                'giveCommon',
            ],
        };
    }

    componentDidMount() {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: currentUserId,
            },
            dispatch,
            friendUserId,
        } = this.props;
        const updatedFriendId = Number(friendUserId) ? friendUserId : currentUserId;
        !_isEmpty(currentUserId) && dispatch(getUserFriendProfile(email, updatedFriendId, currentUserId));
    }

    componentDidUpdate(prevProps) {
        const {
            currentUser: {
                attributes: {
                    email,
                },
                id: currentUserId,
            },
            friendUserId,
            dispatch,
        } = this.props;
        const updatedFriendId = Number(friendUserId) ? friendUserId : currentUserId;
        if (!_isEqual(friendUserId, prevProps.friendUserId)) {
            dispatch({
                payload: {
                },
                type: 'USER_PROFILE_RESET_DATA',
            });
            dispatch(getUserFriendProfile(email, updatedFriendId, currentUserId));
        }
    }
    render() {
        const {
            userFriendProfileData,
        } = this.props;
        return (
            <Layout authRequired>
                {!_isEmpty(userFriendProfileData)
                    ? (
                        <UserProfileWrapper {...this.props} showFriendsPage={false} />
                    )
                    : (
                        <Dimmer active inverted>
                            <Loader />
                        </Dimmer>
                    )}
            </Layout>
        );
    }
}

Myprofile.defaultProps = {
    currentUser: {
        attributes: {
            email: '',
        },
        id: '',

    },
    dispatch: () => { },
    friendUserId: '',
    userFriendProfileData: {},
};

Myprofile.propTypes = {
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            email: string,
        }),
        id: string,

    }),
    dispatch: func,
    friendUserId: string,
    userFriendProfileData: PropTypes.shape({}),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
    };
}

export default (connect(mapStateToProps)(Myprofile));
