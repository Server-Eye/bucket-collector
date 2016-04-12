var soap, _settings, utils;

var Q = require('q');
var parser = require('./helper/parser');


/**
 * Creates a TicketNote for the given message.
 * 
 * @param {Object} message
 * @return {promise}
 */
function hint(message) {
    var deferred = Q.defer();
    
    message.autotaskAccountID = utils.getAccountID(message);
    
    var title = utils.getTitle(message);
    
    message.seStateId = utils.getSeStateId(message);

    var ticketNodeMessage = utils.getTicketNoteMessage(message);

    soap.getTicketIdBySEStateId(message.seStateId).then(function (ticketId) {
        if (!ticketId || ticketId.error) {
            message.error = (ticketId && ticketId.error) ? ticketId.error : "No matching ticket found";
            message.response = (ticketId &&ticketId.response) ? ticketId.resonse : "No matching ticket found";
            deferred.resolve(message);
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
            soap.createTicketNote(message).then(function(result){
                deferred.resolve(result);
            });
        }
    });
    
    return deferred.promise;
}

/**
 * Loads required dependencies with the given settings
 * 
 * @param {Object} _settings
 * @return {function}
 */
function init(_settings) {
    
    soap = require('./helper/soap')(_settings);
    utils = require('./helper/utils')(_settings);

    return hint;
}

/**
 * @ignore
 */
module.exports = init;