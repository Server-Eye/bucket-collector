var buckets = require('../../dataStore').buckets.buckets;

/**
 * Sends all failed messages for the bId given in the request-params, sends an error message if no bId or matching bucket is found.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function getErrors(req, res, next) {
    var bId = req.params.bId;

    if (bId && typeof bId === 'string') {
        if (buckets[bId]) {
            res.send({
                success: true,
                errors: buckets[bId].messages.failed
            });
        } else {
            res.send({
                success: false,
                message: "NO BUCKET FOR ID " + bId
            });
        }
    } else {
        res.send({
            success: false,
            message: "NO VALID BID GIVEN"
        });
    }
}

/**
 * Sends all stats for the bId given in the request-params, sends an error message if no bId or matching bucket is found.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function getStats(req, res, next) {
    var bId = req.params.bId;

    if (bId && typeof bId === 'string') {
        if (buckets[bId]) {
            res.send({
                success: true,
                stats: buckets[bId].stats
            });
        } else {
            res.send({
                success: false,
                message: "BUCKET UNKNOWN"
            });
        }
    } else {
        res.send({
            success: false,
            message: "NO VALID BID GIVEN"
        });
    }
}

/**
 * @ignore
 */
(function($) {
    $.getStats = getStats;
    $.getErrors = getErrors;
})(exports);