var Handlebars = require('handlebars');

Handlebars.registerHelper('if_ne', function (a, b, opts) {
    if (a != b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

var source = require('./template').query.join('\n');

var template = Handlebars.compile(source);

function query(obj) {
    var res = template(obj);

    return res;
}

function result(res) {
    var data, results = [], i = 0, l = 0;
    
    if(res.queryResult && res.queryResult.EntityResults && res.queryResult.EntityResults.Entity)
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

function formatDate(date) {
    var hr = date.getHours(),
            min = date.getMinutes(),
            secs = date.getSeconds(),
            milSecs = date.getMilliseconds();

    return date.getFullYear() + "-" +
            padZero(date.getMonth() + 1) + "-" +
            padZero(date.getDate()) + 'T' +
            padZero(hr) + ':' +
            padZero(min) + ':' +
            padZero(secs) + '.' +
            padMiliSecs(milSecs) + 'Z';
}


function padZero(num) {
    return parseInt(num, 10) < 10 ? "0" + num : num;
}

function padMiliSecs(num) {
    var returnVal = "";
    num = parseInt(num, 10);
    if (num < 100) {
        returnVal += "0";
    }

    if (num < 10) {
        returnVal += "0";
    }

    returnVal += num;
    return returnVal;
}

(function ($) {
    $.formatDate = formatDate;
    $.query = query;
    $.result = result;
})(exports);