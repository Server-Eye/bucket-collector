/**
 * Sends an alive-message. Used to determine if an instance of the bucket-collector is already running.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
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