import axios from 'axios';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import {
    createCustomAmzTraceId,
    createReqId,
} from '../helpers/utils';

import auth0 from './auth';

const { publicRuntimeConfig } = getConfig();

const {
    CORP_DOMAIN,
    WP_DOMAIN_BASE,
    WP_API_VERSION,
} = publicRuntimeConfig;

const instance = axios.create({
    baseURL: `${CORP_DOMAIN}/${WP_DOMAIN_BASE}/${WP_API_VERSION}/`,
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
    },
});
instance.interceptors.request.use(function (config) {
    const amzTraceId = createCustomAmzTraceId();
    const reqId = createReqId();
    config.headers['request-header-attrs'] = `request_id:${reqId}|custom_x_amz_trace_id:${amzTraceId}`;
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
