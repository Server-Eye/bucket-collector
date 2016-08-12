/**
 * @ignore
 */
var path = require('path');
var dataDir = require('../config').config.bucketDataDir;
var bucketPath = path.join(dataDir, 'buckets.json');
var fs = require('fs');
var logger = require('../config').appLogger;

var _buckets;

function init() {
    try {
        fs.accessSync(bucketPath, fs.constants.R_OK | fs.constants.W_OK);

        var _bucketsString = fs.readFileSync(bucketPath, 'utf8');

        _buckets = JSON.parse(_bucketsString);
    } catch (e) {
        logger.warn('Could not load buckets.json: ' + e);
        logger.warn('Resetting buckets.json...');

        _buckets = {};
        fs.writeFileSync(bucketPath, JSON.stringify(_buckets, null, 2), 'utf8');
    }
}

function updateFile() {
    try {
        logger.debug('Updating buckets.json');
        fs.writeFileSync(bucketPath, JSON.stringify(_buckets, null, 2), 'utf8');
    } catch (e) {
        logger.error('Could not update buckets.json: ' + e);
    }
}

init();

module.exports = {
    buckets: _buckets,
    updateFile: updateFile
};