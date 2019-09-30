import React from 'react';
import {
    Breadcrumb,
    Container,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';

import Layout from '../../components/shared/Layout';
import StoriesAllList from '../../components/User/StoriesAllList';
import { redirectIfNotUSer } from '../../helpers/utils';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const Stories = (props) => {
    const {
        currentAccount,
    } = props;
    redirectIfNotUSer(currentAccount, RAILS_APP_URL_ORIGIN);
    return (
        <Layout authRequired>
            <div className="charityTab n-border">
                <div className="top-breadcrumb">
                    <Container>
                        <Breadcrumb className="c-breadcrumb">
                            <Breadcrumb.Section link>Home</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right" />
                            <Breadcrumb.Section active>Recommended for you</Breadcrumb.Section>
                        </Breadcrumb>
                    </Container>
                </div>
                <StoriesAllList />
            </div>
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
});

export default (connect(mapStateToProps)(Stories));
