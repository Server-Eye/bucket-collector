var Q = require("q");
var _settings, mailOptions, transport;

function sendMail(bucketmessage) {
    var deferred = Q.defer();

    var settings = _settings.get();

    var messagetype = checkMessagetype(bucketmessage);

    if (settings.cases && (settings.cases.indexOf(messagetype) >= 0)) {
        var transporter = transport();

        var mail = mailOptions(bucketmessage);

        transporter.sendMail(mail, function(error, info) {
            if (error) {
                deferred.resolve({
                    error: true,
                    response: error
                });
            } else {
                deferred.resolve({
                    error: false,
                    response: info.response
                });
            }
        });
    } else {
        deferred.resolve({
            error: false,
            response: messagetype + "-Message. Only sending " + settings.cases
        });
    }

    return deferred.promise;
}

function checkMessagetype(bucketmessage) {
    if (bucketmessage == "STATE") {
        if (bucketmessage.state.error) {
            return "ERROR";
        } else {
            return "OK";
        }
    }

    if (bucketmessage == "HINT") {
        if (bucketmessage.note.private) {
            return "PRIVATEHINT";
        } else {
            return "HINT";
        }
    }

    return "UNKNOWNTYPE";
}

function init(settings) {
    _settings = settings;

    mailOptions = require('./helper/mailOptions')(settings);
    transport = require('./helper/transport')(settings);

    return sendMail;
}

/**
 * @ignore
 */
module.exports = init;