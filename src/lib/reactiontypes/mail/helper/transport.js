var nodemailer = require('nodemailer');
var _settings;

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

function init(settings) {
    _settings = settings;

    return get;
}

/**
 * @ignore
 */
module.exports = init;