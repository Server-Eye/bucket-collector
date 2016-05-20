var options = require('commander');

/**
 * Starts the bucket-collector as a nodejs-app. The webinterface runs on port 8080
 */

/**
 * Defines commandline-flags
 */
options.version(require('./package.json').version)
    .option('-d, --development', 'Starts the application in development mode, which enables additional logging')
    .option('-t, --test', 'Starts the application in testmode. Loads bucketmessages from ./debug instead of the bucket-api.')
    .option('-r, --reactionDataDir [path]', 'Set the path where the raction-data is saved')
    .option('-b, --bucketDataDir [path]', 'Set the path where the runtime-data is saved')
    .option('-L, --logDir [path]', 'Set the path where the logfiles are saved')
    .parse(process.argv);

/**
 * Starts the bucket-collector
 */
function start() {
    require('./lib/config').setConfig(options);
    require('./lib/config').appLogger.info("Starting application");
    require('./lib/webinterface').start();
    require('./lib/bucketCollector').start();
}

start();