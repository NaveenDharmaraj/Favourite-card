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
        EVENT_API_BASE: process.env.EVENT_API_BASE,
        GRAPH_API_BASE: process.env.GRAPH_API_BASE,
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
