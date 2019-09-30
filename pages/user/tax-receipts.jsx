import React from 'react';
import {
    Container,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';

import Layout from '../../components/shared/Layout';
import LandingPageTaxReceipt from '../../components/TaxReceipt/LandingPageTaxReceipt';
import { redirectIfNotUSer } from '../../helpers/utils';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const TaxReceipt = (props) => {
    const {
        currentAccount,
    } = props;
    redirectIfNotUSer(currentAccount, RAILS_APP_URL_ORIGIN);
    return (
        <Layout authRequired>
            <LandingPageTaxReceipt />
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
});

export default (connect(mapStateToProps)(TaxReceipt));
