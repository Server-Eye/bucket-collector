var Q = require('q');
var request = require('request');
var url = require('url');
var settings = require('./tanss/tanss-settings');

var tanssAPI = "/serverEye/index.php";
var types = {
    HINT: require('./tanss/tanss-hint'),
    STATE: require('./tanss/tanss-state')
};

function react(message) {
    var deferred = Q.defer();
    
    if(!message.try){
        message.try = 0;
    }
    message.try++;
    
    var tanss = url.resolve(settings.url, tanssAPI);
    var data = buildQsObject(message);
    
    request({
        url: tanss,
        method: 'POST',
        form: data
    }, function (err, res, body) {
        if(err){
            message.error = true;
            message.response = err;
        } else{
            try{
                var response = JSON.parse(body);
                if(response.status && response.status === "OK"){
                    message.error = false;
                    message.response = response;
                } else {
                    message.error = true;
                    message.response = response;
                }
            }catch(e){
                message.error = true;
                message.response = e;
            }
        }
        deferred.resolve(message);
    });

    return deferred.promise;
}

function buildQsObject(message) {
    var data = {
        customer: message.customer.number,
        time: message.state.date,
        apiKey: settings.keys[message.customer.cId]
    };

    if (message.user) {
        data.userId = message.user.uId;
        data.userMail = message.user.email;
        data.userPreName = message.user.prename;
        data.userSurName = message.user.surname;
    }

    if (message.originalUser) {
        data.originalUserId = message.originalUser.uId;
        data.originalUserMail = message.originalUser.email;
        data.originalUserPreName = message.originalUser.prename;
        data.originalUserSureName = message.originalUser.surname;
    }

    if (types[message.type]) {
        types[message.type](message, data);
    }

    return data;
}

(function ($) {
    $.react = react;
})(exports);