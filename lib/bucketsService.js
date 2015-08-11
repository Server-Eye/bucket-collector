var buckets = require('./dataStore').buckets;
var settings = require('./dataStore').settings;
var logger = require('./config').bucketLogger;
var apiUrl = require('./config').config.apiUrl;
var reactor = require('./reactor');
var Q = require('q');
var request = require('request');


var debugMsg = require(require('./config').config.dataDir + '/bucket-res.json');

function get(bId) {
    var deferred = Q.defer();
    var bucket = buckets[bId];

    getNew(bId).then(function (messages) {
        messages.forEach(function (message) {
            bucket.content.push(message);
            bucket.stats.receivedMessages++;
        });
        
        deferred.resolve(bucket);
    });

    return deferred.promise;
}

function getNew(bId) {
    var deferred = Q.defer();

    var options = {
        url: apiUrl + 'customer/bucket/' + bId + '/empty',
        method: 'GET',
        qs: {
            apiKey: settings.getApiKey()
        }
    };

    console.log(options);

    logger.debug("Loading new messages from bucket", bId);
    
    deferred.resolve(debugMsg);
    
//    request(options, function (err, res, body) {
//        if (err) {
//            logger.warn("Could not load new messages from", bId, ":", err);
//            deferred.reject(err);
//        } else {
//            try {
//                var result = JSON.parse(body);
//                logger.debug("New messages loaded from", bId);
//                deferred.resolve(result);
//            } catch (err) {
//                logger.warn("Error in parsing response for", bId, err);
//                deferred.resolve(body);
//            }
//            ;
//
//        }
//    });

    return deferred.promise;
}

function init() {
    logger.info('Initializing buckets');
    settings.getActiveBucketIds().forEach(function (bId) {
        if (!buckets[bId]) {
            buckets[bId] = {
                content: [],
                stats: {
                    receivedMessages: 0
                }
            };
        }
    });
}

(function ($) {
    init();
    $.get = get;
    $.getNew = getNew;
    $.init = init;
})(exports);