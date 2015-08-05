(function () {
    "use strict";

    angular.module('bucket-collector').factory('IntervalService', IntervalService);

    IntervalService.$inject = ['$http', '$q'];

    function IntervalService($http, $q) {
        return {
            get: getInterv,
            set: setInterv
        };

        function getInterv() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getInterv'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(data.interval);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function setInterv(interv) {
            var deferred = $q.defer();

            if (angular.isNumber(interv)) {
                $http({
                    method: 'GET',
                    url: '/settings/setInterv',
                    params: {
                        interval: interv
                    }
                }).then(function (result) {
                    var data = result.data;

                    if (data.success) {
                        deferred.resolve(interv);
                    } else {
                        deferred.reject(data.message);
                    }
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject("Given interval is NaN");
            }

            return deferred.promise;
        }
    }
})();