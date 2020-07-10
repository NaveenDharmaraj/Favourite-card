import _isEmpty from 'lodash/isEmpty';

import logger from '../helpers/logger';

function getLocalStorage(name) {
    if (name === 'claimToken' && typeof Storage !== 'undefined') {
        const itemStr = localStorage.getItem(name);
        if (!itemStr) {
            return null;
        };
        const item = JSON.parse(itemStr);
        const now = new Date();
        if (now.getTime() > item.expireAfter) {
            localStorage.removeItem(name);
            return null;
        }
        else {
            return localStorage.getItem(name);
        }
    }
    else if (typeof Storage !== 'undefined') {
        return localStorage.getItem(name);
    }
}

function getCookies(name, serverCookies = null) {
    let val = '';
    let cookies = serverCookies;
    if (_isEmpty(cookies) && typeof document !== 'undefined') {
        cookies = document.cookie;
    }
    if (cookies) {
        try {
            val = cookies.split(';').find((cookie) => cookie.includes(name)).split('=')[1];
        } catch (e) {
            // this could just mean that no parse is needed
        }
        return val;
    }
    return null;
}

function writeCookies(
    key,
    val,
    expiry,
) {
    let cookie = `${key}=${val};path=/`;
    switch (typeof expiry) {
        case 'boolean':
            cookie += expiry
                ? ';expires=Sat, 01 Jan 2050 00:00:00 GMT'
                : ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
            break;
        case 'number':
            cookie += `;max-age=${expiry}`;
            break;
        case 'string':
            cookie += `;expires=${expiry}`;
            break;
        default:
            break;
    }
    if (location && location.protocol === 'https:') {
        cookie += ';secure';
    }

    document.cookie = cookie;

    return cookie;
}

function get(name, type, serverCookies = null) {
    switch (type) {
        case 'cookie': return getCookies(name, serverCookies);
        case 'local': return getLocalStorage(name);
        default:
            break;
    }
}

function set(name, value, type, expiry) {
    debugger;
    switch (type) {
        case 'cookie': writeCookies(name, value, expiry);
            break;
        case 'local':
            if (name === 'claimToken') {
                const now = new Date();
                const item = {
                    value: value,
                    expireAfter: now.getTime() + expiry,
                };
                localStorage.setItem(name, JSON.stringify(item))
            }
            else {
                const val = typeof value !== 'object' ? value : JSON.stringify(value);
                localStorage.setItem(name, val);
            }
            break;
        default:
            break;
    }
}

function unset(name, type) {
    if (type === 'cookie') {
        const expires = `expires=Thu, 01 Jan 1970 00:00:00;`;
        document.cookie = `${name}='';path=/;${expires}`;
    } else if (type === 'local') {
        localStorage.removeItem(name);
    }
}
const storage = {
    get,
    set,
    unset,
};
export default storage;
