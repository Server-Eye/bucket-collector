var Q = require('q');
var request = require('request');

var types = {
    HINT: require('./tanss/tanss-hint')
};

function react(message, url){
    var deferred = Q.defer();
    
    console.log("tanss got message");
    
    
    
    //if (i % 2) {
    //    deferred.resolve(message);
    //} else {
        setTimeout(function(){deferred.reject(message);},10000);
    //}
    return deferred.promise;
};

(function($){
    $.react = react;
})(exports);