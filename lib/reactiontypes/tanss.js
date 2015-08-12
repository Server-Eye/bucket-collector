var Q = require('q');

var i = 0;

function react(message){
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