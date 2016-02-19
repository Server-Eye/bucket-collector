var Handlebars = require('handlebars');
var source = require('fs').readFileSync('./templates/query');

var template = Handlebars.compile(source.toString());

function query(obj) {
    var res = template(obj);

    return res;
}

function result(res) {
    var data, results = [], i = 0, l = 0;
    data = res.queryResult.EntityResults.Entity;

    if (!data) {
        return results;
    }

    for (i = 0, l = data.length; i < l; i++) {
        results.push(flatten(data[i]));
    }
    return results;
}

function flatten(obj) {
    var newObj = {}, key, tmp;
    for (key in obj) {
        tmp = obj[key];
        if (typeof tmp === 'string') {
            newObj[key] = tmp;
        } else {
            if (tmp && tmp.$value) {
                if (tmp.attributes) {
                    switch (tmp.attributes['xsi:type']) {
                        case 'xsd:boolean':
                            newObj[key] = Boolean(tmp.$value);
                            break;
                        case 'xsd:int':
                        case 'xsd:decimal':
                            newObj[key] = parseFloat(tmp.$value);
                            break;
                        case 'xsd:dateTime':
                            newObj[key] = new Date(tmp.$value);
                            break;
                        default:
                            newObj[key] = tmp.$value;
                            break;
                    }
                } else {
                    newObj[key] = tmp.$value;
                }
            }
        }
    }
    return newObj;
}

(function ($) {
    $.query = query;
    $.result = result;
})(exports);