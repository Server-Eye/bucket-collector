'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var window = null;

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
    
    app.on('ready', function(){
        window = new BrowserWindow({
            width: 800,
            height: 600
        });
        window.loadURL('http://127.0.0.1:8080/');
        
        window.on('closed', function(){
            window = null;
        });
    });
}

app.on('window-all-closed', function(){
    if(process.platform != 'darwin'){
        app.quit();
    }
});

start();