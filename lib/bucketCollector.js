var settings = require('./dataStore').settings;
var buckets = require('./bucketCollector/bucketsService');
var logger = require('./config').bucketLogger;
var reactor = require('./bucketCollector/reactor');
var Q = require('q');

var intervalId = null;
var instanceFinished = null;

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

function init(interval) {
    buckets.init();
    intervalId = setInterval(instance, interval * 60 * 1000);
    logger.info("Collection-interval started");
    logger.debug("Current interval:", interval * 60 * 1000, "ms");
    instance();
}

(function ($) {
    $.start = start;
})(exports);