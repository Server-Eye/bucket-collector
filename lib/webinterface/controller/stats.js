var buckets = require('../../dataStore').buckets;

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

(function ($) {
    $.getStats = getStats;
    $.getErrors = getErrors;
})(exports);