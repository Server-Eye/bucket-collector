var _settings;

/**
 * Returns the seStateId for the given message
 * 
 * @param {Object} message
 * @return {String}
 */
function getSeStateId(message) {
    var sId;

    if (message.agent) {
        sId = message.agent.aId;
    } else {
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
    var settings = settings.get();
    var title = "SE - ";

    if (message.autotaskAccountID == settings.defaultID) {
        title += message.customer.name + " - ";
    }

    title += message.container.name;

    if (message.agent) {
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
function getAccountID(cId) {
    var settings = _settings.get();
    if (settings.customerIDs[cId]) {
        return settings.customerIDs[cId];
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
    return message.user.prename + " " + message.user.surname + ": " + message.note.message;
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
        