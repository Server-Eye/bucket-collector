var Q = require('q');
var _settings, soap, utils;

/**
 * Gets customers via soap.
 * Resolves an array of customers or rejects with an error-message.
 * 
 * @returns {promise}
 */
function customers() {
    var deferred = Q.defer();

    console.log("Requesting autotask-customers");
    soap.getCustomers().then(function(customers) {
        deferred.resolve(customers);
    }).fail(function(err) {
        deferred.reject("COULD NOT GET CUSTOMERS. PLEASE SAVE CORRECT LOGIN DATA.");
    });

    return deferred.promise;
}

/**
 * Loads required dependencies with the given settings
 * 
 * @param {Object} _settings
 * @return {function}
 */
function init(settings) {
    _settings = settings;

    soap = require('./helper/soap')(_settings);
    utils = require('./helper/utils')(_settings);

    return {
        customers: customers
    };
}

/**
 * @ignore
 */
module.exports = init;