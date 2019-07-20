const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const configVars = {
    publicRuntimeConfig: {
        APP_URL_ORIGIN: process.env.APP_URL_ORIGIN,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_WEB_AUDIENCE: process.env.AUTH0_WEB_AUDIENCE,
        AUTH0_WEB_CLIENT_ID: process.env.AUTH0_WEB_CLIENT_ID,
        CORE_API_BASE: process.env.CORE_API_BASE,
        CORE_API_DOMAIN: process.env.CORE_API_DOMAIN,
        CORE_API_VERSION: process.env.CORE_API_VERSION,
        RAILS_APP_URL_ORIGIN: process.env.RAILS_APP_URL_ORIGIN,
        ROR_AUTH_API_BASE: process.env.ROR_AUTH_API_BASE,
        ROR_AUTH_API_DOMAIN: process.env.ROR_AUTH_API_DOMAIN,
        ROR_AUTH_API_VERSION: process.env.ROR_AUTH_API_VERSION,
        STRIPE_KEY: process.env.STRIPE_KEY,
        STRIPE_URL: process.env.STRIPE_URL,
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
