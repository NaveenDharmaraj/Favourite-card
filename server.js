const express = require('express')
const next = require('next')
const routes = require('./routes')
const nextI18NextMiddleware = require('next-i18next/middleware')

const nextI18next = require('./i18n')
const app = next({dev: true})
const handler = routes.getRequestHandler(app)

// With express
app.prepare().then(() => {
    const server = express();
    server.use(nextI18NextMiddleware(nextI18next));
    server.use(handler);
    server.listen(3000);
});
