/**
 * Allows cross-origin for the following call
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function allowCross(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');
    if (req.headers['access-control-request-headers']) {
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    } else {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    next();
}

/**
 * Exports interceptor-object
 */
module.exports = {
    allowCross: allowCross
};