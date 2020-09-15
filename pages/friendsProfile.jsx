import React from 'react';
import {
    connect,
} from 'react-redux';
import {
    string,
    func,
    PropTypes,
} from 'prop-types';

import Layout from '../components/shared/Layout';
import '../static/less/userProfile.less';
import {
    getUserFriendProfile,
} from '../actions/userProfile';
import UserProfileWrapper from '../components/UserProfile';

class FriendProfile extends React.Component {
    static async getInitialProps({ query }) {
        return {
            friendUserId: query.slug,
            namespacesRequired: [],
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
        getUserFriendProfile(dispatch, email, friendUserId, currentUserId);
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
