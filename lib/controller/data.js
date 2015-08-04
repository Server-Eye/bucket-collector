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
    if (apiKey) {
        dataStore.settings.setApiKey(apiKey);
        res.send({
            success: true,
            apiKey: apiKey
        });
    } else {
        res.send({
            success: false,
            message: "NO APIKEY GIVEN"
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
    if (interval) {
        dataStore.settings.setInterv(interval);
        res.send({
            success: true,
            interval: interval
        });
    } else {
        res.send({
            success: false,
            message: "NO INTERVAL GIVEN"
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
    if (url) {
        dataStore.settings.setUrl(url);
        res.send({
            success: true,
            url: url
        });
    } else {
        res.send({
            success: false,
            message: "NO URL GIVEN"
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
    if (bucketIds) {
        dataStore.settings.setActiveBucketIds(bucketIds);
        res.send({
            success: true,
            activeBucketIds: bucketIds
        });
    } else {
        res.send({
            success: false,
            message: "NO ACTIVE BUCKET IDS GIVEN"
        });
    }
}

(function ($) {
    $.getActiveBucketIds = getActiveBucketIds;
    $.getApiKey = getApiKey;
    $.getInterv = getInterv;
    $.getUrl = getUrl;
    $.setActiveBucketIds = setActiveBucketIds;
    $.setApiKey = setApiKey;
    $.setInterv = setInterv;
    $.setUrl = setUrl;
})(exports);