var data = require('../controller/data');
var ui = require('../controller/ui');
var interceptor = require('../controller/interceptor');

function init(app) {
    app.get('/', interceptor.allowCross, ui.index);
    app.get('/settings', interceptor.allowCross, ui.settingsView);
    app.get('/partials/settings', interceptor.allowCross, ui.settingsPartial);
    app.get('/partials/seHeader', interceptor.allowCross, ui.seHeader);
    
    app.get('/settings/getApiKey', interceptor.allowCross, data.getApiKey);
    app.get('/settings/setApiKey', interceptor.allowCross, data.setApiKey);
    app.get('/settings/getInterv', interceptor.allowCross, data.getInterv);
    app.get('/settings/setInterv', interceptor.allowCross, data.setInterv);
    app.get('/settings/getUrl', interceptor.allowCross, data.getUrl);
    app.get('/settings/setUrl', interceptor.allowCross, data.setUrl);
    app.get('/settings/getActiveBucketIds', interceptor.allowCross, data.getActiveBucketIds);
    app.get('/settings/setActiveBucketIds', interceptor.allowCross, data.setActiveBucketIds);
}

module.exports = init;