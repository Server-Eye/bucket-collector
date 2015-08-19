(function () {
    "use strict";

    angular.module('bucket-collector').factory('BucketsService', BucketsService);

    BucketsService.$inject = ['API_URL', 'SettingsService', '$http', '$q'];

    function BucketsService(API_URL, Settings, $http, $q) {
        return {
            getAll: getAll,
            getActive: getActive,
            getActiveStats: getActiveStats
        };

        function getAll(apiKey) {
            var deferred = $q.defer();

            if (apiKey && angular.isString(apiKey)) {
                $http({
                    method: 'GET',
                    url: API_URL.v2 + '/customer/bucket',
                    params: {
                        apiKey: apiKey
                    }
                }).then(function (result) {
                    var data = result.data;
                    if (!angular.isArray(data)) {
                        result = [data];
                    }
                    console.log(data);

                    addBucketUsers(apiKey, data).then(function (buckets) {
                        return buckets;
                    }, function (err) {
                        console.log(err);
                        return data;
                    }).then(function (buckets) {
                        addActiveState(apiKey, buckets).then(function (buckets) {
                            deferred.resolve(buckets);
                        }, function () {
                            deferred.resolve(buckets);
                        });
                    });
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject("ApiKey needed");
            }
            return deferred.promise;
        }

        function getBucketUsers(apiKey, bId) {
            var deferred = $q.defer();

            if ((apiKey && angular.isString(apiKey)) && (bId && angular.isString(bId))) {
                $http({
                    method: 'GET',
                    url: API_URL.v2 + '/customer/bucket/' + bId + '/user',
                    params: {
                        apiKey: apiKey
                    }
                }).then(function (result) {
                    var data = result.data;
                    deferred.resolve(data);
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject("ApiKey and bId needed");
            }
            return deferred.promise;
        }

        function addBucketUsers(apiKey, buckets) {
            var deferred = $q.defer();

            var promises = [];

            angular.forEach(buckets, function (bucket) {
                promises.push(getBucketUsers(apiKey, bucket.bId).then(function (users) {
                    if (angular.isArray(users) && users.length) {
                        bucket.users = users;
                    }
                    return users;
                }, function (err) {
                    return err;
                }));
            });

            $q.all(promises).then(function (res) {
                console.log(buckets);
                deferred.resolve(buckets);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function addActiveState(apiKey, buckets) {
            var deferred = $q.defer();

            Settings.get().then(function (settings) {
                var activeIds = settings.activeBucketIds;

                angular.forEach(buckets, function (bucket) {
                    if (activeIds.indexOf(bucket.bId) > -1) {
                        bucket.active = true;
                    } else {
                        bucket.active = false;
                    }
                });

                deferred.resolve(buckets);
            }, function (err) {
                console.log(err);
                deferred.resolve(buckets);
            });

            return deferred.promise;
        }
        
        function getActive(apiKey){
            var deferred = $q.defer();
            var activeBuckets = [];
            
            getAll(apiKey).then(function(buckets){
                angular.forEach(buckets, function(bucket){
                    if(bucket.active){
                        activeBuckets.push(bucket);
                    }
                });
                deferred.resolve(activeBuckets);
            });
            
            return deferred.promise;
        }
        
        function getActiveStats(apiKey){
            var deferred = $q.defer();
            
            getActive(apiKey).then(function (buckets){
                var promises = [];
                
                angular.forEach(buckets, function(bucket){
                    promises.push(getStats(bucket.bId).then(function(stats){
                        bucket.stats = stats;
                    }));
                });
                
                $q.all(promises).then(function (res){
                    deferred.resolve(buckets);
                }, function(err){
                    
                });
            });
            
            return deferred.promise;
        }
        
        function getStats(bId){
            var deferred = $q.defer();
            
            if(bId && angular.isString(bId)){
                $http({
                    method: 'GET',
                    url: '/stats/' + bId,
                }).then(function (result) {
                    var data = result.data;
                    if(data.success){
                        deferred.resolve(data.stats);
                    } else {
                        deferred.reject(data.message);
                    }
                }, function (err) {
                    deferred.reject(err);
                });
            }            
            
            return deferred.promise;
        }
    }
})();