const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const configVars = {
    publicRuntimeConfig: {
        APP_URL_ORIGIN: process.env.APP_URL_ORIGIN,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_WEB_AUDIENCE: process.env.AUTH0_WEB_AUDIENCE,
        AUTH0_WEB_CLIENT_ID: process.env.AUTH0_WEB_CLIENT_ID,
        BASIC_AUTH_KEY: process.env.BASIC_AUTH_KEY,
        CORE_API_BASE: process.env.CORE_API_BASE,
        CORE_API_DOMAIN: process.env.CORE_API_DOMAIN,
        CORE_API_VERSION: process.env.CORE_API_VERSION,
        ENABLE_CONSOLE_LOGGING: process.env.ENABLE_CONSOLE_LOGGING,
        EVENT_API_BASE: process.env.EVENT_API_BASE,
        GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
        GRAPH_API_BASE: process.env.GRAPH_API_BASE,
        HELP_SCOUT_KEY: process.env.HELP_SCOUT_KEY,
        LOG_LEVEL: process.env.LOG_LEVEL,
        LOGDNA_PUBLIC_INGESTION_KEY: process.env.LOGDNA_PUBLIC_INGESTION_KEY,
        LOGDNA_APP_NAME: process.env.LOGDNA_APP_NAME,
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
        UTILITY_API_BASE: process.env.UTILITY_API_BASE,
        APPLOZIC_WS_URL:process.env.APPLOZIC_WS_URL,
        APPLOZIC_APP_KEY: process.env.APPLOZIC_APP_KEY,
        FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MSG_SENDER_ID: process.env.FIREBASE_MSG_SENDER_ID,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID
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
