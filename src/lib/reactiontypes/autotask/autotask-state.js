var hint, soap, _settings, utils;
var parser = require('./helper/parser');

/**
 * Reacts the given state-message.
 * Calls soap.createTicket if the message contains a new error.
 * Calls hint to update the current ticket if the message contains a resolved error.
 * 
 * @param {Object} message
 * @return {promise}
 */
function state(message) {
    message.autotaskAccountID = utils.getAccountID(message.customer.cId);

    var title = utils.getTitle(message);

    message.seStateId = utils.getSeStateId(message);

    if (message.state.error) {

        var ticket = {
            attributes: {
                'xsi:type': 'Ticket'
            },
            UserDefinedFields: {
                UserDefinedField: [
                    {
                        Name: "ServerEyeStateID",
                        Value: message.seStateId
                    }
                ]
            },
            AccountID: message.autotaskAccountID,
            DueDateTime: parser.formatDate(new Date()),
            QueueID: 8,
            Priority: 3,
            Status: 1,
            Source: 8,
            Title: title,
            Description: message.state.message
        };
        var data = {
            Entities: [{
                    Entity: ticket
                }]
        };

        message.data = data;

        return soap.createTicket(message);
    } else {
        message.note = {
            message: message.state.message
        };

        message.user.prename = "Server-Eye";
        message.user.surname = "";

        return hint(message);
    }
}

/**
 * Loads required dependencies with the given settings
 * 
 * @param {Object} _settings
 * @return {function}
 */
function init(_settings) {
    _settings = _settings;

    utils = require('./helper/utils')(_settings);
    soap = require('./helper/soap')(_settings);
    hint = require('./autotask-hint')(_settings);

    return state;
}

/**
 * @ignore
 */
module.exports = init;