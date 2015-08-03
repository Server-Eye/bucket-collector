var express = require('express');
var port = require("./config").config.webinterfacePort;
var logger = require("./config").webLogger;

/**
 * Configures express-app
 * 
 * @return {expressApp}
 */
function config() {
    var app = express();

    app.use(express.static('bower_components'));
    app.use(express.static('public'));
    app.set('views', 'public/views');
    app.set('view engine', 'jade');
    
    return app;
}

/**
 * Loads express-app and starts the webinterface
 * 
 * @return {undefined}
 */
function start() {
    logger.info("webinterface here");
    var app = config();

    require('./mapping/webinterfaceServer.js')(app);

    logger.info("Starting webinterface on port " + port);
    app.listen(port);
    logger.info("webinterface running on port " + port);
}

(function ($) {
    $.start = start;
})(exports);