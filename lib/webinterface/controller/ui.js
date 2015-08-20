var settings = require('../../dataStore').settings;

function index(req, res, next) {
    if(typeof settings.checkSettings() === 'boolean'){
        res.render('index.jade');
    } else {
        res.redirect('/settings');
    }
}

function errors(req,res,next){
    res.render('errors.jade');
}

function settingsView(req,res,next){
    res.render('settings.jade');
}

function seHeader(req, res, next) {
    res.render('partials/seHeader.jade');
}

(function ($) {
    $.index = index;
    $.errors = errors;
    $.settings = settingsView;
    $.seHeader = seHeader;
})(exports);