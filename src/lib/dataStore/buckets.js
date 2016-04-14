/**
 * @ignore
 */
var jsop = require('jsop');
var path = require('path');
var dataDir = require('../config').config.bucketDataDir;

var _buckets = jsop(path.join(dataDir, 'buckets.json'));
if (!_buckets) {
    _buckets = {};
}


module.exports = _buckets;