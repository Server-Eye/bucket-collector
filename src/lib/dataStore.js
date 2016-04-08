var settings = require('./dataStore/settings');
var buckets = require('./dataStore/buckets');
var reactions = require('./dataStore/reactions');

/**
 * Exports both buckets- and settings-interface in one module
 * 
 * @type exports
 */

module.exports = {
    settings: settings,
    buckets: buckets,
    reactions: reactions
};