import axios from 'axios';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import auth0 from './auth';

const { publicRuntimeConfig } = getConfig();

const {
    WP_DOMAIN,
    WP_DOMAIN_BASE,
    WP_API_VERSION,
} = publicRuntimeConfig;

const instance = axios.create({
    baseURL: `${WP_DOMAIN}/${WP_DOMAIN_BASE}/${WP_API_VERSION}/`,
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
    },
});
instance.interceptors.request.use(function (config) {
    if (_isEmpty(config.headers.Authorization)) {
        let token = '';
        if (!_isEmpty(auth0) && !_isEmpty(auth0.accessToken)) {
            token = auth0.accessToken;
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


export default instance;
