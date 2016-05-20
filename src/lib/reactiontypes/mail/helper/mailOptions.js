var _settings, parser;

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

function init(settings) {
    _settings = settings;

    parser = require('./parser')(settings);

    return get;
}

/**
 * @ignore
 */
module.exports = init;