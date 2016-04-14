(function () {
    "use strict";

    angular.module('bucket-collector').factory('SchemeDataService', SchemeDataService);

    SchemeDataService.$inject = ['$http', '$q', 'ReactionMethodService', 'SEDataService'];

    function SchemeDataService($http, $q, ReactionMethod, SEData) {
        return getData;

        function getData(reactionName, dataScheme) {
            var deferred = $q.defer();
            
            if(!angular.isArray(dataScheme)){
                if(!dataScheme.source){
                    deferred.resolve([]);
                }
                if(dataScheme.source == "reaction"){
                    deferred.resolve(ReactionMethod(reactionName, dataScheme.method));
                } 
                if(dataScheme.source == "SE"){
                    if (SEData[dataScheme.method]) {
                        deferred.resolve(SEData[dataScheme.method]());
                    } else {
                        deferred.resolve("UNKNOWN METHOD");
                    }
                }
            } else {
                var promises = [];
                angular.forEach(dataScheme, function(scheme){
                    promises.push(getData(reactionName, scheme));
                });
                
                $q.all(promises).then(function (results) {
                    deferred.resolve(results);
                });
            }
            
            return deferred.promise;
        }
    }
})();