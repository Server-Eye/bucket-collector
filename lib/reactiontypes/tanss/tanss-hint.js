ACTION = "comment";

function hint(message, params){
    params.action = ACTION;
    params.id = message.agent.id;
    params.hId = message.note.hId;
    params.containerId = message.container.cId;
    params.stateId= message.state.sId;
    params.name = message.agent.name;
    params.message = message.note.message;
    params.intern = message.note.private ? 'Y' : 'N';
    
    return params;
}

module.exports = hint;