var Q = require('q');
var _settings = require('../dataStore').reactions('mail');

var actions = {
    'mail': require('./mail/sendMail')(_settings),
    'debug': require('./mail/debug')(_settings)
};

/**
 * Reacts the given message by reactiontype and selected action in settings.
 * Adds the received response to the given message object and sets the message-objects error-property.
 * Always resolves with the given message-object.
 * 
 * @param {object} message
 * @returns {promise}
 */
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

/**
 * Resolves all possible cases for a message. 
 * Used in UI to select messagetypes.
 * 
 * @returns {promise}
 */
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

/**
 * Resolves all possible options for the secure-flag. 
 * Used in UI to select secure-option.
 * 
 * @returns {promise}
 */
function getSecureOptions() {
    var deferred = Q.defer();

    deferred.resolve([{
        value: "YES",
        name: "Yes"
    }, {
        value: "NO",
        name: "No"
    }]);

    return deferred.promise;
}

/**
 * Resolves all possible options for the ignore-cert-flag. 
 * Used in UI to select cert-option.
 * 
 * @returns {promise}
 */
function getCertOptions() {
    var deferred = Q.defer();

    deferred.resolve([{
        value: "YES",
        name: "Yes"
    }, {
        value: "NO",
        name: "No"
    }]);

    return deferred.promise;
}

/**
 * Resolves all possible options for the mail-content. 
 * Used in UI to select content-option.
 * 
 * @returns {promise}
 */
function getContentOptions() {
    var deferred = Q.defer();

    deferred.resolve([{
        value: 'html',
        name: "HTML"
    }, {
        value: 'text',
        name: "TEXT"
    }, {
        value: 'both',
        name: "TEXT + HTML"
    }]);

    return deferred.promise;
}

/**
 * Resolves all possible actions.
 * Used in UI to select actions.
 * 
 * mail: Send mail.
 * debug: Parses mailtemplates and writes result to degugDir.
 * 
 * @returns {promise}
 */
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
    $.getContentOptions = getContentOptions;
    $.getSecureOptions = getSecureOptions;
    $.getCertOptions = getCertOptions;
    $.react = react;
})(exports);