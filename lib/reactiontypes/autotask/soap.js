var Q = require('q');
var soap = require('soap');
var parser = require('./parser');
var baseUrl = "https://webservices.autotask.net/atservices/1.5/atws.wsdl";

var client, settings;

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

                        console.log(client.ATWS.ATWSSoap);

                        deferred.resolve(client);
                    }
                }));
            }
        });
    }

    return deferred.promise;
}

function createTicket(message) {
    var deferred = Q.defer();

    getClient().then(function (_client) {
        _client.ATWS.ATWSSoap.create(message.data, function (err, res) {
            if (err) {
                message.error = true;
                message.response = err;
            } else {
                if (res.createResult && res.createResult.ReturnCode < 0) {
                    message.error = true;
                    message.response = res;
                } else {
                    message.error = false;
                    message.response = res;
                }
            }
            deferred.resolve(message);
        });
    });

    return deferred.promise;
}

function createTicketNote(message){
    var deferred = Q.defer();
    
    console.log(message);
    
    getClient().then(function (_client) {
        
        _client.ATWS.ATWSSoap.create(message.data, function (err, res) {
            if (err) {
                message.error = true;
                message.response = err;
            } else {
                if (res.createResult && res.createResult.ReturnCode < 0) {
                    message.error = true;
                    message.response = res;
                } else {
                    message.error = false;
                    message.response = res;
                }
            }
            deferred.resolve(message);
        });
    });

    return deferred.promise;
}

function getTicketIdBySEStateId(seStateId) {
    var deferred = Q.defer();

    var query = {
        Ticket: [
            {
                ServerEyeStateID: {
                    equals: seStateId,
                    udf: true
                },
                Status: {
                    udf:false,
                    NotEqual: 5
                }
            }
        ]
    };

    getClient().then(function (_client) {
        _client.ATWS.ATWSSoap.query({sXML: parser.query(query)}, function (err, res) {
            if (err) {
                deferred.reject(err);
            } else {
                if (res.queryResult && res.queryResult.ReturnCode < 0) {
                    deferred.reject(res.queryResult.Errors);
                } else {
                    deferred.resolve(getCurrentTicketId(parser.result(res)));
                }
            }
        });
    });

    return deferred.promise;
}

function getCurrentTicketId(tickets){
    if(!Array.isArray(tickets)){
        tickets = [tickets];
    }
    var result = {
        id: "",
        createDate: 0
    };
    
    tickets.forEach(function(ticket){
        if(ticket.CreateDate > result.createDate){
            result.createDate = ticket.CreateDate;
            result.id = ticket.id;
        }
    });
    
    return result.id;
}


function init(_settings) {
    settings = _settings;

    return {
        createTicket: createTicket,
        getTicketIdBySEStateId: getTicketIdBySEStateId,
        createTicketNote: createTicketNote//,
        //note: note
    };
}

module.exports = init;