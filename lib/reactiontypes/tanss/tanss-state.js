ACTION = "in";

function state(message, qs) {
    qs.action = ACTION;
    qs.containerId = message.container.cId;
    qs.stateId = message.state.sId;
    qs.error = message.state.error;
    qs.lastDate = message.state.data;
    qs.utcLastDate = message.state.data;
    // params.type = 
    qs.message = message.state.message;

    if (message.agent) {
        qs.id = message.agent.aId;
        qs.name = message.agent.name;
        // ????? params.agentType = 
    } else {
        qs.id = message.container.cId;
        qs.name = message.container.name;
    }

    return qs;
}

module.exports = state;