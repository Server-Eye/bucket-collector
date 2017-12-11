var hint, soap, utils;
var Q = require('q');
var parser = require('./helper/parser');
var settings;

/**
 * Reacts the given state-message.
 * Calls soap.createTicket if the message contains a new error.
 * Calls hint or updates the current ticket if the message contains a resolved error.
 * 
 * @param {Object} message
 * @return {promise}
 */
function state(message) {
    var deferred = Q.defer();
    var _settings = settings.get();

    message.autotaskAccountID = utils.getAccountID(message);

    var title = utils.getTitle(message);

    message.seStateId = utils.getSeStateId(message);

    if (message.state && message.state.error) {

        var ticket = {
            attributes: {
                'xsi:type': 'Ticket'
            },
            UserDefinedFields: {
                UserDefinedField: [{
                    Name: "ServerEyeStateID",
                    Value: message.seStateId
                }]
            },
            AccountID: message.autotaskAccountID,
            DueDateTime: parser.formatDate(new Date()),
            QueueID: 8,
            Priority: 3,
            Status: 1,
            Source: 8,
            Title: title,
            Description: (message.state && message.state.message) ? message.state.message : "ERROR, NO MESSAGE IN BUCKETMESSAGE"
        };
        var data = {
            Entities: [{
                Entity: ticket
            }]
        };

        message.data = data;

        soap.createTicket(message).then(function (result) {
            deferred.resolve(result);
        });
    } else {
        if (message.state && (message.state.error == false) && _settings.closeTickets) {
            //close ticket
            soap.getTicketBySeStateId(message.seStateId).then(function (ticket) {
                if (!ticket) {
                    message.error = (ticket && ticket.error) ? ticket.error : "No matching ticket found";
                    message.response = (ticket && ticket.response) ? ticket.resonse : "No matching ticket found";
                    deferred.resolve(message);
                } else {
                    var stateMessage = (message.state && message.state.message) ? message.state.message : "ERROR, NO MESSAGE IN BUCKETMESSAGE";

                    var ticketUpdate = {};

                    ticketUpdate.id = parseInt(ticket.id);
                    ticketUpdate.Description = ticket.Description + '\r\nUpdate: ' + stateMessage;
                    ticketUpdate.DueDateTime = parser.formatDate(ticket.DueDateTime);
                    ticketUpdate.TicketNumber = ticket.TicketNumber;
                    ticketUpdate.Title = ticket.Title;
                    ticketUpdate.Status = 5;
                    ticketUpdate.Priority = ticket.Priority || 3;
                    ticketUpdate.QueueID = ticket.QueueID || 8;
                    ticketUpdate.AccountID = message.autotaskAccountID;
                    ticketUpdate.attributes = {
                        'xsi:type': 'Ticket'
                    };

                    var data = {
                        Entities: [{
                            Entity: ticketUpdate
                        }]
                    };

                    message.data = data;

                    soap.updateTicket(message).then(function (result) {
                        deferred.resolve(result);
                    });
                }
            });
        } else {
            message.note = {
                message: (message.state && message.state.message) ? message.state.message : "ERROR, NO MESSAGE IN BUCKETMESSAGE"
            };

            message.user = {
                prename: "Server-Eye",
                surname: ""
            };

            hint(message).then(function (result) {
                deferred.resolve(result);
            });
        }
    }

    return deferred.promise;
}

/**
 * Loads required dependencies with the given settings
 * 
 * @param {Object} _settings
 * @return {function}
 */
function init(_settings) {
    utils = require('./helper/utils')(_settings);
    soap = require('./helper/soap')(_settings);
    hint = require('./autotask-hint')(_settings);
    settings = _settings;

    return state;
}

/**
 * @ignore
 */
module.exports = init;