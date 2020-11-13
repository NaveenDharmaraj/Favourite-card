import React from 'react';
import MobileDetect from 'mobile-detect';

import storage from '../helpers/storage';
import _isEmpty from 'lodash/isEmpty';
import {
    getUser,
} from '../actions/user';

import {
    initializeStore,
} from './store';
import { addToDataLayer } from '../helpers/users/googleTagManager';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
    // Always make a new store if server, otherwise state is shared between requests
    if (isServer) {
        return initializeStore(initialState);
    }

    // Create store if unavailable on the client and set it on the window object
    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
    }
    return window[__NEXT_REDUX_STORE__];
}

export default (App) => {
    return class AppWithRedux extends React.Component {
        static async getInitialProps(appContext) {
            // Get or Create the store with `undefined` as initialState
            // This allows you to set a custom default initialState
            const reduxStore = getOrCreateStore();

            // Provide the store to getInitialProps of pages
            appContext.ctx.reduxStore = reduxStore;

            // const { auth0AccessToken } = cookies(appContext.ctx)
            let auth0AccessToken = null;
            let userId = null;
            if (isServer) {
                auth0AccessToken = storage.get('auth0AccessToken', 'cookie', appContext.ctx.req.headers.cookie);
                userId = storage.get('chimpUserId', 'cookie', appContext.ctx.req.headers.cookie);
            }

            let appProps = {};
            if (typeof App.getInitialProps === 'function') {
                appProps = await App.getInitialProps(appContext)
            }
            if (isServer) {
                reduxStore.dispatch({
                    type: 'SET_AUTH',
                    payload: {
                        isAuthenticated: false,
                    },
                });
                if (!_isEmpty(auth0AccessToken) && !_isEmpty(userId)) {
                    await getUser(reduxStore.dispatch, userId, auth0AccessToken);
                }
            }
            if (isServer) {
                const windowSize = storage.get('windowSize', 'cookie', appContext.ctx.req.headers.cookie);
                const result = new MobileDetect(appContext.ctx.req.headers['user-agent']);
                let isMobile = !!result.mobile();
                if (!_isEmpty(windowSize)) {
                    if (isMobile && windowSize > 991) {
                        isMobile = false;
                    } else if (!isMobile && windowSize < 992) {
                        isMobile = true;
                    }
                }
                reduxStore.dispatch({
                    payload: {
                        isMobile,
                    },
                    type: 'SET_SSR_IS_MOBILE',
                });
            }

            return {
                ...appProps,
                initialReduxState: reduxStore.getState(),
            };
        }

        constructor(props) {
            super(props);
            this.reduxStore = getOrCreateStore(props.initialReduxState);
        }

        render() {
            if (typeof window !== 'undefined') {
                let event = '';
                if (!_isEmpty(window.location.pathname)) {
                    event = `ci${window.location.pathname.replace(/\//g, '_')}`;
                }
                const tagManagerArgs = {
                    dataLayer: {
                        page: window.location.pathname,
                        web_event: event,
                    },
                    dataLayerName: 'dataLayer',
                };
                addToDataLayer(tagManagerArgs);
            }
            return <App {...this.props} reduxStore={this.reduxStore} />
        }
    };
};
