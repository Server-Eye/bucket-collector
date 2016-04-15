'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var window = null;
var request = require('request');
var options = require('commander');
var Q = require('q');

var ELECTRON_READY = false;


options.version(require('./package.json').version)
    .option('-d, --development', 'Starts the application in development mode, which enables additional logging')
    .option('-r, --reactionDataDir [path]', 'Set the path where the raction-data is saved')
    .option('-b, --bucketDataDir [path]', 'Set the path where the runtime-data is saved')
    .option('-L, --logDir [path]', 'Set the path where the logfiles are saved')
    .option('-s, --service', 'Starts the application without the UI')
    .parse(process.argv);

options.reactionDataDir = options.reactionDataDir || './reaction-data';
options.bucketDataDir = options.bucketDataDir || './bucket-data';
options.logDir = options.logDir || './logs';
options.service = options.service || false;

function checkRunning() {
    var deferred = Q.defer();

    request({
        url: "http://127.0.0.1:8080/service",
        method: 'GET'
    }, function(err, res, body) {
        if (err) {
            if (err.code == "ECONNREFUSED") {
                deferred.resolve(false);
            } else {
                deferred.reject(err);
            }
        } else {
            if (body == "I AM ALIVE!!!") {
                deferred.resolve(true);
            } else {
                deferred.reject("UNKNOWN SERVICE RUNNING ON 8080");
            }
        }
    });

    return deferred.promise;
}

function start() {
    checkRunning().then(function(running) {
        if (!running) {
            require('./lib/config').setConfig(options);
            require('./lib/config').appLogger.info("Starting application");
            require('./lib/webinterface').start();
            require('./lib/bucketCollector').start();
        }
        if (!options.service) {
            startUI();
        }
    }).fail(function(reason) {
        throw (reason);
    });
}

function startUI() {
    if (ELECTRON_READY) {
        window = new BrowserWindow({
            width: 800,
            height: 600
        });
        window.loadURL('http://127.0.0.1:8080/');

        window.on('closed', function() {
            window = null;
        });
        app.on('window-all-closed', function() {
            if (process.platform != 'darwin') {
                app.quit();
            }
        });
    } else {
        app.on('ready', function() {
            ELECTRON_READY = true;
            startUI();
        });
    }
}

app.on('ready', function() {
    ELECTRON_READY = true;
});

start();