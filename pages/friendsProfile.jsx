/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    connect,
} from 'react-redux';

import Layout from '../components/shared/Layout';
import {
    getUserFriendProfile,
} from '../actions/userProfile';
import FavouritesList from '../components/UserProfile/Favourites';
import MemberGroupList from '../components/UserProfile/MemberGroups';
import AdminGroupList from '../components/UserProfile/AdminGroups';
import CharitableInterestsList from '../components/UserProfile/CharitableInterest';
import GivingGoal from '../components/UserProfile/GivingGoal';
import BasicProfile from '../components/UserProfile/BasicProfile';
import {
    formatAmount,
} from '../helpers/give/utils';

class FriendProfile extends React.Component {
    static async getInitialProps({ query }) {
        return {
            friendChimpId: query.slug,
            namespacesRequired: [],
        };
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
                attributes: {
                    email,
                },
            },
            dispatch,
            friendChimpId,
        } = this.props;
        getUserFriendProfile(dispatch, email, friendChimpId, id);
    }

    componentDidUpdate(prevProps) {
        const {
            currentUser: {
                id,
                attributes: {
                    email,
                },
            },
            dispatch,
            friendChimpId,
        } = this.props;
        if (!_.isEqual(friendChimpId, prevProps.friendChimpId)) {
            getUserFriendProfile(dispatch, email, friendChimpId, id);
        }
    }

    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
            },
            type: 'USER_PROFILE_BASIC_FRIEND',
        });
    }

    render() {
        const {
            userFriendProfileData,
        } = this.props;
        let userData = '';
        let givingAmount = 0; let givenAmount = 0; let percentage = 0; let profileType = '';
        if (!_.isEmpty(userFriendProfileData) && _.size(userFriendProfileData.data) > 0) {
            userData = userFriendProfileData.data[0].attributes;
            givingAmount = (typeof userData.giving_goal_amt !== 'undefined') ? formatAmount(Number(userData.giving_goal_amt)) : formatAmount(0);
            givenAmount = (typeof userData.giving_goal_met !== 'undefined') ? formatAmount(Number(userData.giving_goal_met)) : formatAmount(0);
            percentage = (givenAmount * 100) / givingAmount;
            profileType = userData.profile_type.toUpperCase();
        }
        return (
            <Layout authRequired>
                <BasicProfile userData={userData} friendUserId={userData.user_id}/>
                {
                    (userData.causes_visibility === 0 || (profileType === 'FRIENDS_PROFILE' && userData.causes_visibility === 1)) && (
                        <CharitableInterestsList friendUserId={userData.user_id} />
                    )
                }
                {
                    (userData.causes_visibility === 0 || (profileType === 'FRIENDS_PROFILE' && userData.causes_visibility === 1)) && (
                        <GivingGoal
                            givingAmount={givingAmount}
                            givenAmount={givenAmount}
                            percentage={percentage}
                        />
                    )
                }
                {
                    (userData.causes_visibility === 0 || (profileType === 'FRIENDS_PROFILE' && userData.causes_visibility === 1)) && (
                        <AdminGroupList
                            friendUserId={userData.user_id}
                            friendFirstName={userData.first_name}
                        />
                    )
                }
                {
                    (userData.causes_visibility === 0 || (profileType === 'FRIENDS_PROFILE' && userData.causes_visibility === 1)) && (
                        <MemberGroupList friendUserId={userData.user_id} />
                    )
                }
                {
                    (userData.causes_visibility === 0 || (profileType === 'FRIENDS_PROFILE' && userData.causes_visibility === 1)) && (
                        <FavouritesList friendUserId={userData.user_id} />
                    )
                }
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
    };
}

export default (connect(mapStateToProps)(FriendProfile));
