(function () {
    "use strict";

    angular.module('bucket-collector').factory('TypeService', TypeService);

    TypeService.$inject = ['$http', '$q'];

    function TypeService($http, $q) {
        return {
            get: getType,
            set: setType
        };

        function getType() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getType'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(data.type);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function setType(type) {
            var deferred = $q.defer();

            if (angular.isString(type)) {
                $http({
                    method: 'GET',
                    url: '/settings/setType',
                    params: {
                        type: type
                    }
                }).then(function (result) {
                    var data = result.data;

                    if (data.success) {
                        deferred.resolve(type);
                    } else {
                        deferred.reject(data.message);
                    }
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject("Given type is not a string");
            }

            return deferred.promise;
        }
    }
})();