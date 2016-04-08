var jsop = require('jsop');
var path = require('path');
var reactionDataDir = require('../config').config.reactionDataDir;
var logger = require('../config').bucketLogger;

var _reactions = {};

function getData(reactionName) {
   if(!_reactions[reactionName]){
       createData(reactionName);
   } 
   
   return JSON.parse(JSON.stringify(_reactions[reactionName]));
}

function setData(reactionName, data) {
    if(!_reactions[reactionName]){
        createData(reactionName);
    }
    for(key in data) {
        if(data.hasOwnProperty(key)){
            _reactions[reactionName][key] = data[key];
        }
    }
    
    return getData(reactionName);
}

function createData(reactionName){
    _reactions[reactionName] = jsop(path.join(reactionDataDir, reactionName + '.json'));
    return _reactions[reactionName];
}

module.exports = function (reactionName) {
    var reactionName = reactionName;
    return {
        get: function(){
            return getData(reactionName);
        },
        set: function(data){
            return setData(reactionName,data);
        }
    };
};