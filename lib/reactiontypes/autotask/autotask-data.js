var Q = require('q');
var _settings, soap, utils;

function customers(){
    var deferred = Q.defer();
    
    soap.getCustomers().then(function(customers){
        deferred.resolve(customers);
    }).fail(function(err){
        deferred.reject(err);
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