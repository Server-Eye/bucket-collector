var dataStore = require('./dataStore');
var logger = require('./config').bucketLogger;
var reactor = require('./reactor');
var Q = require('q');

var intervalId = null;

function start(){
    if(intervalId){
        logger.info("Restarting bucketService");
        clearInterval(intervalId);
        intervalId = null;
    } else {
        logger.info("Starting bucketService");
    }
    
    var settings = getSettings();
    
    if(settings){
        instance();
        setInterval(instance, settings.interval * 60 * 1000);
        console.log(settings);
    }
}

function instance(){
    var promises = [];
    var start = new Date();
    
    logger.info("Starting bucketCollector");
    dataStore.settings.getActiveBucketIds().forEach(function(bId){
        logger.debug("Starting reactor for", bId);
        promises.push(reactor.react(bId, dataStore.settings.getType()));
    });
    
    Q.allSettled(promises).then(function(){
        logger.info("BucketCollector finished");
    });
}

function getSettings(){
    var settingsObj = {
        apiKey: dataStore.settings.getApiKey(),
        activeBucketIds: dataStore.settings.getActiveBucketIds(),
        url: dataStore.settings.getUrl(),
        type: dataStore.settings.getType(),
        interval: dataStore.settings.getInterv()
    };
    
    console.log(dataStore.settings.getActiveBucketIds());
    
    if(typeof settingsObj.apiKey !== 'string'){
        logger.warn("No API-Key set!");
        return null;
    }
    
    if(!Array.isArray(settingsObj.activeBucketIds) || settingsObj.activeBucketIds.length === 0){
        logger.warn("No active buckets set!");
        return null;
    }
    
    if(typeof settingsObj.url !== 'string'){
        logger.warn("No url set!");
        return null;
    }
    
    if(typeof settingsObj.type !== 'string'){
        logger.warn("No type-string set!");
        return null;
    }
    
    if(typeof settingsObj.interval !== 'number'){
        logger.warn("No interval set!");
        return null;
    }
    
    logger.info("All settings loaded");
    return settingsObj;
}

(function($){
    $.start = start;
})(exports);