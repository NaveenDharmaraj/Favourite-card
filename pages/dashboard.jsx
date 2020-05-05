import React from 'react';
import {
    connect,
} from 'react-redux';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import Layout from '../components/shared/Layout';
import AccountBalance from '../components/Dashboard/AccountBalance';
import DashboardList from '../components/Dashboard/DashboardList';
import FriendList from '../components/Dashboard/FriendsList';
import RecommendationList from '../components/Dashboard/RecommendationList';
import StoriesList from '../components/Dashboard/StoriesList';
import HelpCenter from '../components/Dashboard/HelpCenter';
import { redirectIfNotUSer } from '../helpers/utils';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

// eslint-disable-next-line react/prefer-stateless-function
class Dasboard extends React.Component {
    render() {
        const {
            currentUser,
            currentAccount,
        } = this.props;
        redirectIfNotUSer(currentAccount, RAILS_APP_URL_ORIGIN);
        return (
            <Layout authRequired>
                <AccountBalance currentUser={currentUser} />
                <DashboardList />
                <FriendList />
                <RecommendationList />
                <StoriesList />
                <HelpCenter />
            </Layout>
        );
    }
}

Dasboard.propTypes = {
    dispatch: PropTypes.func
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        currentAccount: state.user.currentAccount,
    };
}

export default (connect(mapStateToProps)(Dasboard));
