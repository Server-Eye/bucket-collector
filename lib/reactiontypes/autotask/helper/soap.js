var Q = require('q');
var soap = require('soap');
var parser = require('./parser');
var baseUrl = "https://webservices.autotask.net/atservices/1.5/atws.wsdl";

var client, settings;

/**
 * Creates soap-client for autotask, returns a promise which resolves with the client or rejects in case of an error.
 * 
 * @return {promise}
 */
function getClient() {
    var deferred = Q.defer();

    if (client && !client.isRejected()) {
        return client;
    } else {
        client = deferred.promise;
        console.log("Creating new soapclient");
        soap.createClient(baseUrl, function (err, _client) {
            if (err) {
                deferred.reject(err);
            } else {
                _client.ATWS.ATWSSoap.getZoneInfo({
                    UserName: settings.username
                }, (function (err, res) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        if (res.getZoneInfoResult && res.getZoneInfoResult.ErrorCode >= 0) {
                            _client.setEndpoint(res.getZoneInfoResult.URL);

                            _client.setSecurity(new soap.BasicAuthSecurity(settings.username, settings.password));

                            console.log("AUTOTASK_CONNECT");

                            //check login data

                            deferred.resolve(client);
                        } else {
                            console.log("error con");
                            deferred.reject(
                                    "Could not connect to autotask"
                                    );
                        }
                    }
                }));
            }
        });
    }

    return deferred.promise;
}

/**
 * Creates a ticket for the given message
 * 
 * @param {Object} message
 * @return {promise}
 */
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
    }).fail(function (reason) {
        message.error = true;
        message.response = reason;
        deferred.resolve(message);
    });

    return deferred.promise;
}

/**
 * Creates a ticketNote for the given message
 * 
 * @param {Object} message
 * @return {promise}
 */
function createTicketNote(message) {
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

    }).fail(function (reason) {
        message.error = true;
        message.response = reason;
        deferred.resolve(message);
    });
    ;

    return deferred.promise;
}

/**
 * Returns the ticketID for the given seStateId
 * 
 * @param {String} seStateId
 * @return {promise}
 */
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
                    udf: false,
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

    }).fail(function (reason) {
        var resObj = {};
        resObj.error = true;
        resObj.response = reason;
        deferred.resolve(resObj);
    });

    return deferred.promise;
}

/**
 * Returns the most recent ticketId for the given tickets.
 * 
 * @param {Array|Object} tickets
 * @return {String}
 */
function getCurrentTicketId(tickets) {
    if (!Array.isArray(tickets)) {
        tickets = [tickets];
    }
    var result = {
        createDate: 0
    };

    tickets.forEach(function (ticket) {
        if (ticket.CreateDate > result.createDate) {
            result.createDate = ticket.CreateDate;
            result.id = ticket.id;
        }
    });

    return result.id;
}

/**
 * Loads required dependencies with the given settings
 * 
 * @param {Object} _settings
 * @return {Object}
 */
function init(_settings) {
    settings = _settings;

    return {
        createTicket: createTicket,
        getTicketIdBySEStateId: getTicketIdBySEStateId,
        createTicketNote: createTicketNote
    };
}

/**
 * @ignore
 */
module.exports = init;