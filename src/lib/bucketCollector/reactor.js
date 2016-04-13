var logger = require('../config').reactionLogger;
var buckets = require('./bucketsService');
var settings = require('../dataStore').settings;
var reactionDir = require('../config').config.reactionDir;

var fs = require('fs');
var path = require('path');
var Q = require('q');

var reactor = {};
var timeout = 10000;

/**
 * Calls bucketService.get() with the given bId, performes given reaction for each received message.
 * Readds failed messages to messagequeue if maxRetries is not reached.
 * Resolves the promise when each reaction is finished. Rejects if an error occurs.
 * 
 * @param {string} bId
 * @param {string} type
 * @return {promise}
 */
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
            logger.debug(bucket.messages.active.length.toString(), "Message(s) in bucket", bId);
            if (bucket.messages.active.length > 0) {
                bucket.stats.reactCalls.total++;
                var message = bucket.messages.active.shift();
                if (!message.try) {
                    message.try = 0;
                }
                message.try++;

                var nextMessage = getCallbackFunction(type, bucket, failedMessages, promises);
                logger.debug("Starting reaction of first message");
                promises.push(reactor[type].react(message).timeout(timeout).fail(function (err) {
                    logger.warning('ERROR in reaction ' + type, err)
                    var _message = JSON.parse(JSON.stringify(message));
                    _message.error = true;
                    _message.response = err;

                    return Q.resolve(_message);
                }).then(nextMessage));
            }

            Q.allSettled(promises).then(function () {
                logger.debug("All promises settled in reactor!");
                if (failedMessages.length) {
                    failedMessages.forEach(function (failedMessage) {
                        if (failedMessage.try >= settings.getMaxRetries()) {
                            bucket.stats.messages.failed++;
                            bucket.messages.failed.push(failedMessage);
                        } else {
                            bucket.messages.active.push(failedMessage);
                        }
                    });
                }
                if (bucket.messages.success.length > 100) {
                    bucket.messages.success.splice(0, bucket.messages.success.length - 100);
                }
                if (bucket.messages.failed.length > 100) {
                    bucket.messages.failed.splice(0, bucket.messages.failed.length - 100);
                }

                logger.info("Finished reaction for bucket", bId);
                logger.debug(bucket.messages.active.length.toString(), "Message(s) in bucket", bId);
                deferred.resolve();
            });
        }).fail(function (err) {
            deferred.reject(err);
        });
    }

    return deferred.promise;
}


/**
 * Loads all reactions from the reactiontypes-directory, ignores folders.
 */
function loadReactions() {
    logger.info('Start loading reactiontypes from', reactionDir);


    var names = fs.readdirSync(reactionDir);
    var count = 0;
    var reactiontypes = [];

    names.forEach(function (name) {
        if (name[0] == '-') {
            logger.warn('scipping reactiontype: ' + name);
            return;
        }
        if (fs.statSync(path.join(reactionDir, name)).isFile()) {
            var reactionTypeName = name.slice(0, name.length - 3);
            logger.info('Loading reactiontype' + reactionTypeName, 'from', name);
            reactor[reactionTypeName] = require(path.join(reactionDir, name));
            reactiontypes.push(reactionTypeName);
            count++;
        }
    });

    settings.setAvailableTypes(reactiontypes);

    logger.info('Finished loading reactiontypes');
    logger.info(count + ' reactiontype(s) loaded');
}

/**
 * Generates the callback-function with the given parameters.
 * Needed to chain promises to ensure sequential processing of messages.
 * Starts next message-reaction if the current finishes.
 * 
 * @param {string} type
 * @param {Object} bucket
 * @param {Array} failedMessages
 * @param {Array} promises
 * @returns {Function}
 */
function getCallbackFunction(type, bucket, failedMessages, promises) {
    var nextMessage = function (message) {
        logger.debug('Finished reaction!');

        if (!message.error) {
            bucket.stats.lastResult = "SUCCESS";
            bucket.stats.reactCalls.success++;
            bucket.stats.messages.success++;
            bucket.messages.success.push(message);
        } else {
            bucket.stats.lastResult = "FAILED";
            bucket.stats.reactCalls.failed++;
            failedMessages.push(message);
        }

        if (bucket.messages.active.length > 0) {
            bucket.stats.reactCalls.total++;
            var message = bucket.messages.active.shift();
            if (!message.try) {
                message.try = 0;
            }
            message.try++;

            logger.debug('Starting next reaction!');
            var promise = reactor[type].react(message).timeout(timeout).fail(function (err) {
                logger.warning('ERROR in reaction ' + type, err)
                var _message = JSON.parse(JSON.stringify(message));
                _message.error = true;
                _message.response = err;

                return Q.resolve(message);
            }).then(nextMessage);

            promises.push(promise);

            return promise;
        }
    };

    return nextMessage;
}

/**
 * @ignore
 */
(function ($) {
    loadReactions();

    $.reactor = reactor;
    $.react = react;
})(exports);