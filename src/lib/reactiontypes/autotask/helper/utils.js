var _settings;

/**
 * Returns the seStateId for the given message
 * 
 * @param {Object} message
 * @return {String}
 */
function getSeStateId(message) {
    var sId = "DEFAULT_STATE_ID";

    if (message.agent && message.agent.aId) {
        sId = message.agent.aId;
    } else {
        if (message.container && message.container.cId)
            sId = message.container.cId;
    }

    return sId;
}

/**
 * Returns the ticketTitle for the given message
 * 
 * @param {Object} message
 * @return {String}
 */
function getTitle(message) {
    var settings = _settings.get();
    var title = "SE - ";

    if (message.autotaskAccountID == settings.defaultID) {
        if (message.customer && message.customer.name)
            title += message.customer.name + " - ";
    }

    if (message.container && message.container.name)
        title += message.container.name;

    if (message.agent && message.agent.name) {
        title += " - " + message.agent.name;
    }

    return title;
}

/**
 * Returns the autotask-accountId for the given message
 * 
 * @param {string} cId
 * @return {string}
 */
function getAccountID(message) {
    var settings = _settings.get();
    if (message.customer && message.customer.cId) {
        var cId = message.customer.cId;

        if (settings.customerIDs && settings.customerIDs[cId]) {
            return settings.customerIDs[cId];
        }
    }
    return settings.defaultID;
}

/**
 * Returns the ticketNoteMessage for the given messageobject
 * 
 * @param {Object} message
 * @return {String}
 */
function getTicketNoteMessage(message) {
    var note = "";
    if(message.user && message.user.prename && message.user.surname)
        note += message.user.prename + " " + message.user.surname + ": ";
    if(message.note && message.note.message)
        note += message.note.message;
    
    return note;
}

/**
 * Loads required dependencies with the given settings
 * 
 * @param {Object} _settings
 * @return {Object}
 */
function init(settings) {
    _settings = settings;

    return {
        getSeStateId: getSeStateId,
        getTitle: getTitle,
        getAccountID: getAccountID,
        getTicketNoteMessage: getTicketNoteMessage
    };
}

module.exports = init;
        