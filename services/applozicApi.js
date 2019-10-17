import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';
import base64 from "base-64";
import auth0 from './auth';
import storage from '../helpers/storage';
import logger from '../helpers/logger';

const { publicRuntimeConfig } = getConfig();

const {
    APPLOZIC_WS_URL,
    APPLOZIC_APP_KEY
} = publicRuntimeConfig;
const instance = axios.create({
    baseURL: `${APPLOZIC_WS_URL}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic userId:deviceKey',
        'Application-Key': `${APPLOZIC_APP_KEY}`
    }
});
instance.interceptors.request.use(function (config) {
    if (_isEmpty(config.headers.Authorization)) {
        let token = '';
        if (!_isEmpty(auth0) && !_isEmpty(auth0.accessToken)) {
            token = auth0.accessToken;
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    const deviceKey = storage.get("_deviceKey", 'cookie');
    if (!deviceKey || deviceKey == "") {
        if (registerAppLozic) {
            registerAppLozic();
        }
    }
    config.headers.Authorization = "Basic " + base64.encode(storage.get('chimpUserId', 'cookie') + ":" + storage.get("_deviceKey", 'cookie'));
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
    logger.error(`[APPLOZIC] API failed: ${JSON.stringify(logDNAErrorObj)}`);
    return Promise.reject(error.response.data);
});
instance.APPLOZIC_APP_KEY = APPLOZIC_APP_KEY;
export default instance;
