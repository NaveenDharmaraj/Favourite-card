/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import auth0 from '../services/auth';

const { publicRuntimeConfig } = getConfig();

const {
    SEARCH_API_BASE,
    SOCIAL_API_DOMAIN,
    SOCIAL_API_VERSION,
} = publicRuntimeConfig;

const instance = axios.create({
    baseURL: `${SOCIAL_API_DOMAIN}/${SEARCH_API_BASE}/${SOCIAL_API_VERSION}`,
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
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
  }, function (error) {
    return Promise.reject(error.response.data);
  });

export default instance;
