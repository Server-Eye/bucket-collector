var dataStore = require('../dataStore');
var logger = require('../config').settingsLogger;

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
        logger.info("New apiKey: ", apiKey);
        dataStore.settings.setApiKey(apiKey);
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

function setInterv(req, res, next) {
    var interval = req.query.interval;
    interval = +interval;
    if (interval && (typeof interval === 'number')) {
        logger.info("New interval:", interval, "min");
        dataStore.settings.setInterv(interval);
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

function getUrl(req, res, next) {
    var url = dataStore.settings.getUrl();
    logger.debug("Url requested");
    if (url) {
        res.send({
            success: true,
            url: url
        });
    } else {
        res.send({
            success: false,
            message: "NO URL SET"
        });
    }
}

function setUrl(req, res, next) {
    var url = req.query.url;
    if (url && (typeof url === 'string')) {
        logger.info("New url set");
        logger.debug(url);
        dataStore.settings.setUrl(url);
        res.send({
            success: true,
            url: url
        });
    } else {
        logger.debug("Failed attempt to set url");
        res.send({
            success: false,
            message: "NO VALID URL GIVEN"
        });
    }
}

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

function setActiveBucketIds(req, res, next) {
    var bucketIds = req.query.activeBucketIds;
    if(typeof bucketIds === 'undefined'){
        bucketIds = [];
    }
    if(typeof bucketIds === 'string'){
        bucketIds = [bucketIds];
    }
    if (bucketIds && Array.isArray(bucketIds)) {
        logger.info("New active ids:", bucketIds.length, "Buckets active" );
        logger.debug(bucketIds);
        dataStore.settings.setActiveBucketIds(bucketIds);
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

function setType(req, res, next) {
    var type = req.query.type;
    if (type && (typeof type === 'string')) {
        logger.info("New type", type);
        dataStore.settings.setType(type);
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

(function ($) {
    $.getActiveBucketIds = getActiveBucketIds;
    $.getApiKey = getApiKey;
    $.getInterv = getInterv;
    $.getType = getType;
    $.getUrl = getUrl;
    $.setActiveBucketIds = setActiveBucketIds;
    $.setApiKey = setApiKey;
    $.setInterv = setInterv;
    $.setType = setType;
    $.setUrl = setUrl;
})(exports);