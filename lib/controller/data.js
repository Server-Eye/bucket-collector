var dataStore = require('../dataStore');

function test(req,res,next){
    res.send({
        "test": true
    });
}

(function($){
    $.test = test;
})(exports);