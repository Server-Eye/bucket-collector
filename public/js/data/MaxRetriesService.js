(function () {
    "use strict";

    angular.module('bucket-collector').factory('MaxRetriesService', MaxRetriesService);

    MaxRetriesService.$inject = ['$http', '$q'];

    function MaxRetriesService($http, $q) {
        return {
            get: getMaxRetries,
            set: setMaxRetries
        };

        function getMaxRetries() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getMaxRetries'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(data.maxRetries);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function setMaxRetries(maxRetries) {
            var deferred = $q.defer();

            if (angular.isNumber(maxRetries)) {
                $http({
                    method: 'GET',
                    url: '/settings/setMaxRetries',
                    params: {
                        maxRetries: maxRetries
                    }
                }).then(function (result) {
                    var data = result.data;

                    if (data.success) {
                        deferred.resolve(maxRetries);
                    } else {
                        deferred.reject(data.message);
                    }
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject("Given maxRetries is NaN");
            }

            return deferred.promise;
        }
    }
})();