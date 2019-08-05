import React from 'react';

import storage from '../helpers/storage';
import _isEmpty from 'lodash/isEmpty';
import {
    getUser,
} from '../actions/user';

import {
    initializeStore,
} from './store';

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
            if (typeof window === 'undefined') {
                auth0AccessToken = storage.get('auth0AccessToken', 'cookie', appContext.ctx.req.headers.cookie);
                userId = storage.get('chimpUserId', 'cookie', appContext.ctx.req.headers.cookie);
            }

            let appProps = {};
            if (typeof App.getInitialProps === 'function') {
                appProps = await App.getInitialProps(appContext)
            }
            if (typeof window === 'undefined') {
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
            return <App {...this.props} reduxStore={this.reduxStore} />
        }
    };
};
