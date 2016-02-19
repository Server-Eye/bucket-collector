soap = require('./autotask/soap');
var fs = require('fs');

var parse = require('./autotask/parser');

soap.getClient().then(function (client) {

    console.log(client.describe());
    
//    client.ATWS.ATWSSoap.getEntityInfo(function(err,res){
//        console.log(err,res.GetEntityInfoResult.EntityInfo);
//    })

    var query = {
        Ticket: [
            {
                TicketNumber: {
                    equals: 'T20160219.0001'
                }
            }
        ]
    };

    client.ATWS.ATWSSoap.query({sXML: parse.query(query)}, function (err, res) {
        //console.log(err, res.queryResult.EntityResults);
        fs.writeFileSync('./res.json', JSON.stringify(res, 0,2,true));
        
        console.log(parse.result(res));
    });
});

//<queryxml>
//            <entity>Ticket</entity>
//            <query>
//            <field>TicketNumber<expression op="equals">"T20160219.0001"
//            </expression></field>
//            </query></queryxml>

function react(message) {
    var deferred = Q.defer();

    message.error = false;
    message.response = "all ok";

    deferred.resolve(message);

    return deferred.promise;
}

(function ($) {
    $.react = react;
})(exports);