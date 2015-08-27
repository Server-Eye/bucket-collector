var appLogger, dbLogger, webLogger, bucketLogger;
var fs = require('fs');
var os = require('os');
var path = require('path');

/**
 * Initailizes all loggers with the configuration saved in `/config/logConfig.json`
 */
function initLoggers(config, $) {
    var log4js = require('log4js');
    
    var logDir;
    if(config.logDir){
        logDir = path.resolve(config.logDir);
    } else {
        logDir = path.join(__dirname, '../log');
    }

    if (!fs.existsSync(logDir)) {
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
    
    var dataDir;
    if(config.dataDir){
        dataDir = path.resolve(config.dataDir);
    } else {
        dataDir = path.join(__dirname, '../data');
    }
    appLogger.info("Trying to use data from", dataDir);
    if(!fs.existsSync(dataDir)){
        appLogger.warn(dataDir, 'does not exist, creating directory');
        fs.mkdirSync(dataDir);
        appLogger.info(dataDir, 'created');
    }
    $.config.dataDir = dataDir;
    
    var reactionDir;
    if(config.reactionDir){
        reactionDir = path.normalize(config.reactionDir);
    } else {
        reactionDir = path.join(__dirname, './reactiontypes');
    }
    appLogger.info("Trying to use reactions from", reactionDir);
    if(!fs.existsSync(reactionDir)){
        appLogger.warn(reactionDir, 'does not exist, creating directory');
        fs.mkdirSync(reactionDir);
        appLogger.warn(reactionDir, 'created');
    }
    $.config.reactionDir = reactionDir;
    
    if(config.port){
        $.config.webinterfacePort = config.port;
    }
    
    if(config.clean){
        appLogger.warn("CLEARING CACHE");
        fs.unlinkSync(path.resolve(dataDir,"buckets.json"));
        fs.unlinkSync(path.resolve(dataDir,"settings.json"));
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