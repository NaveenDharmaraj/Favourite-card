const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');

const withImages = require('next-images')

module.exports = withPlugins([
    [withLess],
    [withImages],
]);
