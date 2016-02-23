var hint, soap, settings, utils;
var parser = require('./helper/parser');

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

function init(_settings) {
    settings = _settings;

    utils = require('./helper/utils')(settings);
    soap = require('./helper/soap')(settings);
    hint = require('./autotask-hint')(settings);

    return state;
}

module.exports = init;