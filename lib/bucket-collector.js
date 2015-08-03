var logger = require('./config').appLogger;
var webinterface = require('./webinterface');

function start(){
    logger.info("starting bucket-collector");
    webinterface.start();
}

module.exports = {
    start: start
};