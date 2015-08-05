var dataStore = require('../dataStore');

function getApiKey(req, res, next) {
    var key = dataStore.settings.getApiKey();
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
        dataStore.settings.setApiKey(apiKey);
        res.send({
            success: true,
            apiKey: apiKey
        });
    } else {
        res.send({
            success: false,
            message: "NO VALID APIKEY GIVEN"
        });
    }
}

function getInterv(req, res, next) {
    var interval = dataStore.settings.getInterv();
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
        dataStore.settings.setInterv(interval);
        res.send({
            success: true,
            interval: interval
        });
    } else {
        res.send({
            success: false,
            message: "NO VALID INTERVAL GIVEN"
        });
    }
}

function getUrl(req, res, next) {
    var url = dataStore.settings.getUrl();
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
        dataStore.settings.setUrl(url);
        res.send({
            success: true,
            url: url
        });
    } else {
        res.send({
            success: false,
            message: "NO VALID URL GIVEN"
        });
    }
}

function getActiveBucketIds(req, res, next) {
    var bucketsIds = dataStore.settings.getActiveBucketIds();
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
    if (bucketIds && Array.isArray(bucketIds)) {
        dataStore.settings.setActiveBucketIds(bucketIds);
        res.send({
            success: true,
            activeBucketIds: bucketIds
        });
    } else {
        res.send({
            success: false,
            message: "NO VALID ACTIVE BUCKET IDS GIVEN"
        });
    }
}

function getType(req,res,next){
    var type = dataStore.settings.getType();
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
        dataStore.settings.setType(type);
        res.send({
            success: true,
            type: type
        });
    } else {
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