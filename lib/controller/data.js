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

(function ($) {
    $.getApiKey = getApiKey;
    $.setApiKey = setApiKey;
})(exports);