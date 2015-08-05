(function () {
    "use strict";

    angular.module('bucket-collector').factory('ActiveBucketIdsService', ActiveBucketIdsService);

    ActiveBucketIdsService.$inject = ['$http', '$q'];

    function ActiveBucketIdsService($http, $q) {
        return {
            get: getActiveBIds,
            set: setActiveBIds
        };

        function getActiveBIds() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getActiveBucketIds'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(data.activeBucketsIds);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function setActiveBIds(aBIds) {
            var deferred = $q.defer();

            if (angular.isArray(aBIds)) {
                $http({
                    method: 'GET',
                    url: '/settings/setActiveBucketIds',
                    params: {
                        activeBucketIds: aBIds
                    }
                }).then(function (result) {
                    var data = result.data;

                    if (data.success) {
                        deferred.resolve(aBIds);
                    } else {
                        deferred.reject(data.message);
                    }
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject("Given IDS is not an array");
            }

            return deferred.promise;
        }
    }
})();