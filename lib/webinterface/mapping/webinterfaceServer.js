var settingsController = require('../controller/settings');
var uiController = require('../controller/ui');
var statsController = require('../controller/stats');
var interceptor = require('../controller/interceptor');

function init(app) {
    app.get('/', interceptor.allowCross, uiController.index);
    app.get('/settings', interceptor.allowCross, uiController.settings);
    app.get('/partials/seHeader', interceptor.allowCross, uiController.seHeader);
    
    app.get('/settings/getActiveBucketIds', interceptor.allowCross, settingsController.getActiveBucketIds);
    app.get('/settings/setActiveBucketIds', interceptor.allowCross, settingsController.setActiveBucketIds);
    app.get('/settings/getApiKey', interceptor.allowCross, settingsController.getApiKey);
    app.get('/settings/setApiKey', interceptor.allowCross, settingsController.setApiKey);
    app.get('/settings/getInterv', interceptor.allowCross, settingsController.getInterv);
    app.get('/settings/setInterv', interceptor.allowCross, settingsController.setInterv);
    app.get('/settings/getMaxRetries', interceptor.allowCross, settingsController.getMaxRetries);
    app.get('/settings/setMaxRetries', interceptor.allowCross, settingsController.setMaxRetries);
    app.get('/settings/getType', interceptor.allowCross, settingsController.getType);
    app.get('/settings/setType', interceptor.allowCross, settingsController.setType);
    app.get('/settings/setSettings', interceptor.allowCross, settingsController.setSettings);
    
    app.get('/stats/:bId', interceptor.allowCross, statsController.getStats);
}

module.exports = init;