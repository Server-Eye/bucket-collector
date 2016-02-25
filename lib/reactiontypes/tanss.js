var Q = require('q');
var request = require('request');
var url = require('url');
var settingsPath = require('../config').config.dataDir;

var settings;
try {
    settings = require(settingsPath + '/tanss-data');
} catch (e) {
    settings = {
        tanssUrl: "",
        apiKeys: []
    };
    console.log("COULD NOT LOAD 'tanss-data'", e);
    console.log("USING EMPTY DATASET");
}

var tanssAPI = "/serverEye/index.php";
var types = {
    HINT: require('./tanss/tanss-hint'),
    STATE: require('./tanss/tanss-state')
};

/**
 * Calls buildFormData with the given message and performs the tanss-API-call.
 * Adds the received response to the given message object and sets the message-objects error-property.
 * Always resolves with the given message-object.
 * 
 * 
 * @param {Object} message
 * @return {promise}
 */
function react(message) {
    var deferred = Q.defer();

    var tanss = url.resolve(settings.tanssUrl, tanssAPI);
    var data = buildFormData(message);

    request({
        url: tanss,
        method: 'POST',
        form: data
    }, function (err, res, body) {
        if (err) {
            message.error = true;
            message.response = err;
        } else {
            try {
                var response = JSON.parse(body);
                if (response.status && response.status === "OK") {
                    message.error = false;
                    message.response = response;
                } else {
                    message.error = true;
                    message.response = response;
                }
            } catch (e) {
                message.error = true;
                message.response = e;
            }
        }
        deferred.resolve(message);
    });

    return deferred.promise;
}

/**
 * Builds the formdata-object for the tanss-api from the given message-object
 * 
 * @param {Object} message
 * @return {Object}
 */
function buildFormData(message) {
    var data = {
        customer: message.customer.number,
        time: message.state.date,
        apiKey: settings.apiKeys[message.customer.cId]
    };

    if (message.user) {
        data.userId = message.user.uId;
        data.userMail = message.user.email;
        data.userPreName = message.user.prename;
        data.userSurName = message.user.surname;
    }

    if (message.originalUser) {
        data.originalUserId = message.originalUser.uId;
        data.originalUserMail = message.originalUser.email;
        data.originalUserPreName = message.originalUser.prename;
        data.originalUserSureName = message.originalUser.surname;
    }

    if (types[message.type]) {
        types[message.type](message, data);
    }

    return data;
}

/**
 * @ignore
 */
(function ($) {
    $.react = react;
})(exports);