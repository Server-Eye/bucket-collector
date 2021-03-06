var dataStore = require('../../dataStore');
var logger = require('../../config').reactionLogger;
var reactions = require('../../bucketCollector/reactor').reactor;

/**
 * Calls the given method of the given reaction.
 * Checks if the reaction exists and sends the result. Sets the success-field to false if an error occurs.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function method(req, res, next) {
    var reactionName = req.params.name;
    var methodName = req.params.method;

    if (reactionName && (dataStore.settings.getAvailableTypes().indexOf(reactionName) >= 0)) {
        if (reactions[reactionName] && reactions[reactionName][methodName]) {
            reactions[reactionName][methodName]().then(function(result) {
                res.send({
                    success: true,
                    data: result
                });
            }).fail(function(error) {
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

/**
 * Sends the reactionData for the given reaction.
 * Sets the success-field to false if the reaction is unknown.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
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

/**
 * Sets the given reactionData for the given reaction.
 * Sets the success-field to false if the reaction is unknown.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
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
(function($) {
    $.getData = get;
    $.setData = set;
    $.method = method;
})(exports);