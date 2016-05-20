var jsop = require('jsop');
var path = require('path');
var reactionDataDir = require('../config').config.reactionDataDir;
var logger = require('../config').bucketLogger;

var _reactions = {};

/**
 * Returns the data for the given reactionName
 * 
 * @param {string} reactionName
 * @returns {Array|Object}
 */
function getData(reactionName) {
    if (!_reactions[reactionName]) {
        createData(reactionName);
    }

    return JSON.parse(JSON.stringify(_reactions[reactionName]));
}

/**
 * Sets the given data as the reaction-data for the given name.
 * 
 * @param {string} reactionName
 * @param {Object|Array} data
 * @returns {Object|Array}
 */
function setData(reactionName, data) {
    if (!_reactions[reactionName]) {
        createData(reactionName);
    }
    
    for (key in _reactions[reactionName]) {
        if (_reactions[reactionName].hasOwnProperty(key)) {
            delete _reactions[reactionName][key];
        }
    }
    
    for (key in data) {
        if (data.hasOwnProperty(key)) {
            _reactions[reactionName][key] = data[key];
        }
    }

    return getData(reactionName);
}

/**
 * Creates a new reaction-data-file for the given name.
 * 
 * @param {string} reactionName
 * @returns {Object|Array}
 */
function createData(reactionName) {
    _reactions[reactionName] = jsop(path.join(reactionDataDir, reactionName + '.json'));
    return _reactions[reactionName];
}

/**
 * Returns a interface for the given reactionName
 * 
 * @param {string} reactionName
 * @returns {Object}
 */
module.exports = function(reactionName) {
    var reactionName = reactionName;
    return {
        get: function() {
            return getData(reactionName);
        },
        set: function(data) {
            return setData(reactionName, data);
        }
    };
};