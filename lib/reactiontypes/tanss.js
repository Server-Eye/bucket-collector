var Q = require('q');

function react(message){
    var deferred = Q.defer();
    
    console.log(message);
    deferred.resolve(message);
    
    return deferred.promise;
};

(function($){
    $.react = react;
})(exports);