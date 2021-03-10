/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import axios from 'axios';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';

import auth0 from '../services/auth';
import { triggerUxCritialErrors } from '../actions/error';
import { softLogout } from '../actions/auth';
import logger from '../helpers/logger';
import {
    createCustomAmzTraceId,
    createReqId,
} from '../helpers/utils';

const { publicRuntimeConfig } = getConfig();

const {
    GRAPH_API_BASE,
    SOCIAL_API_DOMAIN,
    SOCIAL_API_VERSION,
} = publicRuntimeConfig;


const instance = axios.create({
    baseURL: `${SOCIAL_API_DOMAIN}/${GRAPH_API_BASE}/${SOCIAL_API_VERSION}`,
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
    if (config.params) {
        config.uxCritical = (config.params.uxCritical);
        config.dispatch = (config.params.dispatch) ? config.params.dispatch : null;
        config.ignore401 = (config.params.ignore401);
        config.params = _omit(config.params, [
            'uxCritical',
            'dispatch',
            'ignore401',
        ]);
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
        data,
        status,
    } = error.response;
    const logDNAErrorObj = {
        data: config.data ? JSON.parse(config.data) : null,
        error: error.response.data,
        method: config.method,
        url: config.url,
    };
    logger.error(`[GRAPH] API failed: ${JSON.stringify(logDNAErrorObj)}`);
    if (status === 401 && !config.ignore401 && typeof window !== 'undefined') {
        window.location.href = '/users/logout';
    } else if (status === 401) {
        softLogout(config.dispatch);
        return null;
    }
    if (config.uxCritical && config.dispatch) {
        triggerUxCritialErrors(data.errors || data, config.dispatch);
    }
    return Promise.reject(error.response.data);
});

export default instance;
