var Q = require('q');
var soap = require('./autotask/soap');
var settingsPath = require('../config').config.dataDir;
var settings;

try {
    settings = require(settingsPath + '/autotask-data');
} catch (e) {
    settings = {
        username: "",
        password: ""
    };
    console.log("COULD NOT LOAD 'autotask-data'", e);
    console.log("USING EMPTY DATASET");
}

var types = {
    //HINT: require('./autotask/autotask-hint'),
    STATE: require('./autotask/autotask-state')(settings)
};

function react(message) {
    var deferred = Q.defer();

    types[message.type](message).then(function(res){
        message.error = res.error;
        message.response = res.response;
        
        deferred.resolve(message);
    });

    return deferred.promise;
}

react(require('../../data/bucket-single-error')).then(function(res){
    console.log(res);
});

(function ($) {
    $.react = react;
})(exports);