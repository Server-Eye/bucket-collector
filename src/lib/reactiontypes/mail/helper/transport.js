var nodemailer = require('nodemailer');
var _settings;

/**
 * Generates nodemailer-transport
 * 
 * @returns {Object}
 */
function get() {
    var settings = _settings.get();

    return nodemailer.createTransport({
        host: settings.host,
        auth: {
            user: settings.user,
            pass: settings.pass
        }
    });
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