import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

import withReduxStore from '../store/with-redux-store';
import { appWithTranslation } from '../i18n';

class MainApp extends App {
    render() {
        const { Component, pageProps, reduxStore } = this.props;
        return (
            <Container>
                <Provider store={reduxStore}>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        );
    }
}

export default withReduxStore(appWithTranslation(MainApp));
