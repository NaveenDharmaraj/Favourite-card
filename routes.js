const routes = require('next-routes');

module.exports = routes()
    .add('donation', '/donations/:step')
    .add('give-to-charities', '/give/to/charity/:slug/:gift/:step', 'charities')
    .add('give-to-charities-mid-pages', '/give/to/charity/:slug/:step', 'charities')
    .add('give-from-to-charity', '/give/to/charity/:step', 'charities')
    // .add('give-to-group', '/give/to/group/:slug/:gift/:step', 'groups') 
    .add('give-to-group-mid-pages', '/give/to/group/:slug/:step', 'groups')
    .add('give-from-to-group', '/give/to/group/:step', 'groups')
    .add('friends', '/give/to/friend/:step')
    .add('campaign-profile', '/campaigns/:slug', 'campaignProfile')
    .add('charity-profile', '/charities/:slug', 'charityProfile')
    .add('IssuedTaxReceipientDonationsList', '/user/tax-receipts/:slug', 'taxReceipientDonationsList');
