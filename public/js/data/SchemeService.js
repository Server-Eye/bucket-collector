(function () {
    "use strict";

    angular.module('bucket-collector').factory('SchemeService', SchemeService);

    SchemeService.$inject = ['$http', '$q'];
    
    function SchemeService($http, $q){
        function get(reactionName){
            var deferred = $q.defer();
            
            $http({
                method: 'GET',
                url: '/scheme/' + reactionName + '.json'
            }).then(function(result){
                console.log(result.data);
                
                deferred.resolve(result.data);
            },function(){
                deferred.reject("REACTIONSCHEME NOT FOUND");
            });
            
            return deferred.promise;
            
        }
        
        return get;
    }
})();