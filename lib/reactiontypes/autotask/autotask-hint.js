var soap, settings, utils;
var parser = require('./helper/parser');

function hint(message) {
    message.autotaskAccountID = utils.getAccountID(message.customer.cId);

    var title = utils.getTitle(message);

    message.seStateId = utils.getSeStateId(message);

    return soap.getTicketIdBySEStateId(message.seStateId).then(function (ticketId) {
        var note = {
            attributes: {
                'xsi:type': 'TicketNote'
            },
            AccountID: message.autotaskAccountID,
            TicketID: ticketId,
            NoteType: 2,
            Publish: 1,
            Title: title,
            Description: message.note.message
        };

        console.log(note);
        var data = {
            Entities: [{
                    Entity: note
                }]
        };

        message.data = data;
        return soap.createTicketNote(message);
    });
}

function init(_settings) {
    settings = _settings;

    soap = require('./helper/soap')(settings);
    utils = require('./helper/utils')(settings);

    return hint;
}

module.exports = init;