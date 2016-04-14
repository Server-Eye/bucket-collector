var buckets = require('../dataStore').buckets;
var settings = require('../dataStore').settings;
var logger = require('../config').bucketLogger;
var apiUrl = require('../config').config.apiUrl;
var reactor = require('./reactor');
var Q = require('q');
var request = require('request');

/**
 * Calls `getNew`, resolves an array of the currently active messages for the requested bId
 * 
 * @param {String} bId
 * @return {promise}
 */
function get(bId) {
    var deferred = Q.defer();
    var bucket = buckets[bId];

    getNew(bId).then(function(messages) {
        if (messages.length > 0) {
            bucket.stats.lastReceived = new Date().getTime();
        }
        messages.forEach(function(message) {
            message.date = new Date().getTime();
            bucket.messages.active.push(message);
            bucket.stats.messages.total++;
        });
    }).fail(function(reason) {
        bucket.messages.failed.push({
            error: true,
            response: reason,
            ts: new Date().getTime()
        });
        bucket.stats.messages.failed++;
    }).finally(function() {
        deferred.resolve(bucket);
    });

    return deferred.promise;
}

/**
 * Loads new messages for the given bId from the server-eye API `/customer/bucket/:bId/empty`, resolves with a message-array or rejects with an error-message
 * 
 * @param {String} bId
 * @return {promise}
 */
function getNew(bId) {
    var deferred = Q.defer();

    var options = {
        url: apiUrl + 'customer/bucket/' + bId + '/empty',
        method: 'GET',
        qs: {
            apiKey: settings.getApiKey()
        }
    };

    buckets[bId].stats.lastChecked = new Date().getTime();

    logger.debug("Loading new messages from bucket", bId);

    request(options, function(err, res, body) {
        if (err) {
            logger.warn("Could not load new messages from", bId, ":", err);
            deferred.reject(err);
        } else {
            try {
                var result = JSON.parse(body);
                logger.debug(result.length.toString(), "new messages loaded from", bId);

                result.forEach(function(message) {
                    message.try = 0;
                });
                deferred.resolve(result);
            } catch (err) {
                logger.warn("Error in parsing response for", bId, err);
                deferred.reject(body);
            }
        }
    });

    return deferred.promise;
}

/**
 * Initalizes bucket-object, adds base for new active buckets, removes no longer active buckets 
 */
function init() {
    logger.info('Initializing buckets');
    var activeBIds = settings.getActiveBucketIds();
    activeBIds.forEach(function(bId) {
        if (!buckets[bId]) {
            logger.info("Adding bucket", bId, "to active buckets");
            buckets[bId] = {
                messages: {
                    active: [],
                    failed: [],
                    success: []
                },
                stats: {
                    lastResult: "NONE",
                    lastChecked: null,
                    lastReceived: null,
                    messages: {
                        total: 0,
                        failed: 0,
                        success: 0
                    },
                    reactCalls: {
                        total: 0,
                        failed: 0,
                        success: 0
                    }
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

/**
 * @ignore
 */
(function($) {
    init();
    $.get = get;
    $.getNew = getNew;
    $.init = init;
})(exports);