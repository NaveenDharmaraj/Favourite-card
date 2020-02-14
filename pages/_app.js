/* eslint-disable semi */
import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import getConfig from 'next/config';
import TagManager from 'react-gtm-module';

import withReduxStore from '../store/with-redux-store';
import { appWithTranslation } from '../i18n';
import ErrorBoundary from '../components/shared/ErrorBoundary';

const { publicRuntimeConfig } = getConfig();

const {
    GTM_AUTH,
    GTM_ENV_NUMBER,
    GTM_ID,
} = publicRuntimeConfig;

const tagManagerConfig = {
    auth: GTM_AUTH,
    gtmId: GTM_ID,
    preview: GTM_ENV_NUMBER,
};
const __GOOGLE_TAG_MANAGER_INITIALIZE__ = '__GOOGLE_TAG_MANAGER_INITIALIZE__';

class MainApp extends App {
    componentDidMount() {
        // Initializes Tagmanager
        if (!window[__GOOGLE_TAG_MANAGER_INITIALIZE__]) {
            TagManager.initialize(tagManagerConfig)
        }
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props;
        return (
            <Container>
                <Provider store={reduxStore}>
                    <ErrorBoundary>
                        <Component {...pageProps} />
                    </ErrorBoundary>
                </Provider>
            </Container>
        );
    }
}

export default withReduxStore(appWithTranslation(MainApp));
