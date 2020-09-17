import React from 'react';
import {
    connect,
} from 'react-redux';
import {
    string,
    func,
    PropTypes,
} from 'prop-types';

import '../static/less/userProfile.less';
import Layout from '../components/shared/Layout';
import {
    getUserFriendProfile,
} from '../actions/userProfile';
import UserProfileWrapper from '../components/UserProfile';

class FriendProfile extends React.Component {
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
        const updatedFriendId = (friendUserId === 'myprofile') ? currentUserId : friendUserId;
        getUserFriendProfile(dispatch, email, updatedFriendId, currentUserId);
    }

    render() {
        return (
            <Layout authRequired>
                <UserProfileWrapper {...this.props} />
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
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(FriendProfile));
