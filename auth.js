import querystring from 'querystring';
import Auth0Lock from 'auth0-lock';
import _ from 'lodash';
import jwt from 'jwt-decode';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
​
import logger from '../helpers/logger';
import { Router } from '../routes';
import storage from '../helpers/storage';
import chimpLogo from '../static/images/chimp-logo-new.png';
import {
    validateAuth0Failure,
} from '../actions/auth';
​
import {
    chimpLogin,
    getUser,
    handleInvitationAccepts,
} from '../actions/user';
import isUndefinedOrEmpty from '../helpers/object';
import { addToDataLayer } from '../helpers/users/googleTagManager';
​
import coreApi from './coreApi';
​
const { publicRuntimeConfig } = getConfig();
​
const {
    APP_URL_ORIGIN,
    AUTH0_CONFIGURATION_BASE_URL,
    AUTH0_DOMAIN,
    AUTH0_WEB_CLIENT_ID,
    AUTH0_WEB_AUDIENCE,
    BRANCH_IO_KEY,
} = publicRuntimeConfig;
​
/**
 * @var {object} _auth0lockConfig - The static configuration options used for the Lock widget.
 * @see https://github.com/auth0/lock#customization
 */
​
const _auth0lockConfig = {
    allowPasswordAutocomplete: true,
    allowShowPassword: true,
    allowSignUp: false,
    auth: {
        responseType: 'token id_token',
        scope: 'openid',
    },
    avatar: null,
    configurationBaseUrl: AUTH0_CONFIGURATION_BASE_URL,
    container: 'auth0-lock-container',
    languageDictionary: {
        emailInputPlaceholder: 'Enter your email',
        error: {
            forgotPassword: {
                'lock.fallback': [
                    'We’re sorry, something went wrong.',
                    'Please try again.',
                ].join(' '),
            },
            login: {
                'lock.fallback': [
                    'We’re sorry, something went wrong.',
                    'Please try to log in again.',
                ].join(' '),
                'lock.invalid_email_password': [
                    'The email or password you\'ve used is incorrect.',
                    'Please try again.',
                ].join(' '),
                'lock.network': [
                    'We couldn’t reach the server.',
                    'Please check your connection and try again.',
                ].join(' '),
            },
            signUp: {
                password_dictionary_error: 'Choose a less common password.',
                password_no_user_info_error: [
                    'Please don\'t include personal information in your password.',
                ].join(' '),
                password_strength_error: [
                    'Choose a password that’s more difficult for others to guess.',
                ].join(' '),
                user_exists: 'An account with that email already exists.',
            },
        },
        forgotPasswordAction: 'Forgot your password?',
        forgotPasswordInstructions: '',
        forgotPasswordSubmitLabel: 'Reset password',
        forgotPasswordTitle: 'Forgot your password?',
        loginSubmitLabel: 'Log in',
        passwordInputPlaceholder: 'Enter your password',
        success: {
            forgotPassword: 'Check your inbox—we’ve sent instructions to reset your password.',
        },
        title: '',
    },
    rememberLastLogin: false,
    socialButtonStyle: 'small',
    theme: {
        logo: chimpLogo,
        primaryColor: '#2185D0',
    },
};
/**
 * @var {Object} lockScreenMap - Map WebClient routes to Auth0Lock values
 */
const lockScreenMap = {
    'forgot-password': 'forgotPassword',
    login: 'login',
    new: 'signUp',
};
let _auth0lock = null;
let _auth0lockInitialScreen = '';
/**
 * A collection of auth0 related properties and utils.
 *
 * **NOTE** These _must_ use object literal getters and setters (cannot use defineProperties) in
 * order to mock them in the spec.
 * @namespace auth0
 * @type {object}
 */
​
let storeDispatch;
const auth0 = {
​
    /**
     * @property {string} accessToken - Auth0 access token
     */
    get accessToken() {
        return storage.get('auth0AccessToken', 'cookie');
    },
    /**
     * ⚠️ When this value needs to be "read" within the same process tick, use `await` (possibly
     * with try/catch) to avoid a race condition.
     * @param  {string} token - The Auth0 access token
     * @return {promise} - The promise returned by Storage
     *
     * @example
     * await (auth0.accessToken = token);
     */
​
    set accessToken(token) {
        return token ? storage.set('auth0AccessToken', token, 'cookie', this.getRemainingSessionTime(token) / 1000) : storage.unset('auth0AccessToken', 'cookie');
    },
​
    set wpAccessToken(token) {
        document.cookie = "wpAccessToken" + "=" + token + ";expires=" + this.getRemainingSessionTime(token) / 1000 + ";domain=.charitableimpact.com;path=/";
    },
​
    set wpUserId(userId) {
        document.cookie = "wpUserId" + "=" + userId + ";domain=.charitableimpact.com;path=/";
    },
​
    /**
     * Erase Auth0 data from local
     * @method empty
     * @return {null} - null since "empty"
     */
    empty() {
        this.accessToken = null;
        this.userEmail = null;
        this.userId = null;
        this.wpAccessToken = null;
​
        return null;
    },
​
    /**
     * IEEE Std 1003.1: "Seconds Since the Epoch"
     * @typedef {integer} NumericDate
     * @see http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16
     */
​
    /**
     * Retrieves the id token from storage, decodes it, extracts the expiry, and instantiates it as
     * a Date.
     *
     * This is not feasible to spec because it requires generating signed tokens with a dynamic
     * expiry date.
     * @method getJwtExp
     * @param {string} token - The JSON Web Token
     * @return {(NumericDate|null)} auth0.jwtTimes - Time in seconds, since the epoch, until the
     * token expires.
     */
    getJwtExp(token) /* istanbul ignore next */ {
        try { // jwt-decode throws an error for a malformed token
            const { exp } = jwt(token);
​
            if (exp) { return exp; }
​
            console.error('[JWT] Expiry time is missing.');
        } catch (e) { console.error(e); }
​
        return null;
    },
​
    /**
     * @method getRemainingSessionTime
     * @param {string} token - The JSON Web Token
     * @return {integer} - The amount of time in milliseconds remaing for the supplied JWT.
     */
    getRemainingSessionTime(token) {
        const exp = this.getJwtExp(token);
        if (!exp) { return 0; }
​
        const expiry = new Date(exp * 1000); // seconds --> milliseconds
        const now = new Date();
        return (expiry > now)
            ? (expiry - now)
            : 0;
    },
    /**
     * By default, this property will base its value on `pathname`.
     *
     * A temporary value for this can be set via `auth0.initialScreen = '/next/value'`; its value
     * will be used the next time `initialScreen` is checked, and then it reverts back to its
     * default behaviour.
     * @property {string} auth0.initialScreen - Which Lock screen to display on load.
     * @see https://auth0.com/docs/libraries/lock/v11/configuration#initialscreen-string-
     */
    get initialScreen() {
        if (_auth0lockInitialScreen) {
            const cache = _auth0lockInitialScreen;
​
            _auth0lockInitialScreen = '';
            return cache;
        }
        if (!_.isEmpty(window) && !_.isEmpty(window.location)
            && !_.isEmpty(window.location.pathname)) {
            return lockScreenMap[
                window.location.pathname
                    .slice(1)
                    .split('/')[1]
            ];
        }
        return lockScreenMap.login;
    },
    set initialScreen(val) {
        _auth0lockInitialScreen = val;
    },
    get lock() {
        if (_auth0lock) { return _auth0lock; }
​
        return _makeLock(); // eslint-disable-line no-use-before-define
        // this is a catch-0.22: this needs to reference _makeLock,
        // which needs to make references to other props on auth0
    },
​
    /**
     * @property {boolean} auth0.resendEmail - Whether the email address verification should be
     * re-sent.
     */
    get resendEmail() {
        return storage.get('auth0ResendEmail', 'local');
    },
    /**
     * ⚠️ When this value needs to be "read" within the same process tick, use `await` (possibly
     * with try/catch) to avoid a race condition.
     * @param {string} email - The email to cache.
     * @return {promise} - The promise returned by Storage.
     *
     * @example
     * await (auth0.resendEmail = true);
     */
    set resendEmail(email) {
        return email
            ? storage.set('auth0ResendEmail', email, 'local')
            : storage.unset('auth0ResendEmail', 'local');
    },
​
    /**
     * @property {string} auth0.returnProps - Where to return after Auth0 authentication redirect.
     */
    get returnProps() {
        let returnProps = storage.get('auth0ReturnProps', 'local');
        if (typeof returnProps !== 'object') {
            returnProps = JSON.parse(returnProps);
        }
        if (isUndefinedOrEmpty(returnProps)) {
            returnProps = {
                returnTo: '/dashboard',
                signupSource: 'homepage',
            };
        } else {
            if (isUndefinedOrEmpty(returnProps.returnTo)) {
                returnProps.returnTo = '/dashboard';
            }
            if (isUndefinedOrEmpty(returnProps.signupSource)) {
                returnProps.signupSource = 'homepage';
            }
        }
​
        return returnProps;
    },
    /**
     * ⚠️ When this value needs to be "read" within the same process tick, use `await` (possibly
     * with try/catch) to avoid a race condition.
     * @param {string} val - The props to cache.
     * @return {promise} - The promise returned by Storage.
     *
     * @example
     * await (auth0.returnProps = returnProps);
     */
    set returnProps(val) {
        if (_.isEmpty(val)) {
            return storage.unset('auth0ReturnProps', 'local');
        }
​
        if (val.return_to) {
            val.returnTo = val.return_to;
            delete val.return_to;
        }
​
        if (val.signup_source) {
            val.signupSource = val.signup_source;
            delete val.signup_source;
        }
​
        if (val.signup_source_id) {
            val.signupSourceId = val.signup_source_id;
            delete val.signup_source_id;
        }
​
        const chimpLogin = [
            'beneficiaryClaimToken',
            'claimGift',
            'communitySlug',
            'groupSlug',
            'inviteClaimToken',
            'returnTo',
            'signupSource',
            'signupSourceId',
        ];
        return storage.set(
            'auth0ReturnProps',
            _.pick(val, chimpLogin),
            'local',
        );
    },
    /**
    *@param  {function} storeDispatch - returns react-redux dispatch function
    */
    get storeDispatch() {
        return storeDispatch;
    },
​
    /**
    * This module is helper function hence we cant connect to store in order to dispatch an action,
    * we are setting this value in  Oatuh callback and using  dispatch fn
    *@param  {function} dispatch - stores react-redux dispatch function
    */
    set storeDispatch(dispatch) {
        storeDispatch = dispatch;
    },
​
    /**
     * @property {string} auth0.userEmail - The email address of user registered with Auth0.
     */
    get userEmail() {
        return storage.get('auth0UserEmail', 'local');
    },
    /**
     * ⚠️ When this value needs to be "read" within the same process tick, use `await` (possibly
     * with try/catch) to avoid a race condition.
     * @param {string} email - The email to cache.
     * @return {promise} - The promise returned by Storage.
     *
     * @example
     * await (auth0.userEmail = emailAddress);
     */
    set userEmail(email) {
        return email
            ? storage.set('auth0UserEmail', email, 'local')
            : storage.unset('auth0UserEmail', 'local');
    },
​
    /**
     * @property {string} auth0.userId - The id assigned by Auth0 to the user.
     */
    get userId() {
        return storage.get('auth0UserId', 'local');
    },
    /**