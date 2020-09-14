import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';
import base64 from "base-64";

import storage from '../helpers/storage';
import logger from '../helpers/logger';
import registerAppLozic from '../helpers/initApplozic';
import configObj from '../components/shared/configEnv';


const axiosRef = axios;
const instance = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic userId:deviceKey',
        'Application-Key': '',
    }
});
instance.interceptors.request.use(function (config) {
    const APPLOZIC_ENV = configObj.envVariable || {};
    if(!_isEmpty(APPLOZIC_ENV)){
        config.baseURL = `${APPLOZIC_ENV.APPLOZIC_WS_URL}`;
        config.headers['Application-Key'] = `${APPLOZIC_ENV.APPLOZIC_APP_KEY}`
    }
    const deviceKey = storage.get("_deviceKey", 'cookie');
    if (!deviceKey || deviceKey == "") {
            registerAppLozic();

    }
    config.headers.Authorization = "Basic " + base64.encode(storage.get('chimpUserId', 'cookie') + ":" + storage.get("_deviceKey", 'cookie'));
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    // Do something with response data
    return response.data;
}, (error) => {
    if (axiosRef.isCancel(error)) {
        error.isCancel = true;
        throw error;
    }
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
const APPLOZIC_ENV = configObj.envVariable || {};
instance.APPLOZIC_APP_KEY = APPLOZIC_ENV.APPLOZIC_APP_KEY;
export default instance;
