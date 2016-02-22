var Q = require('q');
var soap = require('soap');

var baseUrl = "https://webservices.autotask.net/atservices/1.5/atws.wsdl";

var client;

var settings;

//var fs = require('fs');
//
//var parse = require('./autotask/parser');
//var query = {
//    Ticket: [
//        {
//            TicketNumber: {
//                equals: 'T20160219.0001'
//            }
//        }
//    ]
//};

//getClient().then(function (client) { 
//    console.log(client.ATWS.ATWSSoap);
//    client.ATWS.ATWSSoap.GetFieldInfo({"psObjectType": "Ticket"}, function (err, res) {
//        //console.log(err, res)
//        fs.writeFileSync('./getEntity.json', JSON.stringify(res, 0, 2, true));
//    });
//
//    var ticket = {
//        Entities: [{
//                Entity: {
//                    attributes: {
//                        'xsi:type': 'Ticket'
//                    },
//                    AccountID: 29683810, 
//                    DueDateTime: "2016-02-23",
//                    QueueID: 8,
//                    //id: "",
//                    Priority: 3,
//                    Status: 1,
//                    Title: "SE Bucket Ticket"
//                }
//            }]
//    }
//
//    client.ATWS.ATWSSoap.create(ticket, function(err,res){
//        if(err || res.createResult.ReturnCode < 0){
//            console.log(err);
//            console.log(res.createResult.Errors.ATWSError);
//        } else {
//            fs.writeFileSync('./res.json', JSON.stringify(res, 0,2,true));
//        }
//    });


//    client.ATWS.ATWSSoap.query({sXML: parse.query(query)}, function (err, res) {
//        //console.log(err, res.queryResult.EntityResults);
//        fs.writeFileSync('./res.json', JSON.stringify(res, 0,2,true));
//        
//        console.log(parse.result(res));
//    });
//});

function getClient() {
    var deferred = Q.defer();

    if (client) {
        deferred.resolve(client);
    } else {
        soap.createClient(baseUrl, function (err, _client) {
            if (err) {
                console.log(err);
                deferred.reject(err);
            } else {
                _client.ATWS.ATWSSoap.getZoneInfo({
                    UserName: settings.username
                }, (function (err, res) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        _client.setEndpoint(res.getZoneInfoResult.URL);

                        _client.setSecurity(new soap.BasicAuthSecurity(settings.username, settings.password));

                        client = _client;

                        deferred.resolve(client);
                    }
                }));
            }
        });
    }

    return deferred.promise;
}

function ticket(data){
    var deferred = Q.defer();
    
    getClient().then(function (_client) {
        _client.ATWS.ATWSSoap.create(data, function (err, res) {
            if (err) {
                data.error = true;
                data.response = err;
            } else {
                if(res.createResult && res.createResult.ReturnCode < 0){
                    data.error = true;
                    data.response = res;
                } else {
                    data.error = false;
                    data.response = res;
                }
            }
            deferred.resolve(data);
        });
    });
    
    return deferred.promise;
}

function init(_settings){
    
    settings = _settings;
    
    return {
        ticket: ticket //,
        //note: note
    };
}

module.exports = init;