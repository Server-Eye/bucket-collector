var Q = require("q");
var fs = require("fs");
var path = require("path");
var debugDir = require('../../config').config.debugDir;
var _settings, mailOptions;

/**
 * Parses template for the given bucketmessage and writes result to `debugDir`.
 * 
 * @param {Object} bucketmessage
 * @returns {promise}
 */
function debug(bucketmessage) {
    var deferred = Q.defer();

    console.log("START DEBUG");

    var mail = mailOptions(bucketmessage);

    console.log(mail);

    console.log("Writing debug to " + debugDir);
    fs.writeFileSync(path.join(debugDir, bucketmessage.type + bucketmessage.state.date + '.json'), JSON.stringify(mail, null, 2));
    fs.writeFileSync(path.join(debugDir, bucketmessage.type + bucketmessage.state.date + '.html'), mail.html);
    fs.writeFileSync(path.join(debugDir, bucketmessage.type + bucketmessage.state.date + '.txt'), mail.text);
    console.log("DONE WRITING");

    deferred.resolve({
        error: false,
        response: "debug"
    });

    return deferred.promise;
}

/**
 * Initalizes debug-module.
 * 
 * @param {Object} settings
 * @returns {function}
 */
function init(settings) {
    _settings = settings;

    mailOptions = require('./helper/mailOptions')(settings);

    return debug;
}

/**
 * @ignore
 */
module.exports = init;