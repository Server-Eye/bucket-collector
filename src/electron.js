'use strict';
        const electron = require('electron');
        const app = electron.app;
        const BrowserWindow = electron.BrowserWindow;
        var window = null;
var request = require('request');
var Q = require('q');

var ELECTRON_READY = false;

var config = {
    reactionDataDir: './reaction-data',
    bucketDataDir: './bucket-data',
    logDir: './logs'
};

function checkRunning() {
    var deferred = Q.defer();

    request({
        url: "http://127.0.0.1:8080/service",
        method: 'GET'
    }, function (err, res, body) {
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
    checkRunning().then(function (running) {
        if (!running) {
            require('./lib/config').setConfig(config);
            require('./lib/config').appLogger.info("Starting application");
            require('./lib/webinterface').start();
            require('./lib/bucketCollector').start();

        }
        startUI();
    }).fail(function (reason) {
        throw(reason);
    });
}

function startUI() {
    if (ELECTRON_READY) {
        window = new BrowserWindow({
            width: 800,
            height: 600
        });
        window.loadURL('http://127.0.0.1:8080/');

        window.on('closed', function () {
            window = null;
        });
        app.on('window-all-closed', function () {
            if (process.platform != 'darwin') {
                app.quit();
            }
        });
    } else {
        app.on('ready', function () {
            ELECTRON_READY = true;
            startUI();
        });
    }
}

app.on('ready', function () {
    ELECTRON_READY = true;
});

start();