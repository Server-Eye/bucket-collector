var _settings, parser;

/**
 * Generates mailOptions with the given bucketmessage.
 * 
 * @param {Object} bucketmessage
 * @returns {Object}
 */
function get(bucketmessage) {
    var settings = _settings.get();
    var mailOptions = {
        from: settings.from
    };

    if (settings.to && settings.to.length) {
        var to = settings.to.join();
        mailOptions.to = to;
    } else {
        mailOptions.to = bucketmessage.user.email;
    }

    if (settings.bcc && settings.bcc.length) {
        var bcc = settings.bcc.join();

        mailOptions.bcc = bcc;
    }

    mailOptions.text = parser.text(bucketmessage);
    mailOptions.html = parser.html(bucketmessage);
    mailOptions.subject = parser.subject(bucketmessage);

    return mailOptions;
}

/**
 * Initalizes mailOptions-module.
 * 
 * @param {Object} settings
 * @returns {function}
 */
function init(settings) {
    _settings = settings;

    parser = require('./parser')(settings);

    return get;
}

/**
 * @ignore
 */
module.exports = init;