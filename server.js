const express = require('express');
const next = require('next');
const routes = require('./routes');
const frameguard = require('frameguard');
const app = next({dev: process.env.NODE_ENV !== 'production'});
const nextI18NextMiddleware = require('next-i18next/middleware');
const nextI18next = require('./i18n');
const handler = routes.getRequestHandler(app);
// With express
const port = (process.env.PORT) ? process.env.PORT : 3000;
app.prepare().then(() => {
    const server = express();
    const handleTrailingSlashes = (req, res, nxt) => {
        const test = /\?[^]*\//.test(req.url);
        if (req.url.substr(-1) === '/' && req.url.length > 1 && !test) {
            res.redirect(301, req.url.slice(0, -1));
        } else {
            nxt();
        }
    };
    server.use(frameguard({ action: 'SAMEORIGIN' }));
    server.use(handleTrailingSlashes);
    server.use(nextI18NextMiddleware(nextI18next));
    server.use(handler);
    server.listen(process.env.PORT || 3000);
});
