var buckets = require('./dataStore').buckets;
var settings = require('./dataStore').settings;
var logger = require('./config').bucketLogger;
var apiUrl = require('./config').config.apiUrl;
var reactor = require('./reactor');
var Q = require('q');
var request = require('request');


var debugMsg = require(require('./config').config.dataDir + '/bucket-single-note.json');

function get(bId) {
    var deferred = Q.defer();
    var bucket = buckets[bId];

    getNew(bId).then(function (messages) {
        messages.forEach(function (message) {
            bucket.messages.active.push(message);
            bucket.stats.receivedMessages++;
        });
    }).finally(function () {
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
//        }
//    });

    return deferred.promise;
}

function init() {
    logger.info('Initializing buckets');
    var activeBIds = settings.getActiveBucketIds();
    activeBIds.forEach(function (bId) {
        if (!buckets[bId]) {
            logger.info("Adding bucket", bId, "to active buckets");
            buckets[bId] = {
                messages: {
                    active: [],
                    fail: [],
                    success: []
                },
                stats: {
                    receivedMessages: 0
                }
            };
        }
    });

    for (key in buckets) {
        if (activeBIds.indexOf(key) < 0) {
            logger.warn("Removing bucket", key, "from active buckets");
            delete buckets[key];
        }
    }
}

(function ($) {
    init();
    $.get = get;
    $.getNew = getNew;
    $.init = init;
})(exports);