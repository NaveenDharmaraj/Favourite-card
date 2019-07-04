const routes = require('next-routes')

module.exports = routes()
    .add('donation', '/donations/:step')
    .add('give-to-charities', '/give/to/charity/:slug/:gift/:step', 'charities') 
    .add('give-to-charities-mid-pages', '/give/to/charity/:slug/:step', 'charities')   
    .add('give-from-to-charity', '/give/to/charity/:step', 'charities')
