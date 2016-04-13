var appLogger, dbLogger, webLogger, bucketLogger;
var fs = require('fs');
var os = require('os');
var path = require('path');

/**
 * Initailizes all loggers with the configuration saved in `/config/logConfig.json`
 */
function initLoggers(config, $) {
    var log4js = require('log4js');
    
    //logDir
    var logDir;
    if(config.logDir){
        logDir = path.resolve(config.logDir);
    } else {
        logDir = path.join(__dirname, '../logs');
    }

    try {
        if(!fs.statSync(logDir).isDirectory()){
            fs.mkdirSync(logDir);
        }
    } catch(e){
        fs.mkdirSync(logDir);
    }

    var logConfig = require('../config/logConfig.json');
    log4js.configure(logConfig, {cwd: logDir});
    appLogger = log4js.getLogger("APP");
    settingsLogger = log4js.getLogger("SETTINGS");
    webLogger = log4js.getLogger("WEB");
    bucketLogger = log4js.getLogger("BUCKET");
    reactionLogger = log4js.getLogger("REACTION");
}

/**
 * Applies settings from CLI
 * 
 * @param {Object} config
 * @param {Exports} $
 */
function setConfig(config, $){
    initLoggers(config, $);
    
    $.appLogger = appLogger;
    $.settingsLogger = settingsLogger;
    $.webLogger = webLogger;
    $.bucketLogger = bucketLogger;
    $.reactionLogger = reactionLogger;
    
    var env;
    if(config.development){
        env = 'development';
    } else {
        env = 'production';
    }
    
    appLogger.info('Starting in mode "' + env + '"');
    if (env == 'production') {
        $.config = require('../config/production/config.json');
    } else {
        $.config = require('../config/development/config.json');
    }
    
    appLogger.setLevel($.config.logLevel);
    settingsLogger.setLevel($.config.logLevel);
    webLogger.setLevel($.config.logLevel);
    bucketLogger.setLevel($.config.logLevel);
    reactionLogger.setLevel($.config.logLevel);
    
    //reactionData
    var reactionDataDir;
    if(config.reactionDataDir){
        reactionDataDir = path.resolve(config.reactionDataDir);
    } else {
        reactionDataDir = path.join(__dirname, '../reaction-data');
    }
    appLogger.info("Trying to use reaction-data from", reactionDataDir);
    try {
        if(fs.statSync(reactionDataDir).isDirectory()){
            appLogger.info("Using data from", reactionDataDir);
        }
    } catch(e){
        appLogger.warn(reactionDataDir, 'does not exist, creating directory');
        fs.mkdirSync(reactionDataDir);
        appLogger.info(reactionDataDir, 'created');
    }
    $.config.reactionDataDir = reactionDataDir;
    
    //bucketData
    var bucketDataDir;
    if(config.bucketDataDir){
        bucketDataDir = path.resolve(config.bucketDataDir);
    } else {
        bucketDataDir = path.join(__dirname, '../bucket-data');
    }
    appLogger.info("Trying to use bucket-data from", bucketDataDir);
    try {
        if(fs.statSync(bucketDataDir).isDirectory()){
            appLogger.info("Using data from", bucketDataDir);
        }
    } catch(e){
        appLogger.warn(bucketDataDir, 'does not exist, creating directory');
        fs.mkdirSync(bucketDataDir);
        appLogger.info(bucketDataDir, 'created');
    }
    $.config.bucketDataDir = bucketDataDir;
    
    //reactionDir
    var reactionDir;
    if(config.reactionDir){
        reactionDir = path.normalize(config.reactionDir);
    } else {
        reactionDir = path.join(__dirname, './reactiontypes');
    }
    appLogger.info("Trying to use reactions from", reactionDir);
    try {
        if(fs.statSync(reactionDir).isDirectory()){
            appLogger.info("Using reactions from", reactionDir);
        }
    } catch(e){
        appLogger.warn(reactionDir, 'does not exist, creating directory');
        fs.mkdirSync(reactionDir);
        appLogger.info(reactionDir, 'created');
    }
    $.config.reactionDir = reactionDir;
    
    if(config.port){
        $.config.webinterfacePort = config.port;
    }

    $.config.apiUrl = "https://api.server-eye.de/2/";
}

/**
 * Loads all configfiles depending on NODE_ENV environment variable.
 * Sets Loglevel of all loggers and and exports configs and loggers
 * 
 * @param {exports} $
 */
(function getConfig($) {
    $.setConfig = function(config){
        setConfig(config, $);
    };
})(exports);