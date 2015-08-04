var data = require('../controller/data');
var ui = require('../controller/ui');
var interceptor = require('../controller/interceptor');

function init(app) {
    app.get('/', interceptor.allowCross, ui.index);
    app.get('/partials/seHeader', interceptor.allowCross, ui.seHeader);

    app.get('/settings/getApiKey', interceptor.allowCross, data.getApiKey);
    app.get('/settings/setApiKey', interceptor.allowCross, data.setApiKey);
}

module.exports = init;