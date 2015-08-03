var logger = require('./config').appLogger;

function start(){
    logger.info("starting webinterface");
}

module.exports = {
    start: start
};