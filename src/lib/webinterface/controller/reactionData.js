var dataStore = require('../../dataStore');
var logger = require('../../config').reactionLogger;
var reactions = require('../../bucketCollector/reactor').reactor;

function method(req, res, next) {
    var reactionName = req.params.name;
    var methodName = req.params.method;

    if (reactionName && (dataStore.settings.getAvailableTypes().indexOf(reactionName) >= 0)) {
        if (reactions[reactionName] && reactions[reactionName][methodName]) {
            reactions[reactionName][methodName]().then(function (result) {
                res.send({
                    success: true,
                    data: result
                });
            }).fail(function (error) {
                res.send({
                    success: false,
                    message: error
                });
            });
        } else {
            res.send({
                success: false,
                message: "METHOD UNKNOWN"
            });
        }
    } else {
        res.send({
            success: false,
            message: "REACTION UNKNOWN"
        });
    }
}

function get(req, res, next) {
    var reactionName = req.params.name;
    if (reactionName && (dataStore.settings.getAvailableTypes().indexOf(reactionName) >= 0)) {
        var data = dataStore.reactions(reactionName).get();
        res.send({
            success: true,
            data: data
        });
    } else {
        res.send({
            success: false,
            message: "REACTION UNKNOWN"
        });
    }
}

function set(req, res, next) {
    var reactionName = req.params.name;
    var data = req.body;

    if (reactionName && (dataStore.settings.getAvailableTypes().indexOf(reactionName) >= 0)) {
        dataStore.reactions(reactionName).set(data);
        res.send({
            success: true,
            data: dataStore.reactions(reactionName).get()
        });
    } else {
        res.send({
            success: false,
            message: "REACTION UNKNOWN"
        });
    }
}

/**
 * @ignore
 */
(function ($) {
    $.getData = get;
    $.setData = set;
    $.method = method;
})(exports);