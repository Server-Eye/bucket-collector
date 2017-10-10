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

    types[message.type](message).then(function(res) {
        message.error = res.error;
        message.response = res.response;
        deferred.resolve(message);
    });

    return deferred.promise;
}

/**
 * Gets autotask-customers.
 * Resolves with an array of customers. Rejects with an error-message if an error occurs.
 * 
 * @returns {promise}
 */
function getCustomers() {
    var deferred = Q.defer();

    data.customers().then(function(customers) {
        deferred.resolve(customers);
    }).fail(function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
}

/**
 * Resolves all possible options for closing tickets by agentState. 
 * Used in UI to select messagetypes.
 * 
 * @returns {promise}
 */
function getCloseOptions() {
    var deferred = Q.defer();

    deferred.resolve([{
        name: "Yes",
        value: true
    }, {
        name: "No",
        value: false
    }]);

    return deferred.promise;
}

/**
 * @ignore
 */
(function($) {
    $.react = react;
    $.getCustomers = getCustomers;
    $.getCloseOptions = getCloseOptions;
})(exports);