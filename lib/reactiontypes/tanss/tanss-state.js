ACTION = "in";

function state(message, params){
    params.action = ACTION;
    params.id = message.agent.aId;
    params.containerId = message.container.cId;
    params.name = message.agent.name;
    // ????? params.agentType = 
    params.stateId = message.state.sId;
    params.error = message.state.error;
    params.lastDate = message.state.data;
    params.utcLastDate = message.state.data;
    // params.type = 
    params.message = message.state.message;
    
    return params;
}

module.exports = state;