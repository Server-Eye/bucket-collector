var data = require('../controller/data');
var ui = require('../controller/ui');
var interceptor = require('../controller/interceptor');

function init(app) {
    app.get('/', interceptor.allowCross, ui.index);
    app.get('/settings', interceptor.allowCross, ui.settings);
    app.get('/partials/seHeader', interceptor.allowCross, ui.seHeader);
    
    app.get('/settings/getActiveBucketIds', interceptor.allowCross, data.getActiveBucketIds);
    app.get('/settings/setActiveBucketIds', interceptor.allowCross, data.setActiveBucketIds);
    app.get('/settings/getApiKey', interceptor.allowCross, data.getApiKey);
    app.get('/settings/setApiKey', interceptor.allowCross, data.setApiKey);
    app.get('/settings/getInterv', interceptor.allowCross, data.getInterv);
    app.get('/settings/setInterv', interceptor.allowCross, data.setInterv);
    app.get('/settings/getType', interceptor.allowCross, data.getType);
    app.get('/settings/setType', interceptor.allowCross, data.setType);
    app.get('/settings/getUrl', interceptor.allowCross, data.getUrl);
    app.get('/settings/setUrl', interceptor.allowCross, data.setUrl);
}

module.exports = init;