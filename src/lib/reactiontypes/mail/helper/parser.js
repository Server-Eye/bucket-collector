var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var templateDir = require('../../../config').config.templateDir;

var stateHtmlTemplate = path.join(templateDir, "./mail/state/state.html");
var stateTxtTemplate = path.join(templateDir, "./mail/state/state.txt");
var stateSubjectTemplate = path.join(templateDir, "./mail/state/subject.txt");

var hintHtmlTemplate = path.join(templateDir, "./mail/hint/hint.html");
var hintTxtTemplate = path.join(templateDir, "./mail/hint/hint.txt");
var hintSubjectTemplate = path.join(templateDir, "./mail/hint/subject.txt");

var htmlTemplates = {
    STATE: handlebars.compile("NO TEMPLATE"),
    HINT: handlebars.compile("NO TEMPLATE")
};
var txtTemplates = {
    STATE: handlebars.compile("NO TEMPLATE"),
    HINT: handlebars.compile("NO TEMPLATE")
};
var subjectTemplates = {
    STATE: handlebars.compile("NO TEMPLATE"),
    HINT: handlebars.compile("NO TEMPLATE")
};

var _settings;

/**
 * Parses mailSubject
 * 
 * @param {Object} bucketmessage
 * @returns {String}
 */
function subject(bucketmessage) {
    var subject;

    if (subjectTemplates[bucketmessage.type]) {
        subject = subjectTemplates[bucketmessage.type](bucketmessage);
    } else {
        subject = "UNKNOWN MESSAGETYPE";
    }

    return subject;
}

/**
 * Parses mailHtml
 * 
 * @param {Object} bucketmessage
 * @returns {String}
 */
function html(bucketmessage) {
    var html;

    if (bucketmessage.state && bucketmessage.state.date) {
        bucketmessage.state.dateString = new Date(bucketmessage.state.date).toLocaleString();
    }

    if (bucketmessage.note && bucketmessage.note.date) {
        bucketmessage.note.dateString = new Date(bucketmessage.note.date).toLocaleString();
    }

    if (htmlTemplates[bucketmessage.type]) {
        html = htmlTemplates[bucketmessage.type](bucketmessage);
    } else {
        html = "UNKNOWN MESSAGETYPE";
    }

    return html;
}

/**
 * Parses mailText
 * 
 * @param {Object} bucketmessage
 * @returns {String}
 */
function text(bucketmessage) {
    var text;
    if (bucketmessage.state.date) {
        bucketmessage.state.dateString = new Date(bucketmessage.state.date).toLocaleString();
    }

    if (txtTemplates[bucketmessage.type]) {
        text = txtTemplates[bucketmessage.type](bucketmessage);
    } else {
        text = "UNKNOWN MESSAGETYPE";
    }

    return text;
}

/**
 * Loads all mailtemplates from `templateDir`
 */
function loadTemplates() {
    try {
        htmlTemplates.STATE = handlebars.compile(fs.readFileSync(stateHtmlTemplate, 'utf-8') || "NO TEMPLATE LOADED");

        htmlTemplates.HINT = handlebars.compile(fs.readFileSync(hintHtmlTemplate, 'utf-8') || "NO TEMPLATE LOADED");

        txtTemplates.STATE = handlebars.compile(fs.readFileSync(stateTxtTemplate, 'utf-8') || "NO TEMPLATE LOADED");

        txtTemplates.HINT = handlebars.compile(fs.readFileSync(hintTxtTemplate, 'utf-8') || "NO TEMPLATE LOADED");

        subjectTemplates.STATE = handlebars.compile(fs.readFileSync(stateSubjectTemplate, 'utf-8') || "NO TEMPLATE LOADED");

        subjectTemplates.HINT = handlebars.compile(fs.readFileSync(hintSubjectTemplate, 'utf-8') || "NO TEMPLATE LOADED");
    } catch (e) {
        console.log(e);
    }
}

/**
 * Initalizes parser-module.
 * 
 * @param {Object} settings
 * @returns {Object}
 */
function init(settings) {
    _settings = settings;

    loadTemplates();

    return {
        subject: subject,
        html: html,
        text: text
    };
}

/**
 * @ignore
 */
module.exports = init;