var settings = require('./dataStore').settings;
var buckets = require('./bucketCollector/bucketsService');
var logger = require('./config').bucketLogger;
var reactor = require('./bucketCollector/reactor');
var Q = require('q');

var intervalId = null;
var instanceFinished = null;

/**
 * Starts/restarts the bucket-collector-interval if all settings are ok.
 * 
 * @return {undefined}
 */
function start() {
    if (intervalId) {
        logger.info("Restarting bucketCollector");
        clearInterval(intervalId);
        intervalId = null;
    } else {
        logger.info("Starting bucketCollector");
    }

    var settingsOK = settings.checkSettings();

    logger.info("Starting collection-interval");
    if (typeof settingsOK === 'string') {
        logger.warn("Collection interval not started:", settingsOK);
    } else {
        if (instanceFinished) {
            instanceFinished.then(function () {
                init(settings.getInterv());
            });
        } else {
            init(settings.getInterv());
        }
    }
}

/**
 * Called on each bucket-collector-interval tick. Starts reactor for each active bucket-id if the previous instance is finished.
 * Skips call if the previous instance is still running.
 * 
 * @return {undefined}
 */
function instance() {
    var deferred = Q.defer();
    if (!instanceFinished || instanceFinished.isFulfilled()) {
        instanceFinished = deferred.promise;

        var promises = [];

        logger.info("Starting bucket collection");
        settings.getActiveBucketIds().forEach(function (bId) {
            logger.debug("Starting reactor for", bId);
            promises.push(reactor.react(bId, settings.getType()));
        });

        Q.allSettled(promises).then(function () {
            logger.info("Bucket collection finished");
            deferred.resolve();
        });
    } else {
        logger.error("Previous bucket collection not finished!");
        logger.error("Skipping instance");
    }
}

/**
 * Initializes the bucket-collector and starts the bucket-collector-interval with the given interval.
 * 
 * @param {number} interval
 * @return {undefined}
 */
function init(interval) {
    buckets.init();
    intervalId = setInterval(instance, interval * 60 * 1000);
    logger.info("Collection-interval started");
    logger.debug("Current interval:", interval * 60 * 1000, "ms");
    instance();
}

/**
 * Exports the start-function.
 * 
 * @param {exports} $
 * @return {undefined}
 */
(function ($) {
    $.start = start;
})(exports);