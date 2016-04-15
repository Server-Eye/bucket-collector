function service(req, res, next) {
    res.send(
        "I AM ALIVE!!!"
    );
}



/**
 * @ignore
 */
(function($) {
    $.service = service;
})(exports);