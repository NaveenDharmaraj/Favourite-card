const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');


const configVars = {
    publicRuntimeConfig: {
        AMZ_TRACE_ID_VERSION: process.env.AMZ_TRACE_ID_VERSION,
        PARAMSTORE_APP_NAME: process.env.PARAMSTORE_APP_NAME,
        PARAMSTORE_ENV_NAME: process.env.PARAMSTORE_ENV_NAME,
        PARAMSTORE_NAME_SPACE: process.env.PARAMSTORE_NAME_SPACE,
        CHAT_GROUP_DEFAULT_AVATAR:process.env.CHAT_GROUP_DEFAULT_AVATAR,
        APP_URL_ORIGIN: process.env.APP_URL_ORIGIN,
        AUTH0_CONFIGURATION_BASE_URL: process.env.AUTH0_CONFIGURATION_BASE_URL,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_WEB_AUDIENCE: process.env.AUTH0_WEB_AUDIENCE,
        AUTH0_WEB_CLIENT_ID: process.env.AUTH0_WEB_CLIENT_ID,
        BASIC_AUTH_KEY: process.env.BASIC_AUTH_KEY,
        BRANCH_IO_KEY: process.env.BRANCH_IO_KEY,
        CORE_API_BASE: process.env.CORE_API_BASE,
        CORE_API_DOMAIN: process.env.CORE_API_DOMAIN,
        CORE_API_VERSION: process.env.CORE_API_VERSION,
        CORP_DOMAIN: process.env.CORP_DOMAIN,
        ENABLE_CONSOLE_LOGGING: process.env.ENABLE_CONSOLE_LOGGING,
        EVENT_API_BASE: process.env.EVENT_API_BASE,
        GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
        GRAPH_API_BASE: process.env.GRAPH_API_BASE,
        GTM_AUTH: process.env.GTM_AUTH,
        GTM_ENV_NUMBER: process.env.GTM_ENV_NUMBER,
        GTM_ID: process.env.GTM_ID,
        HELP_CENTRE_URL: process.env.HELP_CENTRE_URL,
        HELP_SCOUT_KEY: process.env.HELP_SCOUT_KEY,
        HUBSPOT_FORM_ID: process.env.HUBSPOT_FORM_ID,
        HUBSPOT_PORTAL_ID: process.env.HUBSPOT_PORTAL_ID,
        LOG_LEVEL: process.env.LOG_LEVEL,
        LOGDNA_APP_NAME: process.env.LOGDNA_APP_NAME,
        LOGDNA_PUBLIC_INGESTION_KEY: process.env.LOGDNA_PUBLIC_INGESTION_KEY,
        NEWRELIC_ENV: process.env.NEWRELIC_ENV,
        NODE_ENV: process.env.NODE_ENV,
        RAILS_APP_URL_ORIGIN: process.env.RAILS_APP_URL_ORIGIN,
        ROR_AUTH_API_BASE: process.env.ROR_AUTH_API_BASE,
        ROR_AUTH_API_DOMAIN: process.env.ROR_AUTH_API_DOMAIN,
        ROR_AUTH_API_VERSION: process.env.ROR_AUTH_API_VERSION,
        SEARCH_API_BASE: process.env.SEARCH_API_BASE,
        SECURITY_API_BASE: process.env.SECURITY_API_BASE,
        SOCIAL_API_DOMAIN: process.env.SOCIAL_API_DOMAIN,
        SOCIAL_API_VERSION: process.env.SOCIAL_API_VERSION,
        STRIPE_KEY: process.env.STRIPE_KEY,
        STRIPE_URL: process.env.STRIPE_URL,
        TOAST_MESSAGE_TIMEOUT: process.env.TOAST_MESSAGE_TIMEOUT,
        UTILITY_API_BASE: process.env.UTILITY_API_BASE,
        WP_API_VERSION: process.env.WP_API_VERSION,
        WP_DOMAIN_BASE: process.env.WP_DOMAIN_BASE,
    },
};

module.exports = withPlugins([
    [
        withLess,
    ],
    [
        withImages,
    ],
    [
        configVars,
    ],
]);
