var Q = require('q');
var soap = require('soap');
var settingsPath = require('../../config').config.dataDir;

var baseUrl = "https://webservices.autotask.net/atservices/1.5/atws.wsdl";

var client;

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

function getClient() {
    var deferred = Q.defer();

    if (client) {
        deferred.resolve(client);
    } else {
        soap.createClient(baseUrl, function (err, _client) {
            if (err) {
                console.log(err);
                deferred.reject(err);
            } else {
                _client.ATWS.ATWSSoap.getZoneInfo({
                    UserName: settings.username
                }, (function (err, res) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        _client.setEndpoint(res.getZoneInfoResult.URL);

                        _client.setSecurity(new soap.BasicAuthSecurity(settings.username, settings.password));

                        client = _client;

                        deferred.resolve(client);
                    }
                }));
            }
        });
    }

    return deferred.promise;
}

(function ($) {
    $.getClient = getClient;
})(exports);