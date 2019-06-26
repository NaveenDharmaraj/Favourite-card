const routes = require('next-routes')

module.exports = routes()
    .add('/','/index')
    .add('donation', '/donations/:step')
    .add('error','/error')
