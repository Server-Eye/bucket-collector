var settings = require('./dataStore/settings');
var buckets = require('./dataStore/buckets');

/**
 * Exports both buckets- and settings-interface in one module
 * 
 * @type exports
 */
module.exports = {
    settings: settings,
    buckets: buckets
};