(function() {
    "use strict";

    angular.module('bucket-collector').factory('SchemeService', SchemeService);

    SchemeService.$inject = ['$http', '$q'];

    function SchemeService($http, $q) {
        function get(reactionName) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/scheme/' + reactionName + '.json'
            }).then(function(result) {
                console.log(result.data);

                deferred.resolve(result.data);
            }, function(err) {
                if (err.status == 404) {
                    deferred.reject("No additional data defined.");
                } else {
                    deferred.reject(err);
                }
            });

            return deferred.promise;
        }
        return get;
    }
})();