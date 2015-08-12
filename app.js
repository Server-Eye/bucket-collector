var logger = require('./lib/config').appLogger;
var webinterface = require('./lib/webinterface');
var bucketCollector = require('./lib/bucketCollector');

function start(){
    logger.info("Starting application");
    webinterface.start();
    bucketCollector.start();
}

start();