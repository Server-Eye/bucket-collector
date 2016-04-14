(function() {
    "use strict";

    angular.module('bucket-collector').factory('ReactionDataService', ReactionDataService);

    ReactionDataService.$inject = ['$http', '$q'];

    function ReactionDataService($http, $q) {
        return {
            get: get,
            set: set
        };

        function set(name, data) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: '/reactionData/' + name + '/set',
                data: data
            }).then(function(res) {
                var result = res.data;

                if (result.success) {
                    deferred.resolve(result.data);
                } else {
                    deferred.reject(result.message);
                }
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function get(name) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/reactionData/' + name + '/get'
            }).then(function(res) {
                var result = res.data;
                if (result.success) {
                    deferred.resolve(result.data);
                } else {
                    deferred.reject(result.message);
                }
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;

        }
    }
})();