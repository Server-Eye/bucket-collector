'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var window = null;

var config = {
    reactionDataDir: './reaction-data',
    bucketDataDir: './bucket-data'
};

function start() {
    require('./lib/config').setConfig(config);
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