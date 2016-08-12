var path = require('path');
var fs = require('fs');
var logger = require('../config').appLogger;
var dataDir = require('../config').config.bucketDataDir;
var settingsPath = path.join(dataDir, 'settings.json');
var _settings;

function init() {
    try {
        fs.accessSync(settingsPath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (e) {
        logger.warn('Could not load settings.json: ' + e);
        logger.warn('Resetting settings.json...');

        _settings = {};

        fs.writeFileSync(settingsPath, '{}', 'utf8');
    }

    var _settingsString = fs.readFileSync(settingsPath, 'utf8');
    _settings = JSON.parse(_settingsString);

    if (!_settings.activeBucketIds || !_settings.activeBucketIds.length) {
        _settings.activeBucketIds = [];
    }
    if (!_settings.interval) {
        _settings.interval = 5;
    }

    if (!_settings.maxRetries) {
        _settings.maxRetries = 2;
    }

    fs.writeFileSync(settingsPath, JSON.stringify(_settings, null, 2), 'utf8');
}

init();


function updateFile() {
    fs.writeFile(settingsPath, JSON.stringify(_settings, null, 2), 'utf8', function(err) {
        if (err) {
            logger.error('Could not update settings.json: ' + e);
        } else {
            logger.debug('Updated settings.json');
        }
    });
}

/**
 * Getter for the current apiKey
 * 
 * @return {String}
 */
function getApiKey() {
    return _settings.apiKey;
}

/**
 * Setter for the current apiKey.
 * 
 * @param {String} key new apiKey
 * @return {String}
 */
function setApiKey(key) {
    _settings.apiKey = key;
    updateFile();
    return key;
}

/**
 * Getter for the currently available types
 * 
 * @return {Array}
 */
function getAvailableTypes() {
    return _settings.availableTypes;
}

/**
 * Setter for the currently available types.
 * 
 * @param {String|Array} aTypes New typestring or array of typestrings
 * @return {Array}
 */
function setAvailableTypes(aTypes) {
    if (typeof aTypes === 'string')
        _settings.availableTypes = [aTypes];
    else
        _settings.availableTypes = aTypes;

    updateFile();

    return _settings.availableTypes;
}

/**
 * Getter for the currently active type
 * 
 * @return {String}
 */
function getType() {
    return _settings.type;
}

/**
 * Setter for the currently active types.
 * 
 * @param {String} type New active type
 * @return {String}
 */
function setType(type) {
    _settings.type = type;

    updateFile();

    return type;
}

/**
 * Getter for the currently active interval (in minutes)
 * 
 * @return {Number}
 */
function getInterv() {
    return _settings.interval;
}

/**
 * Setter for the currently active interval (in minutes)
 * 
 * @param {Number} interval New interval (in minutes)
 * @return {Number}
 */
function setInterv(interval) {
    _settings.interval = interval;

    updateFile();

    return interval;
}

/**
 * Getter for the currently active bucketIds
 * 
 * @return {Array}
 */
function getActiveBucketIds() {
    return _settings.activeBucketIds;
}

/**
 * Setter for the currently active bucketIds
 * 
 * @param {Array} bidArr
 * @return {Array}
 */
function setActiveBucketIds(bidArr) {
    _settings.activeBucketIds = bidArr;

    updateFile();

    return bidArr;
}

/**
 * Getter for the number of max retries per message
 * 
 * @return {Number}
 */
function getMaxRetries() {
    return _settings.maxRetries;
}

/**
 * Setter for the number of max retries per message
 * 
 * @param {Number} maxRetries
 * @return {Number}
 */
function setMaxRetries(maxRetries) {
    _settings.maxRetries = maxRetries;

    updateFile();

    return maxRetries;
}

function getSettings() {
    return JSON.parse(JSON.stringify(_settings));
}

/**
 * Returns true if all required settings are set, return an errormessage if not.
 * 
 * @return {String|Boolean}
 */
function checkSettings() {
    if (typeof _settings.apiKey !== 'string') {
        return "No API-Key set!";
    }

    if (!Array.isArray(_settings.activeBucketIds) || _settings.activeBucketIds.length === 0) {
        return "No active buckets set!";
    }

    if (!Array.isArray(_settings.availableTypes) || _settings.availableTypes.length === 0) {
        return "No reactiontypes available!";
    }

    if (typeof _settings.type !== 'string') {
        return "No reactiontype-string set!";
    } else {
        if (_settings.availableTypes.indexOf(_settings.type) < 0) {
            return "Set reactiontype is unknown!";
        }
    }


    if (typeof _settings.interval !== 'number') {
        return "No interval set!";
    }

    if (typeof _settings.maxRetries !== 'number') {
        return "No maxRetries set!";
    }

    return true;
}

/**
 * 
 * @ignore
 */
module.exports = {
    getApiKey: getApiKey,
    setApiKey: setApiKey,
    getType: getType,
    setType: setType,
    getAvailableTypes: getAvailableTypes,
    setAvailableTypes: setAvailableTypes,
    getInterv: getInterv,
    setInterv: setInterv,
    getActiveBucketIds: getActiveBucketIds,
    setActiveBucketIds: setActiveBucketIds,
    getMaxRetries: getMaxRetries,
    setMaxRetries: setMaxRetries,
    getSettings: getSettings,
    checkSettings: checkSettings
};