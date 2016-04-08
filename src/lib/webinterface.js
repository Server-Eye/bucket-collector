var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var port = require("./config").config.webinterfacePort;
var reactionDataDir = require("./config").config.reactionDataDir;
var logger = require("./config").webLogger;

/**
 * Configures express-app
 * 
 * @return {expressApp}
 */
function config() {
    var app = express();

    app.use(express.static(path.resolve(__dirname, '../bower_components')));
    app.use(express.static(path.resolve(__dirname, '../public')));
    app.use('/scheme', express.static(path.resolve(__dirname, '../scheme')));

    app.use(bodyParser.json());

    app.set('views', path.resolve(__dirname, '../public/views'));
    app.set('view engine', 'jade');

    return app;
}

/**
 * Loads express-app and starts the webinterface
 */
function start() {
    var app = config();

    require('./webinterface/mapping/webinterfaceServer.js')(app);

    logger.info("Starting webinterface on port " + port);
    app.listen(port);
    logger.info("webinterface running on port " + port);
}

(function ($) {
    $.start = start;
})(exports);