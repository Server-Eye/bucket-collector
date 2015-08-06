function index(req, res, next) {
        res.render('index.jade');
        //res.redirect('/config');
}

function settings(req,res,next){
    res.render('settings.jade');
}

function seHeader(req, res, next) {
    res.render('partials/seHeader.jade');
}

(function ($) {
    $.index = index;
    $.settings = settings;
    $.seHeader = seHeader;
})(exports);