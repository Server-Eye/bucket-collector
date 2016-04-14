var Handlebars = require('handlebars');

/**
 * Handlebars helperfunction
 */
Handlebars.registerHelper('if_ne', function(a, b, opts) {
    if (a != b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

var queryTemplateStr = require('./template').query.join('\n');

var queryTemplate = Handlebars.compile(queryTemplateStr);

/**
 * Parser the given object to a autotask-query-xml-string
 * 
 * @param {Object} obj
 * @return {string}
 */
function query(obj) {
    var res = queryTemplate(obj);

    return res;
}

/**
 * Parses the given responseobjects and returns an array of results
 * 
 * @param {Object} res
 * @return {Array}
 */
function result(res) {
    var data;
    var results = [];
    var i = 0;
    var l = 0;

    if (res.queryResult && res.queryResult.EntityResults && res.queryResult.EntityResults.Entity)
        data = res.queryResult.EntityResults.Entity;

    if (!data) {
        return results;
    }

    for (i = 0, l = data.length; i < l; i++) {
        results.push(parseResultObj(data[i]));
    }
    return results;
}

/**
 * Parses a single resultObj. Returns a new object.
 * 
 * @param {Object} obj
 * @return {Object}
 */
function parseResultObj(obj) {
    var newObj = {};
    var key, tmp;
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

/**
 * Parses the given dateobject to a autotask-date-string
 * 
 * @param {Date} date
 * @return {String}
 */
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

/**
 * Adds leading zero to 2 digit numbers
 * 1 --> "01"
 * 
 * @param {number} num
 * @return {String}
 */
function padZero(num) {
    return parseInt(num, 10) < 10 ? "0" + num : num;
}

/**
 * See padZero(num)
 * 
 * @param {number} num
 * @return {String}
 */
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

/**
 * @ignore
 */
(function($) {
    $.formatDate = formatDate;
    $.query = query;
    $.result = result;
})(exports);