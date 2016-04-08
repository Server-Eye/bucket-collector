var soap, _settings, utils;
var parser = require('./helper/parser');


/**
 * Creates a TicketNote for the given message.
 * 
 * @param {Object} message
 * @return {promise}
 */
function hint(message) {
    message.autotaskAccountID = utils.getAccountID(message.customer.cId);

    var title = utils.getTitle(message);

    message.seStateId = utils.getSeStateId(message);

    var ticketNodeMessage = utils.getTicketNoteMessage(message);

    return soap.getTicketIdBySEStateId(message.seStateId).then(function (ticketId) {
        if (!ticketId || ticketId.error) {
            message.error = (ticketId && ticketId.error) ? ticketId.error : "No matching ticket found";
            message.response = (ticketId &&ticketId.response) ? ticketId.resonse : "No matching ticket found";
            return message;
        } else {
            var note = {
                attributes: {
                    'xsi:type': 'TicketNote'
                },
                AccountID: message.autotaskAccountID,
                TicketID: ticketId,
                NoteType: 2,
                Publish: 1,
                Title: title,
                Description: ticketNodeMessage
            };

            var data = {
                Entities: [{
                        Entity: note
                    }]
            };

            message.data = data;
            return soap.createTicketNote(message);
        }
    });
}

/**
 * Loads required dependencies with the given settings
 * 
 * @param {Object} _settings
 * @return {function}
 */
function init(_settings) {
    _settings = _settings;

    soap = require('./helper/soap')(_settings);
    utils = require('./helper/utils')(_settings);

    return hint;
}

/**
 * @ignore
 */
module.exports = init;