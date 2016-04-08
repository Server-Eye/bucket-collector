var ACTION = "comment";

/**
 * Adds the needed properties for a tanss-hint-message. Return the updated data object.
 * 
 * @param {Object} message
 * @param {Object} data
 * @return {Object}
 */
function hint(message, data) {
    data.action = ACTION;

    if (message.note) {
        data.hId = message.note.hId;
        data.message = message.note.message;
        data.intern = message.note.private ? 'Y' : 'N';
    }

    if (message.state) {
        data.stateId = message.state.sId;
    }

    if (message.container) {
        data.containerId = message.container.cId;
        if (message.agent) {
            data.name = message.agent.name;
            data.id = message.agent.aId;
        } else {
            data.name = message.container.name;
            data.id = message.container.cId;
        }
    }

    return data;
}

module.exports = hint;