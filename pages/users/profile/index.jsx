import React from 'react';
import _ from 'lodash';
import {
    connect,
} from 'react-redux';

import Layout from '../../../components/shared/Layout';
import {
    getUserProfileBasic,
} from '../../../actions/userProfile';
import FavouritesList from '../../../components/UserProfile/Favourites';
import MemberGroupList from '../../../components/UserProfile/MemberGroups';
import AdminGroupList from '../../../components/UserProfile/AdminGroups';
import CharitableInterestsList from '../../../components/UserProfile/CharitableInterest';
import GivingGoal from '../../../components/UserProfile/GivingGoal';
import BasicProfile from '../../../components/UserProfile/BasicProfile';


// eslint-disable-next-line react/prefer-stateless-function
class MyProfile extends React.Component {
    componentDidMount() {
        const {
            currentUser: {
                id,
                attributes:{
                    email,
                }
            },
            dispatch,
        } = this.props;
        getUserProfileBasic(dispatch, email, id);
    }

    render() {
        const {
            userProfileBasicData,
        } = this.props;
        let userData = '';
        let givingAmount = 0; let givenAmount = 0; let percentage = 0;
        if (userProfileBasicData
            && userProfileBasicData.data
            && _.size(userProfileBasicData.data) > 0) {
            userData = userProfileBasicData.data[0].attributes;
            givingAmount = Number(userData.giving_goal_amt);
            givenAmount = Number(userData.giving_goal_met);
            percentage = (givenAmount * 100) / givingAmount;
        }
        return (
            <Layout authRequired>
                <BasicProfile userData={userData} isEdit={false} />
                <CharitableInterestsList />
                <GivingGoal
                    givingAmount={givingAmount}
                    givenAmount={givenAmount}
                    percentage={percentage}
                />
                <AdminGroupList />
                <MemberGroupList />
                <FavouritesList />
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileBasicData: state.userProfile.userProfileBasicData,
    };
}

export default (connect(mapStateToProps)(MyProfile));
