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

function subject(bucketmessage) {
    var subject;

    if (subjectTemplates[bucketmessage.type]) {
        subject = subjectTemplates[bucketmessage.type](bucketmessage);
    } else {
        subject = "UNKNOWN MESSAGETYPE";
    }

    return subject;
}

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

function loadTemplates() {
    fs.readFile(stateHtmlTemplate, 'utf-8', function(error, source) {
        if (error) {
            console.log('Could not load mailtemplate from ', stateHtmlTemplate);
        } else {
            htmlTemplates.STATE = handlebars.compile(source);
        }
    });

    fs.readFile(hintHtmlTemplate, 'utf-8', function(error, source) {
        if (error) {
            console.log('Could not load mailtemplate from ', hintHtmlTemplate);
        } else {
            htmlTemplates.HINT = handlebars.compile(source);
        }
    });

    fs.readFile(stateTxtTemplate, 'utf-8', function(error, source) {
        if (error) {
            console.log('Could not load mailtemplate from ', stateTxtTemplate);
        } else {
            txtTemplates.STATE = handlebars.compile(source);
        }
    });

    fs.readFile(hintTxtTemplate, 'utf-8', function(error, source) {
        if (error) {
            console.log('Could not load mailtemplate from ', hintTxtTemplate);
        } else {
            txtTemplates.HINT = handlebars.compile(source);
        }
    });

    fs.readFile(stateSubjectTemplate, 'utf-8', function(error, source) {
        if (error) {
            console.log('Could not load mailtemplate from ', stateSubjectTemplate);
        } else {
            subjectTemplates.STATE = handlebars.compile(source);
        }
    });

    fs.readFile(hintSubjectTemplate, 'utf-8', function(error, source) {
        if (error) {
            console.log('Could not load mailtemplate from ', hintSubjectTemplate);
        } else {
            subjectTemplates.HINT = handlebars.compile(source);
        }
    });
}

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