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
function setSettings(req,res,next){
    var settings = {
        activeBucketIds: [],
        interval: 5
    };
    
    var apiKey = req.query.apiKey;
    var interval = req.query.interval;
    interval = +interval;
    var maxRetries = req.query.maxRetries;
    maxRetries = +maxRetries;
    var bucketIds = req.query.activeBucketIds;
    if(typeof bucketIds === 'undefined'){
        bucketIds = [];
    }
    if(typeof bucketIds === 'string'){
        bucketIds = [bucketIds];
    }
    var type = req.query.type;
    
    if (apiKey && (typeof apiKey === 'string')) {
        if(apiKey !== dataStore.settings.getApiKey()){
            logger.info("New apiKey: ", apiKey);
            settings.apiKey = apiKey;
            dataStore.settings.setApiKey(apiKey);
        }
    } else {
        logger.debug("Failed attempt to set apiKey");
    }
    
    if (interval && (typeof interval === 'number')) {
        if(interval !== dataStore.settings.getInterv()){
            logger.info("New interval:", interval, "min");
            settings.interval = interval;
            dataStore.settings.setInterv(interval);
        }
    } else {
        logger.debug("Failed attempt to set interval");
    }
    
    if (maxRetries && (typeof maxRetries === 'number')) {
        if(maxRetries !== dataStore.settings.getMaxRetries()){
            logger.info("New maxRetries:", maxRetries);
            settings.maxRetries = maxRetries;
            dataStore.settings.setMaxRetries(maxRetries);
        }
    } else {
        logger.debug("Failed attempt to set interval");
    }
    
    if (bucketIds && Array.isArray(bucketIds)) {
        bucketIds.sort();
        if(bucketIds.toString() !== dataStore.settings.getActiveBucketIds().toString()){
            logger.info("New active ids:", bucketIds.length, "Buckets active" );
            logger.debug(bucketIds);
            settings.activeBucketIds = bucketIds;
            dataStore.settings.setActiveBucketIds(bucketIds);
        }
    } else {
        logger.debug("Failed attempt to set activeBucketIds");
    }
    
    if (type && (typeof type === 'string')) {
        if(type !== dataStore.settings.getType()){
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

/**
 * Sends the currently active apiKey (if set) or an error message.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
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

/**
 * Sends the currently available types (if set) or an error message.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function getAvailableTypes(req, res, next) {
    var aTypes = dataStore.settings.getAvailableTypes();
    logger.debug("AvailableTypes requested");
    if (aTypes) {
        res.send({
            success: true,
            availableTypes: aTypes
        });
    } else {
        res.send({
            success: false,
            message: "NO AVAILABLETYPES SET"
        });
    }
}

/**
 * Sets the apiKey from the request query as the active setting, sends a success- or error-message
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function setApiKey(req, res, next) {
    var apiKey = req.query.apiKey;
    if (apiKey && (typeof apiKey === 'string')) {
        if(apiKey !== dataStore.settings.getApiKey()){
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
 * Sends the currently active interval (if set) or an error message.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function getInterv(req, res, next) {
    var interval = dataStore.settings.getInterv();
    logger.debug("Interval requested");
    if (interval) {
        res.send({
            success: true,
            interval: interval
        });
    } else {
        res.send({
            success: false,
            message: "NO INTERVAL SET"
        });
    }
}

/**
 * Sets the interval from the request query as the active setting, sends a success- or error-message
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function setInterv(req, res, next) {
    var interval = req.query.interval;
    interval = +interval;
    if (interval && (typeof interval === 'number')) {
        if(interval !== dataStore.settings.getInterv()){
            logger.info("New interval:", interval, "min");
            dataStore.settings.setInterv(interval);
            updateSettings();
        }
        res.send({
            success: true,
            interval: interval
        });
    } else {
        logger.debug("Failed attempt to set interval");
        res.send({
            success: false,
            message: "NO VALID INTERVAL GIVEN"
        });
    }
}

/**
 * Sends the currently active bIds (if set) or an error message.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function getActiveBucketIds(req, res, next) {
    var bucketsIds = dataStore.settings.getActiveBucketIds();
    logger.debug("ActiveBucketIds requested");
    if (bucketsIds) {
        res.send({
            success: true,
            activeBucketsIds: bucketsIds
        });
    } else {
        res.send({
            success: false,
            message: "NO ACTIVE BUCKET IDS SET"
        });
    }
}

/**
 * Sets the activeBucketIds from the request query as the active setting, sends a success- or error-message
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function setActiveBucketIds(req, res, next) {
    var bucketIds = req.query.activeBucketIds;
    if(typeof bucketIds === 'undefined'){
        bucketIds = [];
    }
    if(typeof bucketIds === 'string'){
        bucketIds = [bucketIds];
    }
    if (bucketIds && Array.isArray(bucketIds)) {
        bucketIds.sort();
        if(bucketIds.toString() !== dataStore.settings.getActiveBucketIds().toString()){
            logger.info("New active ids:", bucketIds.length, "Buckets active" );
            logger.debug(bucketIds);
            dataStore.settings.setActiveBucketIds(bucketIds);
            updateSettings();
        }
        res.send({
            success: true,
            activeBucketIds: bucketIds
        });
    } else {
        logger.debug("Failed attempt to set activeBucketIds");
        res.send({
            success: false,
            message: "NO VALID ACTIVE BUCKET IDS GIVEN"
        });
    }
}

/**
 * Sends the currently active type (if set) or an error message.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function getType(req,res,next){
    var type = dataStore.settings.getType();
    logger.debug("Type requested");
    if (type) {
        res.send({
            success: true,
            type: type
        });
    } else {
        res.send({
            success: false,
            message: "NO TYPE SET"
        });
    }
}

/**
 * Sets the type from the request query as the active setting, sends a success- or error-message
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function setType(req, res, next) {
    var type = req.query.type;
    if (type && (typeof type === 'string')) {
        if(type !== dataStore.settings.getType()){
            logger.info("New type", type);
            dataStore.settings.setType(type);
            updateSettings();
        }
        res.send({
            success: true,
            type: type
        });
    } else {
        logger.debug("Failed attempt to set type");
        res.send({
            success: false,
            message: "NO VALID TYPE GIVEN"
        });
    }
}

/**
 * Sends the currently active maxRetries (if set) or an error message.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function getMaxRetries(req,res,next){
    var maxRetries = dataStore.settings.getMaxRetries();
    logger.debug("maxRetries requested");
    if (maxRetries) {
        res.send({
            success: true,
            maxRetries: maxRetries
        });
    } else {
        res.send({
            success: false,
            message: "NO MAXRETRIES SET"
        });
    }
}

/**
 * Sets the maxRetries from the request query as the active setting, sends a success- or error-message
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function setMaxRetries(req, res, next) {
    var maxRetries = req.query.maxRetries;
    maxRetries = +maxRetries;
    if (maxRetries && (typeof maxRetries === 'number')) {
        if(maxRetries !== dataStore.settings.getMaxRetries()){
            logger.info("New maxRetries:", maxRetries);
            dataStore.settings.setMaxRetries(maxRetries);
            updateSettings();
        }
        res.send({
            success: true,
            maxRetries: maxRetries
        });
    } else {
        logger.debug("Failed attempt to set maxRetries");
        res.send({
            success: false,
            message: "NO VALID MAXRETRIES GIVEN"
        });
    }
}

/**
 * Restarts bucketCollector to refresh settings.
 */
function updateSettings(){
    bucketCollector.start();
}

/**
 * @ignore
 */
(function ($) {
    $.getActiveBucketIds = getActiveBucketIds;
    $.getAvailableTypes = getAvailableTypes;
    $.getApiKey = getApiKey;
    $.getInterv = getInterv;
    $.getMaxRetries = getMaxRetries;
    $.getType = getType;
    $.setActiveBucketIds = setActiveBucketIds;
    $.setApiKey = setApiKey;
    $.setInterv = setInterv;
    $.setMaxRetries = setMaxRetries;
    $.setType = setType;
    $.setSettings = setSettings;
})(exports);