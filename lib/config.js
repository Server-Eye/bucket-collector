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
    dbLogger = log4js.getLogger("DB");
    webLogger = log4js.getLogger("WEB");
    bucketLogger = log4js.getLogger("BUCKET");
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
    appLogger.info('config loaded');
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
//        $.dbConfig = require('../config/production/dbConfig.json');
    } else {
        $.config = require('../config/development/config.json');
//        $.dbConfig = require('../config/development/dbConfig.json');
    }
    
    appLogger.setLevel($.config.logLevel);
    dbLogger.setLevel($.config.logLevel);
    webLogger.setLevel($.config.logLevel);
    bucketLogger.setLevel($.config.logLevel);
    $.appLogger = appLogger;
    $.dbLogger = dbLogger;
    $.webLogger = webLogger;
    $.bucketLogger = bucketLogger;
})(exports);