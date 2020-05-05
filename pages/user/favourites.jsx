import React from 'react';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';

import Layout from '../../components/shared/Layout';
import Favorites from '../../components/User/Favorites';
import { redirectIfNotUSer } from '../../helpers/utils';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const Favourites = (props) => {
    const {
        currentAccount,
    } = props;
    redirectIfNotUSer(currentAccount, RAILS_APP_URL_ORIGIN);
    return (
        <Layout authRequired>
            <Favorites/>
        </Layout>
    );
};

function mapStateToProps(state) {
    return {
        currentAccount: state.user.currentAccount,
    };
}

export default (connect(mapStateToProps)(Favourites));
