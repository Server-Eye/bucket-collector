var jsop = require('jsop');
var path = require('path');
var dataDir = require('../config').config.dataDir;

var _buckets = jsop(path.join(dataDir, 'buckets.json'));

