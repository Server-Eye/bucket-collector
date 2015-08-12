var logger = require('./config').reactionLogger;
var buckets = require('./bucketsService');

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
        var promises = [];
        var failedMessages = [];

        buckets.get(bId).then(function (bucket) {
            logger.info("Starting reaction for bucket", bId);
            logger.debug(bucket.content.length.toString(),"Message(s) in bucket", bId);
            bucket.content.forEach(function (message) {
                promises.push(reactor[type].react(message).then(function (res) {
                    //console.log("React success");
                }).fail(function (err) {
                    //console.log("React failed");
                    failedMessages.push(message);
                }));
            });

            Q.allSettled(promises).then(function () {
                if(failedMessages.length){
                    bucket.content = failedMessages;
                }
                logger.info("Finished reaction for bucket", bId);
                logger.debug(bucket.content.length.toString(),"Message(s) in bucket", bId);
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
        logger.info('Loading reactiontype: ' + name);
        var checkTypeName = name.slice(0, name.length - 3);
        reactor[checkTypeName] = require(path.join(basedir, name));
        count++;
    });

    logger.info('Finished loading reactiontypes');
    logger.info(count + ' reactiontype(s) loaded');
}

(function ($) {
    loadReactions();
    $.react = react;
})(exports);