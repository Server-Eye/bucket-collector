var settings;

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

    title += message.container.name;
    
    if (message.agent) {
        title += " - " + message.agent.name;
    }

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

    return {
        getSeStateId: getSeStateId,
        getTitle: getTitle,
        getAccountID: getAccountID
    };
}

module.exports = init;
        