var soap;
var parser = require('./parser');
var settings;

function hint(message) {
    //message.autotaskAccountID = getAccountID(message.customer.cId);

    //var title = getTitle(message);

    var ticket = {
        attributes: {
            'xsi:type': 'TicketNote'
        },
    //    AccountID: message.autotaskAccountID,
    //    DueDateTime: parser.formatDate(new Date()),
        NoteType: 2,
        Publish: 1,
        TicketID: 7779,
        Title: "HELLOOOOOOOO",
    //    Title: title,
        Description: message.state.message
    };
    var data = {
        Entities: [{
                Entity: ticket
            }]
    };

    return soap.createTicketNote(data);
}

function init(_settings) {
    settings = _settings;

    soap = require('./soap')(settings);

    return hint;
}

module.exports = init;