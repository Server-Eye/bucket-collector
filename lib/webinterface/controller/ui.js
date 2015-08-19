var settings = require('../../dataStore').settings;

function index(req, res, next) {
    if(typeof settings.checkSettings() === 'boolean'){
        res.render('index.jade');
    } else {
        res.redirect('/settings');
    }
}

function settingsView(req,res,next){
    res.render('settings.jade');
}

function seHeader(req, res, next) {
    res.render('partials/seHeader.jade');
}

(function ($) {
    $.index = index;
    $.settings = settingsView;
    $.seHeader = seHeader;
})(exports);