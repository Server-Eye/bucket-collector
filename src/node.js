var options = require('commander');

options.version(require('./package.json').version)
        .option('-d, --development', 'Starts the application in development mode, which enables additional logging')
        .option('-c, --clean', 'Removes all settings and saved bucket data')
        .option('-R, --reactionDir [path]', 'Set the path from which all reactions are loaded')
        .option('-r, --reactionDataDir [path]', 'Set the path where the raction-data is saved')
        .option('-b, --bucketDataDir [path]', 'Set the path where the runtime-data is saved')
        .option('-L, --logDir [path]', 'Set the path where the logfiles are saved')
        .parse(process.argv);

function start() {
    require('./lib/config').setConfig(options);
    require('./lib/config').appLogger.info("Starting application");
    require('./lib/webinterface').start();
    require('./lib/bucketCollector').start();
}

start();