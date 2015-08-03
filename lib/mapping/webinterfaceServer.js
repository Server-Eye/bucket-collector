var data = require('../controller/data');
var ui = require('../controller/ui');

function init(app){
    app.get('/', ui.index);
    app.get('/data', data.test);
};

module.exports = init;