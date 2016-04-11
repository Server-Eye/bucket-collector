var Q = require('q');
var settings = require('../dataStore').reactions('autotask');
var data = require('./autotask/autotask-data')(settings);

var types = {
    HINT: require('./autotask/autotask-hint')(settings),
    STATE: require('./autotask/autotask-state')(settings)
};

/**
 * Reacts the given message by reactiontype.
 * Adds the received response to the given message object and sets the message-objects error-property.
 * Always resolves with the given message-object.
 * 
 * @param {Object} message
 * @returns {promise}
 */
function react(message) {
    var deferred = Q.defer();

    types[message.type](message).then(function (res) {
        message.error = res.error;
        message.response = res.response;

        deferred.resolve(message);
    });

    return deferred.promise;
}

function getCustomers() {
    var deferred = Q.defer();

    data.customers().then(function (customers) {
        deferred.resolve(customers);
    }).fail(function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
}

//react(require('/dev/bucket-collector/debug/bucket-single-STATE-error')).then(function (message) {
//    var util = require('util');
//    console.log(util.inspect(message, {depth:null,colors:true}));
//});

/**
 * @ignore
 */
(function ($) {
    $.react = react;
    $.getCustomers = getCustomers;
})(exports);