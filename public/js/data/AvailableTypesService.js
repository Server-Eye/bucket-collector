(function () {
    "use strict";

    angular.module('bucket-collector').factory('AvailableTypesService', AvailableTypesService);

    AvailableTypesService.$inject = ['$http', '$q'];

    function AvailableTypesService($http, $q) {
        return {
            get: get
        };

        function get() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getAvailableTypes'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(data.availableTypes);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }
})();