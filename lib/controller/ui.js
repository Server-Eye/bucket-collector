function index(req, res, next) {
        res.render('index.jade');
        //res.redirect('/config');
}

function settingsView(req,res,next){
    res.render('settingsView.jade');
}

function settingsPartial(req,res,next){
    res.render('partials/settings.jade');
}

function seHeader(req, res, next) {
    res.render('partials/seHeader.jade');
}

(function ($) {
    $.index = index;
    $.settingsView = settingsView;
    $.settingsPartial = settingsPartial;
    $.seHeader = seHeader;
})(exports);