import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import auth0 from '../services/auth';
import { triggerUxCritialErrors } from '../actions/error';

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
instance.interceptors.request.use((config) => {
    if (_isEmpty(config.headers.Authorization)) {
        let token = '';
        if (!_isEmpty(auth0) && !_isEmpty(auth0.accessToken)) {
            token = auth0.accessToken;
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    if(config.params) {
        config.uxCritical = (config.params.uxCritical);
        config.dispatch = (config.params.dispatch) ? config.params.dispatch : null;
        config.params = _.omit(config.params, ['uxCritical', 'dispatch']);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    // Do something with response data
    return response.data;
  }, function (error) {
    const {
        config,
        data,
    } = error.response;
    if(config.uxCritical && config.dispatch) {
        triggerUxCritialErrors(data.errors || data, config.dispatch);
    }
    return Promise.reject(error.response.data);
  });

export default instance;
