import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import auth0 from '../services/auth';
import logger from '../helpers/logger';
import {
    createCustomAmzTraceId,
    createReqId,
} from '../helpers/utils';

const { publicRuntimeConfig } = getConfig();

const {
    ROR_AUTH_API_BASE,
    ROR_AUTH_API_DOMAIN,
    ROR_AUTH_API_VERSION,
} = publicRuntimeConfig;

const instance = axios.create({
    baseURL: `${ROR_AUTH_API_DOMAIN}/${ROR_AUTH_API_BASE}/${ROR_AUTH_API_VERSION}`,
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

instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
  }, function (error) {
      const {
        config,
    } = error.response;
    const logDNAErrorObj = {
        data: config.data ? JSON.parse(config.data) : null,
        error: error.response.data,
        method: config.method,
        url: config.url,
    };
    logger.error(`[AUTHROR] API failed: ${JSON.stringify(logDNAErrorObj)}`);
    return Promise.reject(error.response.data);
  });

export default instance;
