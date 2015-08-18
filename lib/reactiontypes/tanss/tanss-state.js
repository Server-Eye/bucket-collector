var ACTION = "in";

function state(message, data) {
    data.action = ACTION;

    if (message.state) {
        data.stateId = message.state.sId;
        data.error = message.state.error;
        data.lastDate = message.state.date;
        data.utcLastDate = message.state.date;
        data.message = message.state.message;
    }

    if (message.container) {
        data.containerId = message.container.cId;
        if (message.agent) {
            data.id = message.agent.aId;
            data.name = message.agent.name;
            data.type = 'Agent';
            data.agentType = 'empty';
        } else {
            data.id = message.container.cId;
            data.name = message.container.name;
            data.type = 'PrimaryMaster';
        }
    }

    return data;
}

module.exports = state;