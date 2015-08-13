var dataStore = require('./dataStore');
var buckets = require('./bucketsService');
var logger = require('./config').bucketLogger;
var reactor = require('./reactor');
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

    var settings = getSettings();

    logger.info("Starting collection-interval");
    if (typeof settings === 'string') {
        logger.warn("Collection interval not started:", settings);
    } else {
        if (instanceFinished) {
            instanceFinished.then(function () {
                init(settings);
            });
        } else {
            init(settings);
        }
    }
}

function instance() {
    var deferred = Q.defer();
    if (!instanceFinished || instanceFinished.isFulfilled()) {
        instanceFinished = deferred.promise;

        var promises = [];

        logger.info("Starting bucket collection");
        dataStore.settings.getActiveBucketIds().forEach(function (bId) {
            logger.debug("Starting reactor for", bId);
            promises.push(reactor.react(bId, dataStore.settings.getType()));
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

function getSettings() {
    var settingsObj = {
        apiKey: dataStore.settings.getApiKey(),
        activeBucketIds: dataStore.settings.getActiveBucketIds(),
        type: dataStore.settings.getType(),
        interval: dataStore.settings.getInterv()
    };

    if (typeof settingsObj.apiKey !== 'string') {
        return "No API-Key set!";
    }

    if (!Array.isArray(settingsObj.activeBucketIds) || settingsObj.activeBucketIds.length === 0) {
        return "No active buckets set!";
    }

    if (typeof settingsObj.type !== 'string') {
        return "No reactiontype-string set!";
    }

    if (typeof settingsObj.interval !== 'number') {
        return "No interval set!";
    }

    logger.info("All settings loaded");
    return settingsObj;
}

function init(settings) {
    buckets.init();
    intervalId = setInterval(instance, settings.interval * 60 * 1000);
    logger.info("Collection-interval started");
    logger.debug("Current interval:", settings.interval * 60 * 1000, "ms");
    instance();
}

(function ($) {
    $.start = start;
})(exports);