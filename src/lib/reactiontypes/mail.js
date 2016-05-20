var Q = require('q');
var _settings = require('../dataStore').reactions('mail');

var actions = {
    'mail': require('./mail/sendMail')(_settings),
    'debug': require('./mail/debug')(_settings)
};

function react(message) {
    var deferred = Q.defer();
    var settings = _settings.get();

    if (settings.action && actions[settings.action]) {
        console.log("MAIL: starting action " + settings.action);
        actions[settings.action](message).then(function(res) {
            message.error = res.error;
            message.response = res.response;
            console.log("MAIL: finished action " + settings.action);
            deferred.resolve(message);
        });
    } else {
        message.error = true;
        message.response = "NO ACTION SELECTED IN MAILCONFIG";
        deferred.resolve(message);
    }

    return deferred.promise;
}

function getCases() {
    var deferred = Q.defer();

    deferred.resolve([{
        case: "ERROR",
        name: "Error-Messages"
    }, {
        case: "OK",
        name: "OK-Messages"
    }, {
        case: "HINT",
        name: "Public-Hint-Messages"
    }, {
        case: "PRIVATEHINT",
        name: "Private-Hint-Messages"
    }]);

    return deferred.promise;
}

function getActions() {
    var deferred = Q.defer();

    deferred.resolve([{
        action: "mail",
        name: "Send mail"
    }, {
        action: "debug",
        name: "DEBUG mailtemplates"
    }]);

    return deferred.promise;
}

/**
 * @ignore
 */
(function($) {
    $.getCases = getCases;
    $.getActions = getActions;
    $.react = react;
})(exports);