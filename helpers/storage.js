import _isEmpty from 'lodash/isEmpty';

function getLocalStorage(name) {
    if (typeof Storage !== 'undefined') {
        localStorage.getItem(name);
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
function writeCookies(name, value, expiry) {
    const expires = `expires=${expiry};`;
    document.cookie = `${name}=${value};${expires}path=/`;
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
    switch (type) {
        case 'cookie': writeCookies(name, value, expiry);
            break;
        case 'local': const val = typeof value !== 'object' ? value : JSON.stringify(value);
            localStorage.setItem(name, val);
            break;
        default:
            break;
    }
}

function unset(name, type) {
    if (type === 'cookie') {
        const expires = `expires=Thu, 01 Jan 1970 00:00:00;`;
        document.cookie = `${name}=;${expires}`;
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
