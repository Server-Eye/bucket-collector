var dataStore = require('../../dataStore');
var bucketCollector = require('../../bucketCollector');
var logger = require('../../config').settingsLogger;

/**
 * Applies all settings from the given request query
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function setSettings(req, res, next) {
    var settings = {
        activeBucketIds: [],
        interval: 5
    };

    var remoteSettings = req.body;

    var apiKey = remoteSettings.apiKey;
    var interval = remoteSettings.interval;
    interval = +interval;
    var maxRetries = remoteSettings.maxRetries;
    maxRetries = +maxRetries;
    var bucketIds = remoteSettings.activeBucketIds;
    if (typeof bucketIds === 'undefined') {
        bucketIds = [];
    }
    if (typeof bucketIds === 'string') {
        bucketIds = [bucketIds];
    }
    var type = remoteSettings.type;

    if (apiKey && (typeof apiKey === 'string')) {
        if (apiKey !== dataStore.settings.getApiKey()) {
            logger.info("New apiKey: ", apiKey);
            settings.apiKey = apiKey;
            dataStore.settings.setApiKey(apiKey);
        }
    } else {
        logger.debug("Failed attempt to set apiKey");
    }

    if (interval && (typeof interval === 'number')) {
        if (interval !== dataStore.settings.getInterv()) {
            logger.info("New interval:", interval, "min");
            settings.interval = interval;
            dataStore.settings.setInterv(interval);
        }
    } else {
        logger.debug("Failed attempt to set interval");
    }

    if (maxRetries && (typeof maxRetries === 'number')) {
        if (maxRetries !== dataStore.settings.getMaxRetries()) {
            logger.info("New maxRetries:", maxRetries);
            settings.maxRetries = maxRetries;
            dataStore.settings.setMaxRetries(maxRetries);
        }
    } else {
        logger.debug("Failed attempt to set interval");
    }

    if (bucketIds && Array.isArray(bucketIds)) {
        bucketIds.sort();
        if (bucketIds.toString() !== dataStore.settings.getActiveBucketIds().toString()) {
            logger.info("New active ids:", bucketIds.length, "Buckets active");
            logger.debug(bucketIds);
            settings.activeBucketIds = bucketIds;
            dataStore.settings.setActiveBucketIds(bucketIds);
        }
    } else {
        logger.debug("Failed attempt to set activeBucketIds");
    }

    if (type && (typeof type === 'string')) {
        if (type !== dataStore.settings.getType()) {
            logger.info("New type", type);
            settings.type = type;
            dataStore.settings.setType(type);
        }
    } else {
        logger.debug("Failed attempt to set type");
    }

    bucketCollector.start();
    res.send({
        success: true,
        settings: settings
    });
}

function getSettings(req, res, next) {
    var settings = dataStore.settings.getSettings();

    logger.debug("Settings requested");

    if (settings) {
        res.send({
            success: true,
            settings: settings
        });
    } else {
        res.send({
            success: false,
            message: 'NO SETTINGS FOUND'
        });
    }
}

function getApiKey(req, res, next) {
    var key = dataStore.settings.getApiKey();
    logger.debug("ApiKey requested");

    if (key) {
        res.send({
            success: true,
            apiKey: key
        });
    } else {
        res.send({
            success: false,
            message: "NO APIKEY SET"
        });
    }
}

function setApiKey(req, res, next) {
    var apiKey = req.query.apiKey;
    if (apiKey && (typeof apiKey === 'string')) {
        if (apiKey !== dataStore.settings.getApiKey()) {
            logger.info("New apiKey: ", apiKey);
            dataStore.settings.setApiKey(apiKey);
            updateSettings();
        }
        res.send({
            success: true,
            apiKey: apiKey
        });
    } else {
        logger.debug("Failed attempt to set apiKey");
        res.send({
            success: false,
            message: "NO VALID APIKEY GIVEN"
        });
    }
}

/**
 * Restarts bucketCollector to refresh settings.
 */
function updateSettings() {
    bucketCollector.start();
}

/**
 * @ignore
 */
(function ($) {
    $.getApiKey = getApiKey;
    $.setApiKey = setApiKey;
    $.getSettings = getSettings;
    $.setSettings = setSettings;
})(exports);