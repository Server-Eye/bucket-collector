var settingsController = require('../controller/settings');
var reactionDataController = require('../controller/reactionData');
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
    
    app.get('/settings/getSettings', interceptor.allowCross, settingsController.getSettings);
    app.post('/settings/setSettings', interceptor.allowCross, settingsController.setSettings);
    
    app.get('/settings/reaction/:name', interceptor.allowCross, uiController.additionalSettings);
    
    app.get('/partials/seHeader', interceptor.allowCross, uiController.seHeader);
    app.get('/partials/settingsInput', interceptor.allowCross, uiController.settingsInput);
    app.get('/partials/settingsSelect', interceptor.allowCross, uiController.settingsSelect);
    app.get('/partials/settingsAssignment', interceptor.allowCross, uiController.settingsAssignment);
    
    app.get('/reaction/:name/:method', interceptor.allowCross, reactionDataController.method)
    app.get('/reactionData/:name/get', interceptor.allowCross, reactionDataController.getData);
    app.post('/reactionData/:name/set', interceptor.allowCross, reactionDataController.setData);
    
    
    
    app.get('/stats/:bId', interceptor.allowCross, statsController.getStats);
    app.get('/stats/errors/:bId', interceptor.allowCross, statsController.getErrors);
}

/**
 * @ignore
 */
module.exports = init;