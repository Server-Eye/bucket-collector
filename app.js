var app = require('commander');

app.version(require('./package.json').version)
        .option('-d, --development', 'Starts the application in development mode, which enables additional logging')
        .option('-c, --clean', 'Removes all settings and saved bucket data')
        .option('-P, --port <n>', 'Set the port of the webinterface to <n>. Default: 8080')
        .option('-R, --reactionDir [path]', 'Set the path from which all reactions are loaded')
        .option('-r, --reactionDataDir [path]', 'Set the path where the raction-data is saved')
        .option('-b, --bucketDataDir [path]', 'Set the path where the runtime-data is saved')
        .option('-L, --logDir [path]', 'Set the path where the logfiles are saved')
        .parse(process.argv);

function start() {
    require('./lib/config').setConfig(app);
    require('./lib/config').appLogger.info("Starting application");
    require('./lib/webinterface').start();
    require('./lib/bucketCollector').start();
}

start();