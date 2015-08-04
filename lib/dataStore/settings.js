var jsop = require('jsop');
var path = require('path');
var dataDir = require('../config').config.dataDir;

var _settings = jsop(path.join(dataDir, 'settings.json'));

if(!_settings.activeBucketIds || !_settings.activeBucketIds.length){
    _settings.activeBucketIds = [];
}

function getApiKey(){
    return _settings.apiKey;
}

function setApiKey(key){
    _settings.apiKey = key;
    return key;
}

function getUrl(){
    return _settings.Url;
}

function setUrl(url){
    _settings.Url = url;
    return url;
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

module.exports = {
    getApiKey: getApiKey,
    setApiKey: setApiKey,
    getUrl: getUrl,
    setUrl: setUrl,
    getType: getType,
    setType: setType,
    getInterv: getInterv,
    setInterv: setInterv,
    getActiveBucketIds: getActiveBucketIds,
    setActiveBucketIds: setActiveBucketIds
};

