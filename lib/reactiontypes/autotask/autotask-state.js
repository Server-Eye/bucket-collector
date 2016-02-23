var soap;
var parser = require('./parser');
var settings;

function state(message) {
    message.autotaskAccountID = getAccountID(message.customer.cId);

    var title = getTitle(message);

    message.seStateId = getSeStateId(message);

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
}

function getSeStateId(message) {
    var sId;

    if (message.agent) {
        sId = message.agent.aId;
    } else {
        sId = message.container.cId;
    }

    return sId;
}

function getTitle(message) {
    var title = "SE - ";

    if (message.autotaskAccountID == settings.defaultID) {
        title += message.customer.name + " - ";
    }

    title += message.container.name + " - " + message.agent.name;

    return title;
}

function getAccountID(cId) {
    if (settings.customerIDs[cId]) {
        return settings.customerIDs[cId]
    }
    return settings.defaultID;
}

function init(_settings) {
    settings = _settings;

    soap = require('./soap')(settings);

    return state;
}

module.exports = init;