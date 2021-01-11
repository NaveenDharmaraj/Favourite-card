import React from 'react';
import {
    connect,
} from 'react-redux';
import { withRouter } from 'next/router';
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

const friendsPath  = '/friends';
class FriendProfile extends React.Component {
    static async getInitialProps({ query }) {
        return {
            friendUserId: query.slug,
            namespacesRequired: [
                'giveCommon',
            ],
            friendPageStep: query.step,
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
        console.log("currentUser did mount",this.props.currentUser)
        !_isEmpty(this.props.currentUser) && dispatch(getUserFriendProfile(email, updatedFriendId, currentUserId));
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
            console.log("currentUser did update",this.props.currentUser)
            dispatch(getUserFriendProfile(email, updatedFriendId, currentUserId));
        }
    }

    render() {
        const {
            userFriendProfileData,
        } = this.props;
        const showFriendsPage = this.props.router.asPath && this.props.router.asPath.includes(friendsPath);
        return (
            <Layout authRequired>
                {!_isEmpty(userFriendProfileData)
                    ? (
                        <UserProfileWrapper {...this.props} showFriendsPage={showFriendsPage}/>
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

FriendProfile.defaultProps = {
    currentUser: {
        attributes: {
            email: '',
        },
        id: '',

    },
    dispatch: () => {},
    friendUserId: '',
    userFriendProfileData: {},
};

FriendProfile.propTypes = {
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

export default withRouter(connect(mapStateToProps)(FriendProfile));
