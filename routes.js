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
    .add('group-profile', '/groups/:slug', 'groupProfile')
    .add('notification', '/notifications/:msgId')
    .add('chat', '/chats/:msgId')
    .add('campaign-profile', '/campaigns/:slug', 'campaignProfile')
    .add('charity-profile', '/charities/:slug', 'charityProfile')
    .add('IssuedTaxReceipientDonationsList', '/user/tax-receipts', 'taxReceipientDonationsList')
    .add('IndividualTaxDoantionsListDetails', '/user/tax-receipts/:slug', 'IndividualTaxDoantionsList')
    .add('friendsProfile', '/users/profile/:slug', 'friendsProfile')
    .add('myFriendsPage', '/users/profile/:slug/:step', 'friendsProfile')
    .add('myProfileSettings', '/user/profile/:slug/:step', 'myProfile')
    .add('myProfile', '/user/profile/:slug', 'myProfile')
    .add('claimP2P', '/claim/gift/:claimToken', 'claimP2P');
