//var jsop = require('jsop');
var path = require('path');
var fs = require('fs');
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
        try {
            fs.accessSync(path.join(reactionDataDir, reactionName + '.json'), fs.constants.R_OK | fs.constants.W_OK);
        } catch (e) {
            logger.warn('Could not load ' + reactionName + '.json: ' + e);

            _reactions[reactionName] = {};

            fs.writeFileSync(path.join(reactionDataDir, reactionName + '.json'), JSON.stringify(_reactions[reactionName]), 'utf8');
        }

        try {
            var str = fs.readFileSync(path.join(reactionDataDir, reactionName + '.json'), 'utf8');
            _reactions[reactionName] = JSON.parse(str);
        } catch (e) {
            logger.error('Could not read ' + reactionName + '.json: ' + e);
        }
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
        _reactions[reactionName] = {};
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

    updateFile(reactionName);

    return getData(reactionName);
}

function updateFile(reactionName) {
    try {
        fs.writeFileSync(path.join(reactionDataDir, reactionName + '.json'), JSON.stringify(_reactions[reactionName], null, 2), 'utf8');
    } catch (e) {
        logger.error('Could not update ' + reactionName + '.json: ' + e);
    }
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