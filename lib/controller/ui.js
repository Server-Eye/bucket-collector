
function index(req, res, next) {
    res.render('index.jade');
}

function seHeader(req, res, next) {
    res.render('partials/seHeader.jade');
}

(function ($) {
    $.index = index;
    $.seHeader = seHeader;
})(exports);