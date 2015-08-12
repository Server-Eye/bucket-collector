var appLogger, dbLogger, webLogger, bucketLogger;
var fs = require('fs');
var os = require('os');
var path = require('path');

/**
 * Initailizes all logers with the configuration saved in `/config/logConfig.json`
 * 
 * @return {undefined}
 */
function initLoggers() {
    var log4js = require('log4js');

    if (!fs.existsSync('log')) {
        fs.mkdirSync('log');
    }

    var logConfig = require('../config/logConfig.json');
    log4js.configure(logConfig);
    appLogger = log4js.getLogger("APP");
    settingsLogger = log4js.getLogger("SETTINGS");
    webLogger = log4js.getLogger("WEB");
    bucketLogger = log4js.getLogger("BUCKET");
    reactionLogger = log4js.getLogger("REACTION");
}

/**
 * Loads all configfiles depending on NODE_ENV environment variable.
 * Sets Loglevel of all loggers and and exports configs and loggers
 * 
 * @param {exports} $
 * @returns {undefined}
 */
(function getConfig($) {
    initLoggers();
    appLogger.info('Loading config');
    var env = process.env.NODE_ENV;
    if (!env) {
        appLogger.warn("NODE_ENV not defined, use 'development' or 'production'");
        env = 'production';
    } else {
        if (env != 'development' && env!= 'production') {
            appLogger.error("NODE_ENV unknown parameter, use 'development' or 'production'");
            env = 'production';
        }
    }
    appLogger.info('Starting in mode "' + env + '"');
    if (env == 'production') {
        $.config = require('../config/production/config.json');
    } else {
        $.config = require('../config/development/config.json');
    }
    
    var dataDir = path.join(__dirname, '../data');
    appLogger.info("Trying to use data from", dataDir);
    if(!fs.existsSync(dataDir)){
        appLogger.warn(dataDir, 'does not exist, creating directory');
        fs.mkdirSync(dataDir);
        appLogger.info(dataDir, 'created');
    }
    $.config.dataDir = dataDir;
    
    $.config.apiUrl = "https://api.server-eye.de/2/";
    
    appLogger.setLevel($.config.logLevel);
    settingsLogger.setLevel($.config.logLevel);
    webLogger.setLevel($.config.logLevel);
    bucketLogger.setLevel($.config.logLevel);
    reactionLogger.setLevel($.config.logLevel);
    $.appLogger = appLogger;
    $.settingsLogger = settingsLogger;
    $.webLogger = webLogger;
    $.bucketLogger = bucketLogger;
    $.reactionLogger = reactionLogger;
})(exports);