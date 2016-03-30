var settingsController = require('../controller/settings');
var uiController = require('../controller/ui');
var statsController = require('../controller/stats');
var interceptor = require('../controller/interceptor');

/**
 * Sets the available routes for the given expressApp.
 * 
 * @param {expressApp} app
 */
function init(app) {
    app.get('/', interceptor.allowCross, uiController.index);
    app.get('/errors/:bId', interceptor.allowCross, uiController.errors);
    app.get('/settings', interceptor.allowCross, uiController.settings);
    app.get('/partials/seHeader', interceptor.allowCross, uiController.seHeader);
    
    app.get('/settings/getSettings', interceptor.allowCross, settingsController.getSettings);
    app.post('/settings/setSettings', interceptor.allowCross, settingsController.setSettings);
    
    
    app.get('/stats/:bId', interceptor.allowCross, statsController.getStats);
    app.get('/stats/errors/:bId', interceptor.allowCross, statsController.getErrors);
}

/**
 * @ignore
 */
module.exports = init;