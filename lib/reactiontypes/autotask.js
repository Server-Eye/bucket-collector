var Q = require('q');
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
    HINT: require('./autotask/autotask-hint')(settings),
    STATE: require('./autotask/autotask-state')(settings)
};

function react(message) {
    var deferred = Q.defer();

    types[message.type](message).then(function (res) {
        message.error = res.error;
        message.response = res.response;

        deferred.resolve(message);
    });

    return deferred.promise;
}

//react({
//    type: "HINT",
//    state: {
//            "message": "Not enough space: 35,8 %,14 GByte\r\n",
//            "error": true,
//            "sId": 79942074,
//            "date": 1456135865000
//      },
//    note: {
//        message: "all ok dude"
//    }
//}).then(function (res) {
//    console.log(res);
//});
//
//react(require('../../data/bucket-single-STATE-error')).then(function (message) {
//    console.log(message);
//});

(function ($) {
    $.react = react;
})(exports);