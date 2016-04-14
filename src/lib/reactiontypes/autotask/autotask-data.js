var Q = require('q');
var _settings, soap, utils;

function customers(){
    var deferred = Q.defer();
    
    console.log("Requesting autotask-customers");
    soap.getCustomers().then(function(customers){
        deferred.resolve(customers);
    }).fail(function(err){
        deferred.reject("COULD NOT GET CUSTOMERS. PLEASE SAVE CORRECT LOGIN DATA.");
    });
    
    return deferred.promise;
}

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