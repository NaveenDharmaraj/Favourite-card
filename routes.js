const routes = require('next-routes')

module.exports = routes()
    .add('donation', '/donations/:step')
    
