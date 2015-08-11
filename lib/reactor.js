var dataStore = require('./dataStore');
var logger = require('./config').reactionLogger;
var buckets = require('./bucketsService');

var fs = require('fs');
var path = require('path');
var Q = require('q');

var reactor = {};


function react(bId, type) {
    var deferred = Q.defer();

    if (!reactor[type]) {
        logger.error("No reaction for", type, "defined!");
        deferred.reject("No reaction for", type, "defined!");
    } else {
        var promises = [];

        buckets.get(bId).then(function (bucket) {
            bucket.content.forEach(function () {
                var message = bucket.content.shift();
                promises.push(reactor[type].react(message).then(function (res) {
                    console.log("react success", res);
                    return res;
                }).fail(function (err) {
                    console.log("react fail", err);
                }));
            });
        });
        
        Q.allSettled(promises).then(function(res){
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function loadReactions() {
    logger.info('Start loading checktypes');

    var basedir = path.join(__dirname, './reactiontypes');

    var names = fs.readdirSync(basedir);
    var count = 0;

    names.forEach(function (name) {
        if (name[0] == '-') {
            logger.warn('scipping reactiontype: ' + name);
            return;
        }
        logger.info('Loading reactiontype: ' + name);
        var checkTypeName = name.slice(0, name.length - 3);
        reactor[checkTypeName] = require(path.join(basedir, name));
        count++;
    });

    logger.info('Finished loading reactiontypes');
    logger.info(count + ' reactiontype(s) loaded');
}

(function ($) {
    loadReactions();
    $.react = react;
    logger.debug(reactor);
})(exports);