var jsop = require('jsop');
var path = require('path');
var dataDir = require('../config').config.dataDir;

var _settings = jsop(path.join(dataDir, 'settings.json'));

if(!_settings.activeBucketIds || !_settings.activeBucketIds.length){
    _settings.activeBucketIds = [];
}
if(!_settings.interval){
    _settings.interval = 5;
}

if(!_settings.maxRetries){
    _settings.maxRetries = 3;
}

function getApiKey(){
    return _settings.apiKey;
}

function setApiKey(key){
    _settings.apiKey = key;
    return key;
}

function getAvailableTypes(){
    return _settings.availableTypes;
}

function setAvailableTypes(aTypes){
    if(typeof aTypes === 'string')
        _settings.availableTypes = [aTypes];
    else
        _settings.availableTypes = aTypes;
    
    return _settings.availableTypes;
}

function getType(){
    return _settings.type;
}

function setType(type){
    _settings.type = type;
    return type;
}

function getInterv(){
    return _settings.interval;
}

function setInterv(interval){
    _settings.interval = interval;
    return interval;
}

function getActiveBucketIds(){
    return _settings.activeBucketIds;
}

function setActiveBucketIds(bidArr){
    _settings.activeBucketIds = bidArr;
    return bidArr;
}

function getMaxRetries(){
    return _settings.maxRetries;
}

function setMaxRetries(maxRetries){
    _settings.maxRetries = maxRetries;
    return maxRetries;
}

function checkSettings() {
    if (typeof _settings.apiKey !== 'string') {
        return "No API-Key set!";
    }

    if (!Array.isArray(_settings.activeBucketIds) || _settings.activeBucketIds.length === 0) {
        return "No active buckets set!";
    }

    if(!Array.isArray(_settings.availableTypes) || _settings.availableTypes.length === 0){
        return "No reactiontypes available!";
    }
    
    if (typeof _settings.type !== 'string') {
        return "No reactiontype-string set!";
    } else {
        if(_settings.availableTypes.indexOf(_settings.type) < 0){
            return "Set reactiontype is unknown!"
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
    checkSettings: checkSettings
};

