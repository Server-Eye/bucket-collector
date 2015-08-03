
function index (req,res,next){
    res.render('index.jade');
}

(function($){
    $.index = index;
})(exports);