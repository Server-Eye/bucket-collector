var Q = require('q');
var request = require('request');
var url = require('url');
var settings = require('./tanss/tanss-settings');

var tanssAPI = "/serverEye/index.php";
var types = {
    HINT: require('./tanss/tanss-hint'),
    STATE: require('./tanss/tanss-state')
};

function react(message){
    var deferred = Q.defer();
    
    var params = buildParamsObject(message);
    
    request({
        url: url.resolve(settings.url, tanssAPI),
        method: 'GET',
        qs: params
    },function(res, err){
        
    });
    
    
    
    //if (i % 2) {
    //    deferred.resolve(message);
    //} else {
        setTimeout(function(){deferred.resolve(message);},1000);
    //}
    return deferred.promise;
};

function buildParamsObject(message){
    var params = {
        customer: message.customer.cId,
        time: message.state.date,
        apiKey: settings.keys[message.customer.cId],
        userId: message.user.uId,
        userMail: message.user.email,
        userPreName: message.user.prename,
        userSureName: message.user.surname //,
//        originalUserId: message.user.uId,
//        originalUserMail: message.user.email,
//        originalUserPreName: message.user.prename,
//        originalUserSureName: message.user.surname
    };
    
    if(types[message.type]){
        types[message.type](message, params);
    }
    
    return params;
};

(function($){
    $.react = react;
})(exports);