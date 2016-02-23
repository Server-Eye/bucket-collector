var soap;
var parser = require('./parser');
var settings;

function hint(message) {
    var note = {
        attributes: {
            'xsi:type': 'TicketNote'
        },
        NoteType: 2,
        Publish: 1,
        Title: "HELLOOOOOOOO",
        Description: message.state.message
    };
    
    var data = {
        Entities: [{
                Entity: note
            }]
    };
    
    message.data = data;

    return soap.createTicketNote(message);
}

function init(_settings) {
    settings = _settings;

    soap = require('./soap')(settings);

    return hint;
}

module.exports = init;