ACTION = "comment";

function hint(message, qs) {
    qs.action = ACTION;
    qs.hId = message.note.hId;
    qs.containerId = message.container.cId;
    qs.stateId = message.state.sId;
    qs.message = message.note.message;
    qs.intern = message.note.private ? 'Y' : 'N';


    if (message.agent) {
        qs.name = message.agent.name;
        qs.id = message.agent.aId;
    } else {
        qs.name = message.container.name;
        qs.if = message.container.cId;
    }

    return qs;
}

module.exports = hint;