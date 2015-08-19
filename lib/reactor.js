var logger = require('./config').reactionLogger;
var buckets = require('./bucketsService');
var settings = require('./dataStore').settings;

var fs = require('fs');
var path = require('path');
var Q = require('q');

var reactor = {};


function react(bId, type) {
    var deferred = Q.defer();

    if (!reactor[type]) {
        logger.error("No reaction for", type, "defined!");
        deferred.reject("No reaction for", type, "defined!");
    } else {
        buckets.get(bId).then(function (bucket) {
            var promises = [];
            var failedMessages = [];
            
            logger.info("Starting reaction for bucket", bId);
            logger.debug(bucket.messages.active.length.toString(),"Message(s) in bucket", bId);
            while(bucket.messages.active.length > 0){
                bucket.stats.reactCalls.total++;
                var message = bucket.messages.active.shift();
                promises.push(reactor[type].react(message).then(function (message) {
                    if(!message.error){
                        bucket.stats.reactCalls.success++;
                        bucket.stats.messages.success++;
                        bucket.messages.success.push(message);
                    } else {
                        bucket.stats.reactCalls.failed++;
                        failedMessages.push(message);
                    }
                }));
            };

            Q.allSettled(promises).then(function () {
                logger.debug("All promises settled in reactor!");
                if(failedMessages.length){
                    failedMessages.forEach(function(failedMessage){
                        if(failedMessage.try >= settings.getMaxRetries()){
                            bucket.stats.messages.failed++;
                            bucket.messages.failed.push(failedMessage);
                        } else {
                            bucket.messages.active.push(failedMessage);
                        }
                    });
                }
                if(bucket.messages.success.length > 100){
                    bucket.messages.success.splice(0, bucket.messages.success.length - 100);
                }
                if(bucket.messages.failed.length > 100){
                    bucket.messages.failed.splice(0, bucket.messages.failed.length - 100);
                }
                
                logger.info("Finished reaction for bucket", bId);
                logger.debug(bucket.messages.active.length.toString(),"Message(s) in bucket", bId);
                deferred.resolve();
            });
        }).fail(function(err){
            deferred.reject(err);
        });
    }

    return deferred.promise;
}

function loadReactions() {
    logger.info('Start loading checktypes');

    var basedir = path.join(__dirname, './reactiontypes');

    var names = fs.readdirSync(basedir);
    var count = 0;

    names.forEach(function (name) {
        if (name[0] == '-') {
            logger.warn('scipping reactiontype: ' + name);
            return;
        }
        if (fs.statSync(path.join(basedir, name)).isFile()) {
            logger.info('Loading reactiontype: ' + name);
            var checkTypeName = name.slice(0, name.length - 3);
            reactor[checkTypeName] = require(path.join(basedir, name));
            count++;
        }
    });

    logger.info('Finished loading reactiontypes');
    logger.info(count + ' reactiontype(s) loaded');
}

(function ($) {
    loadReactions();
    $.react = react;
})(exports);