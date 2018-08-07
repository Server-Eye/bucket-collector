var nodemailer = require('nodemailer');
var _settings;

/**
 * Generates nodemailer-transport
 * 
 * @returns {Object}
 */
function get() {
    var settings = _settings.get();

    var config = {
        host: settings.host,
        port: settings.port
    };

    if (settings.user && settings.pass) {
        config.auth = {
            user: settings.user,
            pass: settings.pass
        }
    }

    if (settings.secure == "YES") {
        config.secure = true;
    } else {
        config.secure = false;
    }

    if (settings.ignoreCerts == "YES") {
        config.tls = {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    }

    return nodemailer.createTransport(config);
}

/**
 * Initalizes transport-module.
 * 
 * @param {Object} settings
 * @returns {function}
 */
function init(settings) {
    _settings = settings;

    return get;
}

/**
 * @ignore
 */
module.exports = init;