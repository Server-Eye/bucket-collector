
function index(req, res, next) {
    res.render('index.jade');
}

function seHeader(req, res, next) {
    res.render('partials/seHeader.jade');
}

function settings(req, res, next) {
    res.render('partials/settings.jade');
}

function login(req, res, next) {
    res.render('partials/login.jade');
}

(function ($) {
    $.index = index;
    $.seHeader = seHeader;
    $.settings = settings;
    $.login = login;
})(exports);