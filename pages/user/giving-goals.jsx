import React from 'react';
import {
    Container,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';

import Layout from '../../components/shared/Layout';
import ToolTabs from '../../components/Give/Tools/ToolTabs';
import { redirectIfNotUSer } from '../../helpers/utils';
// import charityLogo from '../static/images/canadian_red_cross.png';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const GivingGoals = (props) => {
    const {
        currentAccount,
    } = props;
    redirectIfNotUSer(currentAccount, RAILS_APP_URL_ORIGIN);
    return (
        <Layout authRequired={true} >
            <Container>
                <div className="charityTab n-border mt-3 mb-3">
                    <ToolTabs
                        defaultActiveIndex="2"
                    />

                </div>
            </Container>
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
});

export default (connect(mapStateToProps)(GivingGoals));
